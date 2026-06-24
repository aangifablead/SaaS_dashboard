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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { applyAccentColor } from "@/components/theme-provider"
import { updateProfile, changePassword, createApiKey, revokeApiKey, deleteAccount } from "@/actions/settings"
import toast from "react-hot-toast"
import { signOut } from "next-auth/react"

interface SettingsClientProps {
  initialProfile: any;
  initialApiKeys: any[];
  initialLoginHistory: any[];
}

export default function SettingsClient({ initialProfile, initialApiKeys, initialLoginHistory }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const { theme, setTheme } = useTheme()
  const [activeColor, setActiveColor] = useState<string | null>(null)

  // Profile State
  const [profile, setProfile] = useState(initialProfile || { name: "", email: "", phone: "", company: "", role: "founder", bio: "", emailVerified: null })
  const [isSaving, setIsSaving] = useState(false)
  const initials = profile?.name 
    ? profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) 
    : "US";

  // Security State
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPass, setIsChangingPass] = useState(false)

  // API Keys
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)
  const [isCreateKeyDialogOpen, setIsCreateKeyDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyPermissions, setNewKeyPermissions] = useState("Full Access")
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)

  // Danger Zone
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Initialize the active color dot on mount based on localStorage
  useEffect(() => {
    const savedColor = localStorage.getItem("accent-color") || "#6366f1"
    setActiveColor(savedColor)
  }, [])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    const res = await updateProfile(profile)
    setIsSaving(false)
    if (res.error) toast.error(res.error)
    else toast.success("Profile updated successfully")
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    setIsChangingPass(true)
    const res = await changePassword(currentPassword, newPassword)
    setIsChangingPass(false)
    if (res.error) toast.error(res.error)
    else {
      toast.success("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  const handleGenerateKey = async () => {
    if (!newKeyName) return toast.error("Key name is required");
    setIsGeneratingKey(true)
    const res = await createApiKey(newKeyName, newKeyPermissions)
    setIsGeneratingKey(false)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("API Key generated successfully")
      setGeneratedKey(res.key || null)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    const res = await deleteAccount();
    if (res.error) {
      toast.error(res.error);
      setIsDeletingAccount(false);
    } else {
      toast.success("Account deleted");
      await signOut({ callbackUrl: "/" });
    }
  }

  const handleRevokeKey = async (id: string) => {
    const res = await revokeApiKey(id)
    if (res.error) toast.error(res.error)
    else toast.success("API Key revoked")
  }

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
                    {initials}
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
                  <Input id="name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="shadow-sm bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    Email Address
                    {profile.emailVerified ? (
                      <Badge variant="secondary" className="bg-success/15 text-success border-none h-5 px-1.5 rounded flex items-center gap-1 text-[10px] uppercase font-bold">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-destructive/15 text-destructive border-none h-5 px-1.5 rounded flex items-center gap-1 text-[10px] uppercase font-bold">
                        <AlertCircle className="h-3 w-3" /> Unverified
                      </Badge>
                    )}
                  </Label>
                  <Input id="email" value={profile.email} disabled className="shadow-sm bg-muted/50 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="+1 (555) 123-4567" className="shadow-sm bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" value={profile.company} onChange={e => setProfile({...profile, company: e.target.value})} placeholder="Acme Corp" className="shadow-sm bg-background" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={profile.role || "founder"} onValueChange={v => setProfile({...profile, role: v})}>
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
                  <Textarea id="bio" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Tell us a little bit about yourself" className="resize-none shadow-sm bg-background h-24" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-accent/30 border-t border-border px-6 py-4 flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isSaving} className="shadow-sm px-8">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
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
                <Input id="current_password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="shadow-sm bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input id="new_password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="shadow-sm bg-background" />
                {newPassword.length > 0 && (
                  <>
                    <div className="flex gap-1 mt-2">
                      <div className={`h-1 flex-1 rounded-full ${newPassword.length > 6 ? 'bg-success' : 'bg-destructive'}`}></div>
                      <div className={`h-1 flex-1 rounded-full ${newPassword.length > 8 ? 'bg-success' : 'bg-accent'}`}></div>
                      <div className={`h-1 flex-1 rounded-full ${newPassword.length > 10 ? 'bg-success' : 'bg-accent'}`}></div>
                      <div className={`h-1 flex-1 rounded-full ${newPassword.length > 12 ? 'bg-success' : 'bg-accent'}`}></div>
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input id="confirm_password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="shadow-sm bg-background" />
              </div>
            </CardContent>
            <CardFooter className="bg-accent/30 border-t border-border px-6 py-4">
              <Button onClick={handleChangePassword} disabled={isChangingPass || !currentPassword || !newPassword} className="shadow-sm">
                {isChangingPass ? "Updating..." : "Update Password"}
              </Button>
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
            <CardContent className="p-0 overflow-hidden">
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
                  {initialLoginHistory && initialLoginHistory.length > 0 ? (
                    initialLoginHistory.map((historyItem: any, idx: number) => (
                      <TableRow key={historyItem._id} className={idx !== initialLoginHistory.length - 1 ? "border-b border-border" : "border-none"}>
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            {historyItem.device.toLowerCase().includes("iphone") || historyItem.device.toLowerCase().includes("android") ? (
                              <Smartphone className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <Monitor className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium text-sm flex items-center gap-2">
                                {historyItem.device}
                                {idx === 0 && <Badge className="bg-success/15 text-success hover:bg-success/15 border-none px-1.5 py-0 h-4 text-[10px]">Current</Badge>}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{historyItem.location}</TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">{historyItem.ipAddress}</TableCell>
                        <TableCell className="text-sm text-right pr-6 text-muted-foreground">
                          {new Date(historyItem.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No recent login history found.
                      </TableCell>
                    </TableRow>
                  )}
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
              <Button variant="destructive" className="shadow-sm" onClick={() => setIsDeleteDialogOpen(true)}>Delete Account</Button>
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeletingAccount}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeletingAccount}>
                      {isDeletingAccount ? "Deleting..." : "Yes, delete my account"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
              <Button onClick={() => setIsCreateKeyDialogOpen(true)} className="shadow-sm">Generate New Key</Button>
              <Dialog open={isCreateKeyDialogOpen} onOpenChange={(open) => {
                setIsCreateKeyDialogOpen(open);
                if (!open) {
                  setGeneratedKey(null);
                  setNewKeyName("");
                }
              }}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate API Key</DialogTitle>
                    <DialogDescription>
                      Create a new API key to authenticate your requests.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {generatedKey ? (
                    <div className="space-y-4 py-4">
                      <div className="p-4 bg-muted rounded-md flex items-center justify-between gap-4">
                        <code className="text-sm font-mono break-all">{generatedKey}</code>
                        <Button variant="outline" size="icon" onClick={() => {
                          navigator.clipboard.writeText(generatedKey)
                          toast.success("Copied to clipboard")
                        }}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-destructive font-medium">
                        Please copy this key now. You won't be able to see it again!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Key Name</Label>
                        <Input placeholder="e.g. Production Key" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <Select value={newKeyPermissions} onValueChange={(val) => val && setNewKeyPermissions(val as string)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full Access">Full Access</SelectItem>
                            <SelectItem value="Read Only">Read Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <DialogFooter>
                    {generatedKey ? (
                      <Button onClick={() => setIsCreateKeyDialogOpen(false)}>Done</Button>
                    ) : (
                      <>
                        <Button variant="outline" onClick={() => setIsCreateKeyDialogOpen(false)} disabled={isGeneratingKey}>Cancel</Button>
                        <Button onClick={handleGenerateKey} disabled={isGeneratingKey || !newKeyName}>
                          {isGeneratingKey ? "Generating..." : "Generate Key"}
                        </Button>
                      </>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-y border-border bg-accent/30 hover:bg-accent/30">
                    <TableHead className="text-xs font-semibold text-muted-foreground pl-6">Name</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Key</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Permissions</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">Created</TableHead>
                    <TableHead className="w-[80px] text-center pr-6"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialApiKeys.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No API keys generated yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    initialApiKeys.map((apiKey) => (
                      <TableRow key={apiKey._id} className="border-b border-border">
                        <TableCell className="pl-6 py-4">
                          <span className="font-medium text-sm text-foreground">{apiKey.name}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 font-mono text-sm bg-muted px-2 py-1 rounded w-fit">
                            {apiKey.partialKey || apiKey.key.substring(0, 15) + "..."}
                            <button onClick={() => {
                              navigator.clipboard.writeText(apiKey.key)
                              toast.success("Notice: Only partial key copied. Generating a new key is required to get full access.")
                            }} className="text-muted-foreground hover:text-foreground" title="Copy Partial Key">
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-md">{apiKey.permissions}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(apiKey.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                          <Button onClick={() => handleRevokeKey(apiKey._id)} variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Revoke</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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


            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
