export default function DocsPage() {
  return (
    <div className="space-y-12 max-w-3xl">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Documentation</h1>
        <p className="text-xl text-muted-foreground">Learn how to integrate, use, and scale your SaaS Kit application.</p>
      </div>

      <section id="getting-started" className="space-y-4 pt-12">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Getting Started</h2>
        <p className="leading-7">To install the SaaS Kit, you need to configure your environment variables and run the initialization script.</p>
        
        <div className="rounded-md bg-muted p-4 font-mono text-sm">
          <p>git clone https://github.com/example/saas-kit.git</p>
          <p>cd saas-kit</p>
          <p>npm install</p>
          <p>npx prisma db push</p>
          <p>npm run dev</p>
        </div>
      </section>

      <section id="authentication" className="space-y-4 pt-12">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors">Authentication</h2>
        <p className="leading-7">Authentication is handled natively by NextAuth.js (Auth.js v5). It supports OAuth providers and email magic links. Sessions are securely managed via JWT tokens stored in HTTP-only cookies.</p>
        <p className="leading-7">Protected routes are automatically intercepted by the Next.js middleware, ensuring unauthorized users are redirected to the login page.</p>
      </section>

      <section id="api-reference" className="space-y-4 pt-12">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors">API Reference</h2>
        <div className="my-6 w-full overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Method</th>
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Endpoint</th>
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Description</th>
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Auth</th>
              </tr>
            </thead>
            <tbody>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"><span className="font-mono text-xs bg-muted p-1 rounded font-bold text-blue-500">GET</span></td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"><code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">/api/users</code></td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">Fetches a list of users.</td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">Admin</td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"><span className="font-mono text-xs bg-muted p-1 rounded font-bold text-green-500">POST</span></td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"><code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">/api/billing/checkout</code></td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">Creates a Stripe checkout session.</td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">Required</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="billing" className="space-y-4 pt-12 pb-24">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors">Billing & Stripe</h2>
        <p className="leading-7">Billing is integrated out-of-the-box with Stripe. Webhooks securely sync your database whenever a subscription is updated or a payment succeeds.</p>
      </section>
    </div>
  )
}
