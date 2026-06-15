import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { PrismaClient } from "@prisma/client"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2026-05-27.dahlia" as any,
})

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    // Update the organization's subscription in the database
    if (session?.client_reference_id) {
      await prisma.organization.update({
        where: {
          id: session.client_reference_id,
        },
        data: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          plan: "PRO", // Determine plan based on price ID
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        },
      })
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    await prisma.organization.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        plan: "PRO",
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
    })
  }

  return new NextResponse(null, { status: 200 })
}
