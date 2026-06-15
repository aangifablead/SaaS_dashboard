import Link from "next/link"
import { Hexagon } from "lucide-react"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Hexagon className="h-5 w-5 text-primary" />
            <span className="hidden font-bold sm:inline-block">SaaS Kit</span>
          </Link>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
              <Link href="/login" className="text-muted-foreground hover:text-foreground">Login</Link>
            </nav>
          </div>
        </div>
      </header>
      
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 px-4 md:px-6">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <div className="py-6 pr-6 lg:py-8">
            <div className="w-full">
              <div className="pb-4">
                <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">Overview</h4>
                <div className="grid grid-flow-row auto-rows-max text-sm">
                  <Link href="#getting-started" className="flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground">Getting Started</Link>
                  <Link href="#authentication" className="flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground">Authentication</Link>
                  <Link href="#api-reference" className="flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground">API Reference</Link>
                </div>
              </div>
              <div className="pb-4">
                <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">Guides</h4>
                <div className="grid grid-flow-row auto-rows-max text-sm">
                  <Link href="#dashboard" className="flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground">Dashboard</Link>
                  <Link href="#billing" className="flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground">Billing</Link>
                  <Link href="#settings" className="flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground">Settings</Link>
                  <Link href="#webhooks" className="flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-muted-foreground">Webhooks</Link>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
