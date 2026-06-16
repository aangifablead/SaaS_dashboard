"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Camera, CheckCircle2, Copy, Monitor, Smartphone, MoreHorizontal, Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { applyAccentColor } from "@/components/theme-provider"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { theme, setTheme } = useTheme()
  const [activeColor, setActiveColor] = useState<string | null>(null)

  // Initialize the active color dot on mount based on localStorage
  useEffect(() => {
    const savedColor = localStorage.getItem("accent-color") || "#6366f1"
    setActiveColor(savedColor)
  }, [])

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent border-b border-border w-full justify-start h-auto p-0 mb-6 flex-wrap">
          {[
            { id: "profile", label: "Profile" },
            { id: "security", label: "Security" },
            { id: "notifications", label: "Notifications" },
            { id: "apikeys", label: "API Keys" },
            { id: "appearance", label: "Appearance" },
          ].map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-medium data-[state=active]:text-primary text-muted-foreground hover:text-foreground"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
              <CardDescription>Update your account's profile information and email address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-3xl overflow-hidden ring-4 ring-background shadow-md">
                    JO
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                  <Button variant="outline" size="sm" className="mt-2 shadow-sm">Upload Picture</Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" className="shadow-sm bg-background focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    Email Address
                    <Badge variant="secondary" className="bg-success/15 text-success border-none h-5 px-1.5 rounded flex items-center gap-1 text-[10px] uppercase font-bold">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </Badge>
                  </Label>
                  <Input id="email" defaultValue="john.doe@example.com" disabled className="shadow-sm bg-muted/50 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" className="shadow-sm bg-background focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Acme Corp" className="shadow-sm bg-background focus-visible:ring-primary" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="founder">
                    <SelectTrigger id="role" className="shadow-sm bg-background">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="founder">Founder / CEO</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us a little bit about yourself" className="resize-none shadow-sm bg-background focus-visible:ring-primary h-24" defaultValue="I am the founder of Acme Corp. I love building things for the web." />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-accent/30 border-t border-border px-6 py-4 flex justify-end">
              <Button className="shadow-sm px-8">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg">Change Password</CardTitle>
              <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input id="current_password" type="password" className="shadow-sm bg-background focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input id="new_password" type="password" className="shadow-sm bg-background focus-visible:ring-primary" />
                <div className="flex gap-1 mt-2">
                  <div className="h-1 flex-1 bg-success rounded-full"></div>
                  <div className="h-1 flex-1 bg-success rounded-full"></div>
                  <div className="h-1 flex-1 bg-success rounded-full"></div>
                  <div className="h-1 flex-1 bg-accent rounded-full"></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Password strength: Strong</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input id="confirm_password" type="password" className="shadow-sm bg-background focus-visible:ring-primary" />
              </div>
            </CardContent>
            <CardFooter className="bg-accent/30 border-t border-border px-6 py-4">
              <Button className="shadow-sm">Update Password</Button>
            </CardFooter>
          </Card>

          <Card className="shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                <CardDescription>Add additional security to your account using two-factor authentication.</CardDescription>
              </div>
              <Switch />
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg mt-2 border border-border">
                <p className="text-sm text-foreground font-medium mb-1">Authenticator app</p>
                <p className="text-sm text-muted-foreground mb-4">Use an authenticator app or browser extension to get two-factor authentication codes when prompted.</p>
                <Button variant="outline" size="sm" className="shadow-sm">Set up</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg">Login History</CardTitle>
              <CardDescription>Recent active sessions on your account.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-y border-border bg-accent/30 hover:bg-accent/30">
                    <TableHead className="text-xs font-semibold text-muted-foreground pl-6">Device</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Location</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">IP Address</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground text-right pr-6">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b border-border">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm flex items-center gap-2">
                            Chrome on Mac OS 
                            <Badge className="bg-success/15 text-success hover:bg-success/15 border-none px-1.5 py-0 h-4 text-[10px]">Current</Badge>
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">San Francisco, CA</TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">192.168.1.1</TableCell>
                    <TableCell className="text-sm text-right pr-6 text-muted-foreground">Active now</TableCell>
                  </TableRow>
                  <TableRow className="border-none">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">Safari on iPhone</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">San Francisco, CA</TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">10.0.0.12</TableCell>
                    <TableCell className="text-sm text-right pr-6 text-muted-foreground">Yesterday, 10:45 AM</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-destructive/30 ring-1 ring-destructive/10 overflow-hidden">
            <CardHeader className="bg-destructive/5 border-b border-destructive/10">
              <CardTitle className="text-lg text-destructive flex items-center gap-2">Danger Zone</CardTitle>
              <CardDescription>Permanently delete your account and all of your data.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. Please be certain. All your projects, settings, and data will be permanently wiped.
              </p>
              <Button variant="destructive" className="shadow-sm">Delete Account</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications from SaaS Kit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Account */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Account</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Email notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about your account activity.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Security alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new logins and security issues.</p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">New user signups</Label>
                      <p className="text-sm text-muted-foreground">Get notified when a new user joins your app.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Payment alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about successful payments and failures.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Plan changes</Label>
                      <p className="text-sm text-muted-foreground">Get notified when users upgrade or downgrade.</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              {/* Marketing */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Marketing</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Product updates</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and improvements.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Weekly digest</Label>
                      <p className="text-sm text-muted-foreground">Receive a weekly summary of your app's performance.</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">Occasional emails about company news and events.</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API KEYS TAB */}
        <TabsContent value="apikeys" className="space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">API Keys</CardTitle>
                <CardDescription>Manage your API keys for authenticating requests.</CardDescription>
              </div>
              <Button className="shadow-sm">Generate New Key</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-y border-border bg-accent/30 hover:bg-accent/30">
                    <TableHead className="text-xs font-semibold text-muted-foreground pl-6">Name</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Key</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Permissions</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Created</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Last Used</TableHead>
                    <TableHead className="w-[80px] text-center pr-6"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b border-border">
                    <TableCell className="pl-6 py-4">
                      <span className="font-medium text-sm text-foreground">Production API Key</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-mono text-sm bg-muted px-2 py-1 rounded w-fit">
                        sk_live_••••••••••••••4f9a
                        <button className="text-muted-foreground hover:text-foreground">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-md">Full Access</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">Oct 10, 2026</TableCell>
                    <TableCell className="text-sm text-muted-foreground">2 mins ago</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Revoke</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-none">
                    <TableCell className="pl-6 py-4">
                      <span className="font-medium text-sm text-foreground">Test Key (Staging)</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-mono text-sm bg-muted px-2 py-1 rounded w-fit">
                        sk_test_••••••••••••••82bc
                        <button className="text-muted-foreground hover:text-foreground">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-accent text-muted-foreground border-none rounded-md">Read Only</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">Sep 05, 2026</TableCell>
                    <TableCell className="text-sm text-muted-foreground">Yesterday</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Revoke</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPEARANCE TAB */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="shadow-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg">Appearance</CardTitle>
              <CardDescription>Customize how SaaS Kit looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label className="text-base font-medium">Theme</Label>
                <div className="grid grid-cols-3 gap-4 max-w-2xl">
                  <div className="cursor-pointer" onClick={() => setTheme("light")}>
                    <div className={`aspect-video rounded-xl border-2 p-2 transition-colors ${theme === "light" ? "border-primary bg-primary/5 ring-offset-2 ring-2 ring-transparent" : "border-border bg-muted/30 hover:border-primary/50"}`}>
                      <div className="w-full h-full bg-white rounded-lg shadow-sm border flex flex-col p-2 gap-2">
                        <div className="w-full h-3 bg-slate-100 rounded-sm"></div>
                        <div className="flex gap-2 flex-1">
                          <div className="w-1/3 h-full bg-slate-100 rounded-sm"></div>
                          <div className="w-2/3 h-full bg-slate-100 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    <div className={`mt-2 text-center text-sm font-medium flex items-center justify-center gap-2 ${theme === "light" ? "text-primary font-bold" : "text-muted-foreground"}`}>
                      <Sun className="h-4 w-4" /> Light
                    </div>
                  </div>
                  <div className="cursor-pointer" onClick={() => setTheme("dark")}>
                    <div className={`aspect-video rounded-xl border-2 p-2 transition-colors ${theme === "dark" ? "border-primary bg-primary/5 ring-offset-2 ring-2 ring-transparent" : "border-border bg-muted/30 hover:border-primary/50"}`}>
                      <div className="w-full h-full bg-slate-950 rounded-lg shadow-sm border border-slate-800 flex flex-col p-2 gap-2">
                        <div className="w-full h-3 bg-slate-800 rounded-sm"></div>
                        <div className="flex gap-2 flex-1">
                          <div className="w-1/3 h-full bg-slate-800 rounded-sm"></div>
                          <div className="w-2/3 h-full bg-slate-800 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    <div className={`mt-2 text-center text-sm font-medium flex items-center justify-center gap-2 ${theme === "dark" ? "text-primary font-bold" : "text-muted-foreground"}`}>
                      <Moon className="h-4 w-4" /> Dark
                    </div>
                  </div>
                  <div className="cursor-pointer" onClick={() => setTheme("system")}>
                    <div className={`aspect-video rounded-xl border-2 p-2 relative overflow-hidden transition-colors ${theme === "system" ? "border-primary bg-primary/5 ring-offset-2 ring-2 ring-transparent" : "border-border bg-muted/30 hover:border-primary/50"}`}>
                      <div className="absolute inset-0 right-1/2 bg-white flex flex-col p-2 gap-2 border-r">
                         <div className="w-full h-3 bg-slate-100 rounded-sm mt-1"></div>
                      </div>
                      <div className="absolute inset-0 left-1/2 bg-slate-950 flex flex-col p-2 gap-2">
                         <div className="w-full h-3 bg-slate-800 rounded-sm mt-1"></div>
                      </div>
                    </div>
                    <div className={`mt-2 text-center text-sm font-medium flex items-center justify-center gap-2 ${theme === "system" ? "text-primary font-bold" : "text-muted-foreground"}`}>
                      <Laptop className="h-4 w-4" /> System
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Accent Color</Label>
                <div className="flex gap-4">
                  {[
                    { hex: "#6366f1", color: "bg-[#6366f1]", ring: "ring-[#6366f1]" },
                    { hex: "#0f172a", color: "bg-[#0f172a] dark:bg-white", ring: "ring-[#0f172a] dark:ring-white" },
                    { hex: "#22c55e", color: "bg-[#22c55e]", ring: "ring-[#22c55e]" },
                    { hex: "#f59e0b", color: "bg-[#f59e0b]", ring: "ring-[#f59e0b]" },
                    { hex: "#ef4444", color: "bg-[#ef4444]", ring: "ring-[#ef4444]" },
                    { hex: "#a855f7", color: "bg-[#a855f7]", ring: "ring-[#a855f7]" },
                    { hex: "#ec4899", color: "bg-[#ec4899]", ring: "ring-[#ec4899]" },
                  ].map((swatch, i) => {
                    const isActive = activeColor === swatch.hex
                    return (
                      <button 
                        key={i} 
                        onClick={() => {
                          setActiveColor(swatch.hex)
                          applyAccentColor(swatch.hex)
                        }}
                        className={`h-8 w-8 rounded-full ${swatch.color} ${isActive ? `ring-2 ring-offset-2 ${swatch.ring}` : 'hover:scale-110 transition-transform'}`}
                      />
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="shadow-sm">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="uk">English (UK)</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="pt">
                    <SelectTrigger className="shadow-sm">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt">Pacific Time (US & Canada)</SelectItem>
                      <SelectItem value="mt">Mountain Time (US & Canada)</SelectItem>
                      <SelectItem value="ct">Central Time (US & Canada)</SelectItem>
                      <SelectItem value="et">Eastern Time (US & Canada)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
