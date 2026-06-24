"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { completeMockPayment } from "../actions";
import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MockCheckoutPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "PRO";
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // simulate gateway delay
    await completeMockPayment(plan);
    router.push("/dashboard/billing?success=true");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/20">
      <Card className="w-full max-w-md shadow-2xl border-none ring-1 ring-border/50">
        <CardHeader className="text-center space-y-2 pb-6 border-b">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Secure Checkout</CardTitle>
          <CardDescription className="text-base">
            You are upgrading to the <strong className="text-foreground">{plan}</strong> plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-dashed">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{plan === "PRO" ? "₹999.00" : "₹4,999.00"}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-dashed">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-semibold">₹0.00</span>
          </div>
          <div className="flex justify-between items-center py-4 text-lg">
            <span className="font-bold text-foreground">Total Due Today</span>
            <span className="font-bold text-primary text-2xl">{plan === "PRO" ? "₹999.00" : "₹4,999.00"}</span>
          </div>
          <div className="bg-muted p-4 rounded-xl text-sm text-center text-muted-foreground">
            This is a mock checkout page for development. No real card is charged.
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pb-8">
          <Button 
            className="w-full h-14 text-lg rounded-xl shadow-lg" 
            onClick={handlePayment} 
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Payment...</>
            ) : (
              `Pay ${plan === "PRO" ? "₹999.00" : "₹4,999.00"}`
            )}
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => router.back()} disabled={loading}>
            Cancel and return
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
