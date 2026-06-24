import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, CreditCard as CreditCardIcon, Download, AlertCircle } from "lucide-react"
import dbConnect from "@/lib/mongoose"
import { PlatformSetting } from "@/models/PlatformSetting"
import { auth } from "@/auth"
import { User } from "@/models/User"
import { Invoice } from "@/models/Invoice"
import { formatCurrency } from "@/lib/formatters"
import { ActionButton } from "./BillingActionButtons"
import { updatePlan, removePaymentMethod, createMockCheckoutSession, createMockPortalSession } from "./actions"

export default async function BillingPage() {
  await dbConnect();
  
  const session = await auth();
  if (!session?.user?.email) return null;
  
  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) return null;
  
  const invoices = await Invoice.find({ userId: user._id }).sort({ createdAt: -1 }).lean() || [];

  // Calculate actual team members count if in an organization
  let teamMembersCount = 1;
  if (user.organizationId) {
    teamMembersCount = await User.countDocuments({ organizationId: user.organizationId });
  }

  // Set limits based on active plan
  const planLimits: Record<string, any> = {
    FREE: { api: 1000, storage: 1, team: 1 },
    PRO: { api: 10000, storage: 10, team: 10 },
    ENTERPRISE: { api: 'Unlimited', storage: 'Unlimited', team: 'Unlimited' }
  };
  const limits = planLimits[user.plan] || planLimits.FREE;
  
  // Real metrics (0 since no backend models exist yet for API/Storage tracking)
  const currentApiCalls = 0;
  const currentStorage = 0;

  const currencySetting = await PlatformSetting.findOne({ key: "defaultCurrency" });
  const currency = currencySetting?.value || "USD ($)";
  return (
    <div className="flex flex-col gap-10 pb-12 max-w-6xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Billing & Subscriptions
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
          Manage your plan, monitor your team's usage, and download your latest invoices.
        </p>
      </div>

      {/* CURRENT PLAN CARD */}
      <Card className="shadow-lg border-border overflow-hidden rounded-2xl relative">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
        <CardContent className="p-0 relative z-10 bg-card">
          <div className="grid lg:grid-cols-12 gap-0">
            <div className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-border bg-gradient-to-br from-primary/[0.03] to-transparent flex flex-col justify-between lg:col-span-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground capitalize">{user.plan.toLowerCase()} Plan</h2>
                  <Badge className="bg-primary text-primary-foreground border-none font-semibold uppercase tracking-wider px-2 w-fit">Current</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-6">You are currently on the <span className="capitalize">{user.plan.toLowerCase()}</span> plan. Your next billing date is {user.planExpiresAt ? new Date(user.planExpiresAt).toLocaleDateString() : 'N/A'}.</p>
                <div className="text-4xl font-extrabold text-foreground mb-6">
                  {formatCurrency(user.plan === "FREE" ? 0 : 999, currency)}<span className="text-lg font-medium text-muted-foreground">/mo</span>
                </div>
              </div>
              <div className="space-y-4">
                <ActionButton action={user.plan === "FREE" ? createMockCheckoutSession.bind(null, "PRO") : undefined} message={user.plan === "FREE" ? "Successfully upgraded to Pro Plan!" : "You are already on a premium plan!"} className="w-full shadow-md rounded-xl py-6 text-base font-semibold transition-all hover:-translate-y-0.5">Upgrade Plan</ActionButton>
                <div className="text-center">
                  <ActionButton action={updatePlan.bind(null, "FREE")} variant="link" requireConfirm="Are you sure you want to cancel your subscription? This action cannot be undone." message="Successfully cancelled subscription. You are now on the Free Plan." className="text-muted-foreground hover:text-destructive h-auto p-0 font-medium text-sm transition-colors">Cancel Subscription</ActionButton>
                </div>
              </div>
            </div>
            
            <div className="p-8 md:p-10 lg:col-span-8 bg-card">
              <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-2">
                <span className="text-2xl leading-none">⚡</span>
                Current Usage
              </h3>
              <div className="space-y-8">
                {/* API Calls */}
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-foreground">API Calls</span>
                    <span className="text-muted-foreground">
                      {limits.api === 'Unlimited' ? 'Unlimited' : `${currentApiCalls} / ${limits.api.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: limits.api === 'Unlimited' ? '100%' : `${Math.min((currentApiCalls / limits.api) * 100, 100)}%` }} />
                  </div>
                </div>

                {/* Storage */}
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-foreground">Storage</span>
                    <span className="text-muted-foreground">
                      {limits.storage === 'Unlimited' ? 'Unlimited' : `${currentStorage} / ${limits.storage} GB`}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-[#a855f7] rounded-full transition-all" style={{ width: limits.storage === 'Unlimited' ? '100%' : `${Math.min((currentStorage / limits.storage) * 100, 100)}%` }} />
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-foreground">Team Members</span>
                    <span className="text-muted-foreground">
                      {limits.team === 'Unlimited' ? `${teamMembersCount} (Unlimited)` : `${teamMembersCount} / ${limits.team}`}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-warning rounded-full transition-all" style={{ width: limits.team === 'Unlimited' ? '0%' : `${Math.min((teamMembersCount / limits.team) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
              
              {limits.team !== 'Unlimited' && teamMembersCount >= limits.team && (
                <div className="mt-8 flex items-start gap-3 bg-amber-50 text-amber-600 border border-amber-300 p-4 rounded-xl">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">
                    You have reached your team member limit. Consider upgrading your plan if you need to add more team members.
                  </p>
                </div>
              )}
              {limits.team !== 'Unlimited' && teamMembersCount === limits.team - 1 && (
                <div className="mt-8 flex items-start gap-3 bg-amber-50 text-amber-600 border border-amber-300 p-4 rounded-xl">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">
                    You are approaching your team member limit. Consider upgrading your plan if you need to add more team members.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PLANS COMPARISON ROW */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-6">Available Plans</h3>
        <div className="grid gap-6 md:grid-cols-3 pt-4">
          {/* Free Plan */}
        <div className="relative pt-6">
          {user.plan === "FREE" && (
            <div className="absolute top-6 -translate-y-1/2 right-6 z-20">
              <Badge className="bg-primary text-primary-foreground border-none font-bold uppercase tracking-wider px-3 py-1 shadow-md">Current</Badge>
            </div>
          )}
          <Card className={`relative bg-card shadow-sm border flex flex-col h-full rounded-2xl transition-all hover:shadow-md ${user.plan === "FREE" ? "border-primary/50 shadow-primary/10" : "border-border hover:border-border/80"}`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex justify-between items-center text-foreground">
                Free
              </CardTitle>
              <div className="mt-2 text-4xl font-extrabold text-foreground">{formatCurrency(0, currency)}<span className="text-base font-medium text-muted-foreground">/mo</span></div>
            </CardHeader>
            <CardContent className="flex-1 pb-6">
              <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary/70" /> 1k API calls</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary/70" /> 1GB storage</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary/70" /> 1 user</li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto pt-6 border-t border-border/50 bg-muted/20 rounded-b-2xl">
              {user.plan === "FREE" ? (
                <Button disabled className="w-full bg-[#f1f1f1] text-gray-500 opacity-100 rounded-xl py-3 font-semibold cursor-not-allowed">Current Plan</Button>
              ) : (
                <ActionButton action={updatePlan.bind(null, "FREE")} requireConfirm="Are you sure you want to downgrade to the Free plan?" message="Successfully downgraded to Free Plan!" variant="outline" className="w-full rounded-xl py-3 font-semibold hover:bg-muted/50 transition-colors">Downgrade to Free</ActionButton>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Pro Plan */}
        <div className="relative pt-6 z-10 scale-100 lg:scale-105">
          <div className="absolute top-6 -translate-y-1/2 right-6 z-20">
            <Badge className="bg-white text-slate-900 border-none font-bold uppercase tracking-widest px-4 py-1.5 shadow-lg shadow-white/10 ring-1 ring-white/20 hover:bg-slate-50 transition-colors">Popular</Badge>
          </div>
          <Card className={`shadow-2xl relative flex flex-col h-full rounded-2xl transition-all border-none ${user.plan === "PRO" ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}>
            {/* Seamless dark gradient for Pro covering the entire card */}
            <div className="absolute inset-0 bg-slate-900 dark:bg-slate-950 rounded-2xl z-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50"></div>
            </div>
            
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="text-2xl flex justify-between items-center text-white">
                Pro
              </CardTitle>
              <div className="mt-4 text-4xl font-extrabold text-white">{formatCurrency(999, currency)}<span className="text-base font-medium text-slate-400">/mo</span></div>
            </CardHeader>
            <CardContent className="flex-1 pt-6 pb-6 relative z-10">
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> 10k API calls</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> 10GB storage</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> 10 users</li>
              </ul>
            </CardContent>
            {/* Transparent footer to fix the gray block issue */}
            <CardFooter className="mt-auto relative z-10 pt-6 border-t border-white/10 bg-transparent rounded-b-2xl">
              {user.plan === "PRO" ? (
                <Button disabled className="w-full bg-white/10 text-white opacity-100 rounded-xl py-3 font-semibold border border-white/10 cursor-not-allowed">Current Plan</Button>
              ) : user.plan === "FREE" ? (
                <ActionButton action={createMockCheckoutSession.bind(null, "PRO")} message="Successfully upgraded to Pro Plan!" className="w-full shadow-lg rounded-xl py-3 font-semibold hover:-translate-y-0.5 transition-transform bg-white text-slate-900 hover:bg-slate-100">Upgrade to Pro</ActionButton>
              ) : (
                <ActionButton action={updatePlan.bind(null, "PRO")} requireConfirm="Are you sure you want to downgrade to the Pro plan?" message="Successfully downgraded to Pro Plan!" variant="outline" className="w-full rounded-xl py-3 font-semibold bg-transparent text-white border-white/20 hover:bg-white/10 transition-colors">Downgrade to Pro</ActionButton>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Enterprise Plan */}
        <div className="relative pt-6">
          {user.plan === "ENTERPRISE" && (
            <div className="absolute top-6 -translate-y-1/2 right-6 z-20">
              <Badge className="bg-primary text-primary-foreground border-none font-bold uppercase tracking-wider px-3 py-1 shadow-md">Current</Badge>
            </div>
          )}
          <Card className={`relative bg-card shadow-sm border flex flex-col h-full rounded-2xl transition-all hover:shadow-md ${user.plan === "ENTERPRISE" ? "border-primary/50 shadow-primary/10" : "border-border hover:border-border/80"}`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex justify-between items-center text-foreground">
                Enterprise
              </CardTitle>
              <div className="mt-2 text-4xl font-extrabold text-foreground">Custom</div>
            </CardHeader>
            <CardContent className="flex-1 pb-6">
              <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary/70" /> Unlimited API calls</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary/70" /> Unlimited storage</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary/70" /> Unlimited users</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary/70" /> 24/7 Phone support</li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto pt-6 border-t border-border/50 bg-muted/20 rounded-b-2xl">
              {user.plan === "ENTERPRISE" ? (
                <Button disabled className="w-full bg-[#f1f1f1] text-gray-500 opacity-100 rounded-xl py-3 font-semibold cursor-not-allowed">Current Plan</Button>
              ) : (
                <ActionButton action={createMockCheckoutSession.bind(null, "ENTERPRISE")} message="Successfully upgraded to Enterprise Plan!" variant="outline" className="w-full rounded-xl py-3 font-semibold bg-white hover:bg-slate-50 transition-colors border-slate-800 text-slate-900 shadow-sm">Contact Sales</ActionButton>
              )}
            </CardFooter>
          </Card>
        </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 mt-8">
        {/* PAYMENT METHOD CARD */}
        <Card className="shadow-sm border-border flex flex-col rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-44 w-full rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-black p-6 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden flex flex-col justify-between group cursor-default transition-transform hover:scale-[1.02]">
              {/* Decorative glows */}
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/5 blur-xl group-hover:bg-white/10 transition-colors" />
              <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-primary/20 blur-xl" />
              
              <div className="flex justify-between items-start z-10">
                <CreditCardIcon className="h-8 w-8 text-white/90 drop-shadow-md" />
                <div className="text-2xl font-black italic tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">VISA</div>
              </div>
              <div className="z-10 mt-auto">
                <div className="font-mono text-lg md:text-xl tracking-widest mb-2 text-white/90 drop-shadow-sm whitespace-nowrap">•••• •••• •••• 4242</div>
                <div className="flex justify-between text-xs text-white/70 font-medium uppercase tracking-wider">
                  <span>Card Holder</span>
                  <span>Expires 12/28</span>
                </div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <ActionButton action={createMockPortalSession} variant="outline" className="w-full sm:w-auto font-medium shadow-sm hover:bg-slate-50 transition-colors">Change Card</ActionButton>
              <ActionButton action={removePaymentMethod} type="error" requireConfirm="Are you sure you want to remove this payment method? This could interrupt your subscription." message="Successfully removed payment method." className="w-full sm:w-auto font-medium shadow-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">Remove</ActionButton>
            </div>
          </CardContent>
        </Card>

        {/* INVOICE HISTORY */}
        <Card className="shadow-sm border-border flex flex-col rounded-2xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Invoice History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-transparent hover:bg-transparent">
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider h-11 pl-6">Invoice #</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider h-11">Date</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider h-11 text-right">Amount</TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider h-11 text-center">Status</TableHead>
                  <TableHead className="w-[80px] text-center pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No invoices found.</TableCell>
                  </TableRow>
                ) : invoices.map((invoice: any, i: number) => {
                  const isPaid = invoice.status.toLowerCase() === 'paid';
                  const statusColor = isPaid ? "bg-success/15 text-success" : "bg-warning/15 text-warning";
                  return (
                    <TableRow key={invoice._id} className="hover:bg-accent/50 border-border transition-colors">
                      <TableCell className="pl-6 py-3 font-medium text-sm text-foreground">{invoice.stripeInvoiceId}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-medium text-sm text-foreground">{formatCurrency(invoice.amount, currency)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={`${statusColor} hover:${statusColor} font-semibold border-none rounded-md px-2 py-0.5 capitalize`}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center pr-6">
                        {invoice.invoiceUrl && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" render={<a href={invoice.invoiceUrl} target="_blank" rel="noopener noreferrer" />}>
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
