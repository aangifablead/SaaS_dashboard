import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import mongoose from "mongoose"
import dbConnect from "@/lib/mongoose"
import { User } from "@/models/User"
import { Invoice } from "@/models/Invoice"
import { StripeEvent } from "@/models/StripeEvent"
import { stripe } from "@/lib/stripe"

// This maps Stripe Price IDs to our internal plan strings
// In a real app, these come from your environment variables
const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.STRIPE_PRO_PRICE_ID || "price_pro_mock"]: "PRO",
  [process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise_mock"]: "ENTERPRISE",
};

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_dummy"
    )
  } catch (error: any) {
    console.error(`Webhook signature verification failed. ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  await dbConnect();

  // 1. Idempotency Check
  try {
    const existingEvent = await StripeEvent.findOne({ stripeEventId: event.id });
    if (existingEvent) {
      console.log(`Webhook ${event.id} already processed. Skipping.`);
      return new NextResponse("Already processed", { status: 200 });
    }
    await StripeEvent.create({ stripeEventId: event.id, type: event.type });
  } catch (err: any) {
    if (err.code === 11000) {
      // Race condition caught by unique index
      return new NextResponse("Already processed", { status: 200 });
    }
    throw err;
  }

  // 2. Transaction for atomic updates
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const dataObject = event.data.object as any;

      switch (event.type) {
        case "checkout.session.completed": {
          const checkoutSession = dataObject as Stripe.Checkout.Session;
          if (checkoutSession.mode === 'subscription' && checkoutSession.client_reference_id) {
            const subscription = await stripe.subscriptions.retrieve(checkoutSession.subscription as string);
            
            await User.findByIdAndUpdate(
              checkoutSession.client_reference_id, 
              {
                stripeSubId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                paymentMethodId: subscription.default_payment_method as string,
              },
              { session }
            );
          }
          break;
        }

        case "invoice.payment_succeeded": {
          const invoice = dataObject as any;
          if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string) as any;
            const priceId = subscription.items.data[0].price.id;
            const plan = PRICE_TO_PLAN[priceId] || "PRO";

            const user = await User.findOneAndUpdate(
              { stripeSubId: subscription.id },
              {
                plan,
                planExpiresAt: new Date(subscription.current_period_end * 1000),
                billingCycleStart: new Date(subscription.current_period_start * 1000),
                nextBillingDate: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                // Reset usage limits for the new cycle
                usageCounters: { apiCalls: 0, storageUsed: 0, teamMembers: 1 }
              },
              { session, new: true }
            );

            if (user) {
              await Invoice.create([{
                userId: user._id,
                stripeInvoiceId: invoice.id,
                amount: invoice.amount_paid / 100,
                currency: invoice.currency,
                status: "paid",
                plan: plan,
                invoiceUrl: invoice.hosted_invoice_url || "",
              }], { session });
            }
          }
          break;
        }

        case "invoice.payment_failed": {
          const invoice = dataObject as any;
          if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string) as any;
            const user = await User.findOne({ stripeSubId: subscription.id }).session(session);

            if (user) {
              await Invoice.create([{
                userId: user._id,
                stripeInvoiceId: invoice.id,
                amount: invoice.amount_due / 100,
                currency: invoice.currency,
                status: "failed",
                plan: user.plan,
                invoiceUrl: invoice.hosted_invoice_url || "",
              }], { session });
            }
          }
          break;
        }

        case "customer.subscription.updated": {
          const subscription = dataObject as Stripe.Subscription;
          await User.findOneAndUpdate(
            { stripeSubId: subscription.id },
            { cancelAtPeriodEnd: subscription.cancel_at_period_end },
            { session }
          );
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = dataObject as Stripe.Subscription;
          // When a subscription is fully canceled/expired, downgrade to FREE
          await User.findOneAndUpdate(
            { stripeSubId: subscription.id },
            {
              plan: "FREE",
              cancelAtPeriodEnd: false,
              stripeSubId: null,
              planExpiresAt: null,
              nextBillingDate: null
            },
            { session }
          );
          break;
        }

        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    });
  } catch (error) {
    console.error("Transaction failed:", error);
    return new NextResponse(`Transaction Error`, { status: 500 });
  } finally {
    session.endSession();
  }

  return new NextResponse(null, { status: 200 })
}
