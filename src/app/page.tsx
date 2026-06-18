import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Hexagon, CheckCircle2, LayoutDashboard, CreditCard, Users, Zap, Moon, Shield } from 'lucide-react'
import dbConnect from '@/lib/mongoose'
import { PlatformSetting } from '@/models/PlatformSetting'
import { formatCurrency } from '@/lib/formatters'

export default async function LandingPage() {
  await dbConnect();
  const currencySetting = await PlatformSetting.findOne({ key: "defaultCurrency" });
  const currency = currencySetting?.value || "USD ($)";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <Hexagon className="h-5 w-5" />
          </div>
          SaaS Kit
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">Login</Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full relative overflow-hidden py-8 md:py-12 flex items-center justify-center text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background pointer-events-none" />
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Build your SaaS <span className="text-primary">faster</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[700px] text-muted-foreground md:text-xl">
              The ultimate starter kit for your next big idea. Includes authentication, billing, dashboard, and more. Ship in days, not months.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8">Start Building for Free</Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="h-12 px-8">View Documentation</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-8 md:py-12 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need</h2>
              <p className="mt-4 text-muted-foreground text-lg">A complete toolkit designed to accelerate your development.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Authentication', icon: Shield, desc: 'Secure JWT and OAuth authentication built right in.' },
                { title: 'Dashboard', icon: LayoutDashboard, desc: 'Beautiful, responsive dashboard with Recharts integration.' },
                { title: 'Billing', icon: CreditCard, desc: 'Stripe integration for easy subscription management.' },
                { title: 'Multi-tenancy', icon: Users, desc: 'Built-in organization and team member management.' },
                { title: 'API Access', icon: Zap, desc: 'Robust API route handlers and key generation for users.' },
                { title: 'Dark Mode', icon: Moon, desc: 'Stunning dark mode powered by Tailwind CSS and next-themes.' },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="flex flex-col p-8 bg-background rounded-3xl border shadow-sm">
                <h3 className="text-2xl font-bold">Free</h3>
                <div className="mt-4 text-4xl font-extrabold">{formatCurrency(0, currency)}<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                <ul className="mt-8 space-y-4 flex-1">
                  {['1 User', 'Basic Analytics', 'Community Support'].map(feature => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full" variant="outline">Get Started</Button>
              </div>
              
              {/* Pro Plan */}
              <div className="flex flex-col p-8 bg-primary text-primary-foreground rounded-3xl shadow-xl relative scale-105">
                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                  <span className="bg-background text-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-border shadow-md">Popular</span>
                </div>
                <h3 className="text-2xl font-bold">Pro</h3>
                <div className="mt-4 text-4xl font-extrabold">{formatCurrency(999, currency)}<span className="text-lg font-normal opacity-80">/mo</span></div>
                <ul className="mt-8 space-y-4 flex-1">
                  {['Unlimited Users', 'Advanced Analytics', 'Priority Support', 'Custom Domain'].map(feature => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 opacity-90" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full bg-background text-foreground hover:bg-muted">Upgrade to Pro</Button>
              </div>

              {/* Enterprise Plan */}
              <div className="flex flex-col p-8 bg-background rounded-3xl border shadow-sm">
                <h3 className="text-2xl font-bold">Enterprise</h3>
                <div className="mt-4 text-4xl font-extrabold">Custom</div>
                <ul className="mt-8 space-y-4 flex-1">
                  {['Dedicated Instance', 'SLA Guarantee', '24/7 Phone Support', 'Custom Integration'].map(feature => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full" variant="outline">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-8 md:py-12 border-t bg-muted/20">
        <div className="container max-w-5xl mx-auto flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Hexagon className="h-6 w-6 text-primary" />
            SaaS Kit
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by SaaS Kit. The source code is available on GitHub.
          </p>
        </div>
      </footer>
    </div>
  )
}
