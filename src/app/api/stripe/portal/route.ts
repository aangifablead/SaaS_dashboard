import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ error: "No billing profile found" }, { status: 400 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error("Stripe Portal Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
