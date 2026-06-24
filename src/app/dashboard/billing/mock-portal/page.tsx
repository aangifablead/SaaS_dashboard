"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { completeMockPortalUpdate } from "../actions";
import { useState } from "react";
import { Loader2, CreditCard, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MockPortalPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);
    await completeMockPortalUpdate();
    router.push("/dashboard/billing?portal_success=true");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/20">
      <Card className="w-full max-w-md shadow-2xl border-none ring-1 ring-border/50">
        <CardHeader className="text-center space-y-2 pb-6 border-b">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Billing Portal</CardTitle>
          <CardDescription className="text-base">
            Update your payment method for future invoices.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-xl border-primary ring-1 ring-primary/20 bg-primary/5 cursor-pointer transition-colors">
              <div className="w-12 h-8 bg-[#1a1f36] rounded text-white flex items-center justify-center font-bold italic text-xs shadow-sm">VISA</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">•••• •••• •••• 4242</div>
                <div className="text-xs text-muted-foreground">Expires 12/25</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-xl bg-card hover:bg-muted/50 cursor-pointer transition-colors opacity-50">
              <div className="w-12 h-8 bg-slate-200 rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex-1 font-medium text-sm text-muted-foreground">
                + Add new payment method
              </div>
            </div>
          </div>
          <div className="bg-muted p-4 rounded-xl text-sm text-center text-muted-foreground mt-6">
            This is a mock billing portal for development.
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pb-8">
          <Button 
            className="w-full h-14 text-lg rounded-xl shadow-lg" 
            onClick={handleUpdate} 
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Changes...</>
            ) : (
              "Save Payment Method"
            )}
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => router.back()} disabled={loading}>
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
