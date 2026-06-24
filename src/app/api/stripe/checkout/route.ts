import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";

const PLAN_TO_PRICE: Record<string, string> = {
  "PRO": process.env.STRIPE_PRO_PRICE_ID || "price_pro_mock",
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { planId } = body;

    const priceId = PLAN_TO_PRICE[planId];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.plan === planId) {
      return NextResponse.json({ error: "You are already on this plan" }, { status: 400 });
    }

    let customerId = user.stripeCustomerId;

    // Create a checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?canceled=true`,
      client_reference_id: user._id.toString(),
      // Ensure we collect a payment method
      payment_method_collection: "always",
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
