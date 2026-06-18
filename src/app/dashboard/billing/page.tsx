import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, CreditCard as CreditCardIcon, Download, AlertCircle } from "lucide-react"
import dbConnect from "@/lib/mongoose"
import { PlatformSetting } from "@/models/PlatformSetting"
import { formatCurrency } from "@/lib/formatters"

export default async function BillingPage() {
  await dbConnect();
  const currencySetting = await PlatformSetting.findOne({ key: "defaultCurrency" });
  const currency = currencySetting?.value || "USD ($)";
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Payments</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your subscription, usage, and invoices
          </p>
        </div>
      </div>

      {/* CURRENT PLAN CARD */}
      <Card className="shadow-sm border-primary/20">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-3 gap-0">
            <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-border bg-primary/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">Pro Plan</h2>
                  <Badge className="bg-primary text-primary-foreground border-none font-semibold uppercase tracking-wider px-2">Current</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-6">You are currently on the Pro plan. Your next billing date is Nov 12, 2026.</p>
                <div className="text-4xl font-extrabold text-foreground mb-6">
                  {formatCurrency(999, currency)}<span className="text-lg font-medium text-muted-foreground">/mo</span>
                </div>
              </div>
              <div className="space-y-4">
                <Button className="w-full shadow-sm">Upgrade Plan</Button>
                <div className="text-center">
                  <Button variant="link" className="text-muted-foreground hover:text-destructive h-auto p-0 font-medium text-sm">Cancel Subscription</Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8 md:col-span-2">
              <h3 className="text-lg font-semibold text-foreground mb-6">Current Usage</h3>
              <div className="space-y-8">
                {/* API Calls */}
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-foreground">API Calls</span>
                    <span className="text-muted-foreground">7,234 / 10,000</span>
                  </div>
                  <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>

                {/* Storage */}
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-foreground">Storage</span>
                    <span className="text-muted-foreground">4.2 / 10 GB</span>
                  </div>
                  <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-[#a855f7] rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-foreground">Team Members</span>
                    <span className="text-muted-foreground">8 / 10</span>
                  </div>
                  <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-warning rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex items-start gap-3 bg-warning/10 text-warning p-4 rounded-xl">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium leading-relaxed">
                  You are approaching your team member limit. Consider upgrading your plan if you need to add more team members.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PLANS COMPARISON ROW */}
      <h3 className="text-lg font-semibold text-foreground mt-4 -mb-2">Available Plans</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Free Plan */}
        <Card className="shadow-sm border-border flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Free</CardTitle>
            <div className="mt-2 text-3xl font-extrabold">{formatCurrency(0, currency)}<span className="text-sm font-medium text-muted-foreground">/mo</span></div>
          </CardHeader>
          <CardContent className="flex-1 pb-6">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> 1k API calls</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> 1GB storage</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> 1 user</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Downgrade to Free</Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="shadow-md border-primary ring-1 ring-primary relative flex flex-col scale-100 md:scale-105 z-10">
          <div className="absolute top-0 right-6 transform -translate-y-1/2">
            <Badge className="bg-primary text-primary-foreground border-none font-bold uppercase tracking-wider px-3 py-1">Popular</Badge>
          </div>
          <CardHeader className="pb-4 bg-primary/5 rounded-t-xl">
            <CardTitle className="text-xl flex justify-between items-center">
              Pro
              <Badge variant="outline" className="bg-background text-primary border-primary font-semibold text-xs">Current Plan</Badge>
            </CardTitle>
            <div className="mt-2 text-3xl font-extrabold text-foreground">{formatCurrency(999, currency)}<span className="text-sm font-medium text-muted-foreground">/mo</span></div>
          </CardHeader>
          <CardContent className="flex-1 pt-6 pb-6">
            <ul className="space-y-3 text-sm font-medium text-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 10k API calls</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 10GB storage</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 10 users</li>
            </ul>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card className="shadow-sm border-border flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Enterprise</CardTitle>
            <div className="mt-2 text-3xl font-extrabold">Custom</div>
          </CardHeader>
          <CardContent className="flex-1 pb-6">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#a855f7]" /> Unlimited API calls</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#a855f7]" /> Unlimited storage</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#a855f7]" /> Unlimited users</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#a855f7]" /> 24/7 Phone support</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Contact Sales</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 mt-4">
        {/* PAYMENT METHOD CARD */}
        <Card className="shadow-sm lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              {/* Decorative circles */}
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -right-2 h-32 w-32 rounded-full bg-white/5" />
              
              <div className="flex justify-between items-start z-10">
                <CreditCardIcon className="h-8 w-8 text-white/80" />
                <div className="text-xl font-bold italic tracking-widest">VISA</div>
              </div>
              <div className="z-10">
                <div className="font-mono text-lg tracking-widest mb-1 opacity-90">•••• •••• •••• 4242</div>
                <div className="flex justify-between text-xs opacity-70 font-medium">
                  <span>Card Holder</span>
                  <span>Expires 12/28</span>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full text-xs shadow-sm h-9">Change Card</Button>
              <Button variant="outline" className="w-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 shadow-sm h-9">Remove</Button>
            </div>
          </CardContent>
        </Card>

        {/* INVOICE HISTORY */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Invoice History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-accent/30 hover:bg-accent/30">
                  <TableHead className="text-xs font-semibold text-muted-foreground h-9 pl-6">Invoice #</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground h-9">Date</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground h-9 text-right">Amount</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground h-9 text-center">Status</TableHead>
                  <TableHead className="w-[80px] text-center pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "INV-2026-010", date: "Oct 12, 2026", amount: formatCurrency(999, currency), status: "Paid", statusColor: "bg-success/15 text-success" },
                  { id: "INV-2026-009", date: "Sep 12, 2026", amount: formatCurrency(999, currency), status: "Paid", statusColor: "bg-success/15 text-success" },
                  { id: "INV-2026-008", date: "Aug 12, 2026", amount: formatCurrency(999, currency), status: "Paid", statusColor: "bg-success/15 text-success" },
                  { id: "INV-2026-007", date: "Jul 12, 2026", amount: formatCurrency(999, currency), status: "Paid", statusColor: "bg-success/15 text-success" },
                  { id: "INV-2026-006", date: "Jun 12, 2026", amount: formatCurrency(0, currency), status: "Paid", statusColor: "bg-success/15 text-success", plan: "Free" },
                  { id: "INV-2026-005", date: "May 12, 2026", amount: formatCurrency(0, currency), status: "Paid", statusColor: "bg-success/15 text-success", plan: "Free" },
                ].map((invoice, i) => (
                  <TableRow key={i} className="hover:bg-accent/50 border-border transition-colors">
                    <TableCell className="pl-6 py-3 font-medium text-sm text-foreground">{invoice.id}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{invoice.date}</TableCell>
                    <TableCell className="text-right font-medium text-sm text-foreground">{invoice.amount}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={`${invoice.statusColor} hover:${invoice.statusColor} font-semibold border-none rounded-md px-2 py-0.5`}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
