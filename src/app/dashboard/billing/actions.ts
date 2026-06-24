"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import { User } from "@/models/User";
import { Invoice } from "@/models/Invoice";
import { revalidatePath } from "next/cache";

export async function createMockCheckoutSession(newPlan: string) {
  // Instead of updating the DB directly, we redirect to a mock payment page
  return { url: `/dashboard/billing/mock-checkout?plan=${newPlan}` };
}

export async function completeMockPayment(newPlan: string) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };
  
  await dbConnect();
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { 
      $set: { 
        plan: newPlan,
        "usageCounters.apiCalls": 0,
        "usageCounters.storageUsed": 0,
      } 
    },
    { new: true }
  );

  if (user && (newPlan === "PRO" || newPlan === "ENTERPRISE")) {
    const amount = newPlan === "PRO" ? 999 : 4999;
    await Invoice.create({
      userId: user._id,
      stripeInvoiceId: `mock_inv_${Date.now()}`,
      amount,
      currency: "inr",
      status: "paid",
      plan: newPlan,
      invoiceUrl: "#",
    });
  }
  
  revalidatePath("/dashboard/billing");
  revalidatePath("/admin/revenue");
  return { success: true };
}

export async function updatePlan(newPlan: string) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };
  
  await dbConnect();
  await User.updateOne({ email: session.user.email }, { $set: { plan: newPlan } });
  
  revalidatePath("/dashboard/billing");
  return { success: true };
}

export async function removePaymentMethod() {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };
  
  // Here you would typically remove the default payment method from Stripe
  // using stripe.customers.update(user.stripeCustomerId, { invoice_settings: { default_payment_method: null } })
  
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
  return { success: true };
}

export async function createMockPortalSession() {
  // Instead of redirecting to Stripe Billing Portal, we redirect to a mock portal page
  return { url: `/dashboard/billing/mock-portal` };
}

export async function completeMockPortalUpdate() {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
  revalidatePath("/dashboard/billing");
  return { success: true };
}
