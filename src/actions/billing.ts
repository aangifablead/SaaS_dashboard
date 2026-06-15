"use server"

import Stripe from "stripe"
import { auth } from "@/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia" as any,
})

export async function createCheckoutSession(organizationId: string, priceId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Define your frontend URL (e.g., http://localhost:3000)
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${appUrl}/dashboard?success=true`,
    cancel_url: `${appUrl}/billing?canceled=true`,
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: session.user.email!,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    client_reference_id: organizationId,
  })

  return { url: stripeSession.url }
}
