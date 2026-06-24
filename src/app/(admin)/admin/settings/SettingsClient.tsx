"use client"

import { useRef, useState } from "react"
import { 
  Settings, 
  Shield, 
  Globe, 
  Bell, 
  AlertTriangle,
  Save,
  Upload,
  Server,
  Mail,
  CreditCard,
  Key,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Activity
} from "lucide-react"

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState("general")
  const [toast, setToast] = useState<string | null>(null)
  
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  
  // Modals state
  const [dangerAction, setDangerAction] = useState<string | null>(null)
  const [dangerConfirmText, setDangerConfirmText] = useState("")

  const [formData, setFormData] = useState({
    platformName: initialSettings.platformName || "SaaS Kit",
    platformUrl: initialSettings.platformUrl || "https://saaskit.example.com",
    supportEmail: initialSettings.supportEmail || "support@saaskit.example.com",
    defaultCurrency: initialSettings.defaultCurrency || "USD ($)",
    timezone: initialSettings.timezone || "UTC",
    dateFormat: initialSettings.dateFormat || "MM/DD/YYYY",
    language: initialSettings.language || "English",
    logo: initialSettings.logo || "",
    favicon: initialSettings.favicon || "",
    allowPublicRegistration: initialSettings.allowPublicRegistration === "false" ? false : true,
    emailVerificationRequired: initialSettings.emailVerificationRequired === "false" ? false : true,
    googleOAuth: initialSettings.googleOAuth === "false" ? false : true,
    githubOAuth: initialSettings.githubOAuth === "false" ? false : true,
    freePlanAvailable: initialSettings.freePlanAvailable === "false" ? false : true,
    maintenanceMode: initialSettings.maintenanceMode === "true" ? true : false,

    // Security
    sessionTimeout: initialSettings.sessionTimeout || "24 Hours",
    maxLoginAttempts: initialSettings.maxLoginAttempts || "5",
    
    // Platform
    stripeTestMode: initialSettings.stripeTestMode === "false" ? false : true,
    stripePublicKey: initialSettings.stripePublicKey || "",
    stripeSecretKey: initialSettings.stripeSecretKey || "",
    stripeWebhookSecret: initialSettings.stripeWebhookSecret || "",
    emailApiKey: initialSettings.emailApiKey || "",
    emailFromEmail: initialSettings.emailFromEmail || "",
    emailFromName: initialSettings.emailFromName || "",

    // Notifications
    notifyNewUser: initialSettings.notifyNewUser === "true" ? true : false,
    notifyNewPro: initialSettings.notifyNewPro === "false" ? false : true,
    notifyPaymentFailed: initialSettings.notifyPaymentFailed === "false" ? false : true,
    notifyReport: initialSettings.notifyReport === "false" ? false : true,
    notifyError: initialSettings.notifyError === "false" ? false : true,
    notifyDaily: initialSettings.notifyDaily === "true" ? true : false,
    notifyWeekly: initialSettings.notifyWeekly === "false" ? false : true,
  })

  const [isSaving, setIsSaving] = useState(false)

  // IP Whitelist State
  const initialIps = initialSettings.adminIpWhitelist ? JSON.parse(initialSettings.adminIpWhitelist) : ["192.168.1.1", "10.0.0.1", "203.0.113.50"];
  const [ips, setIps] = useState<string[]>(initialIps)
  const [newIp, setNewIp] = useState("")

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleDangerAction = async () => {
    if (dangerAction === "reset" && dangerConfirmText !== "RESET") {
      return
    }
    
    const actionToRun = dangerAction;
    setDangerAction(null)
    setDangerConfirmText("")
    
    try {
      const res = await fetch("/api/admin/critical-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionToRun })
      });
      
      if (res.ok) {
        const data = await res.json();
        showToast(data.message || "Action completed successfully");
        if (actionToRun === "reset") {
          setTimeout(() => window.location.reload(), 2000);
        }
      } else {
        showToast("Error: Action failed to execute");
      }
    } catch (e) {
      showToast("Error executing action");
    }
  }

  const handleExportData = async () => {
    showToast("Triggering export...");
    try {
      const res = await fetch("/api/admin/critical-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "export_data" })
      });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message || "Export started. Check your email.");
      } else {
        showToast("Export failed");
      }
    } catch (e) {
      showToast("Error triggering export");
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'favicon') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size must be less than 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData(prev => ({...prev, [field]: event.target?.result as string}))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformName: formData.platformName,
          platformUrl: formData.platformUrl,
          supportEmail: formData.supportEmail,
          defaultCurrency: formData.defaultCurrency,
          timezone: formData.timezone,
          dateFormat: formData.dateFormat,
          language: formData.language,
          logo: formData.logo,
          favicon: formData.favicon,
          allowPublicRegistration: String(formData.allowPublicRegistration),
          emailVerificationRequired: String(formData.emailVerificationRequired),
          googleOAuth: String(formData.googleOAuth),
          githubOAuth: String(formData.githubOAuth),
          freePlanAvailable: String(formData.freePlanAvailable),
          maintenanceMode: String(formData.maintenanceMode),
          
          sessionTimeout: formData.sessionTimeout,
          maxLoginAttempts: formData.maxLoginAttempts,
          adminIpWhitelist: JSON.stringify(ips),

          stripeTestMode: String(formData.stripeTestMode),
          stripePublicKey: formData.stripePublicKey,
          stripeSecretKey: formData.stripeSecretKey,
          stripeWebhookSecret: formData.stripeWebhookSecret,
          emailApiKey: formData.emailApiKey,
          emailFromEmail: formData.emailFromEmail,
          emailFromName: formData.emailFromName,

          notifyNewUser: String(formData.notifyNewUser),
          notifyNewPro: String(formData.notifyNewPro),
          notifyPaymentFailed: String(formData.notifyPaymentFailed),
          notifyReport: String(formData.notifyReport),
          notifyError: String(formData.notifyError),
          notifyDaily: String(formData.notifyDaily),
          notifyWeekly: String(formData.notifyWeekly),
        })
      });
      if (res.ok) {
        showToast("Settings saved successfully!");
        if (activeTab === 'general') window.location.reload();
      } else {
        showToast("Error saving settings");
      }
    } catch (e) {
      showToast("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 w-full">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] flex items-center gap-2 bg-white border border-green-200 shadow-lg rounded-lg px-4 py-3 animate-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <p className="text-sm font-medium text-gray-900">{toast}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#eef2ff] to-white rounded-xl shadow-sm border border-[#c7d2fe] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Admin Settings</h1>
          <p className="text-sm text-[#4f46e5] font-medium mt-1">Manage platform configuration, security, and external integrations.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto custom-scrollbar">
        <nav className="flex space-x-6 sm:space-x-8 px-1 min-w-max pb-px" aria-label="Tabs">
          {[
            { id: 'general', name: 'General', icon: Settings },
            { id: 'security', name: 'Security', icon: Shield },
            { id: 'platform', name: 'Platform', icon: Globe },
            { id: 'notifications', name: 'Notifications', icon: Bell },
            { id: 'danger', name: 'Critical Actions', icon: AlertTriangle, color: 'text-red-600', activeColor: 'border-red-500 text-red-600' },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const isDanger = tab.id === 'danger'
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${isActive 
                    ? (isDanger ? 'border-red-500 text-red-600' : 'border-[#6366f1] text-[#6366f1]') 
                    : `border-transparent ${isDanger ? 'text-red-500 hover:text-red-700 hover:border-red-300' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  }
                `}
              >
                <Icon className={`
                  mr-2 h-5 w-5 
                  ${isActive 
                    ? (isDanger ? 'text-red-600' : 'text-[#6366f1]') 
                    : (isDanger ? 'text-red-500 group-hover:text-red-700' : 'text-gray-400 group-hover:text-gray-500')
                  }
                `} />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="mt-6">
        
        {/* ==================== GENERAL TAB ==================== */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Platform Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                <h3 className="font-semibold text-[#0f172a]">Platform Settings</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                    <input type="text" value={formData.platformName} onChange={(e) => setFormData({...formData, platformName: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform URL</label>
                    <input type="url" value={formData.platformUrl} onChange={(e) => setFormData({...formData, platformUrl: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                    <input type="email" value={formData.supportEmail} onChange={(e) => setFormData({...formData, supportEmail: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                        {formData.logo ? <img src={formData.logo} alt="Logo" className="object-contain w-full h-full" /> : <Globe className="h-6 w-6 text-gray-400" />}
                      </div>
                      <input type="file" ref={logoInputRef} onChange={(e) => handleImageUpload(e, 'logo')} accept="image/*" className="hidden" />
                      <button onClick={() => logoInputRef.current?.click()} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                        <Upload className="mr-2 h-4 w-4 text-gray-500" />
                        Change Logo
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                        {formData.favicon ? <img src={formData.favicon} alt="Favicon" className="object-contain w-full h-full" /> : <Globe className="h-4 w-4 text-gray-400" />}
                      </div>
                      <input type="file" ref={faviconInputRef} onChange={(e) => handleImageUpload(e, 'favicon')} accept="image/*" className="hidden" />
                      <button onClick={() => faviconInputRef.current?.click()} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                        <Upload className="mr-2 h-4 w-4 text-gray-500" />
                        Change Favicon
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Localization */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                <h3 className="font-semibold text-[#0f172a]">Localization</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                  <select value={formData.defaultCurrency} onChange={(e) => setFormData({...formData, defaultCurrency: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select value={formData.timezone} onChange={(e) => setFormData({...formData, timezone: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none">
                    <option>Asia/Kolkata</option>
                    <option>UTC</option>
                    <option>America/New_York</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                  <select value={formData.dateFormat} onChange={(e) => setFormData({...formData, dateFormat: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Feature Flags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                <h3 className="font-semibold text-[#0f172a]">Feature Flags</h3>
              </div>
              <div className="p-6 space-y-5">
                <ToggleRow label="Allow Public Registration" description="Users can sign up without an invite." checked={formData.allowPublicRegistration} onChange={(val) => setFormData({...formData, allowPublicRegistration: val})} />
                <ToggleRow label="Email Verification Required" description="New accounts must verify email before logging in." checked={formData.emailVerificationRequired} onChange={(val) => setFormData({...formData, emailVerificationRequired: val})} />
                <ToggleRow label="Google OAuth" description="Enable signing in with Google." checked={formData.googleOAuth} onChange={(val) => setFormData({...formData, googleOAuth: val})} />
                <ToggleRow label="GitHub OAuth" description="Enable signing in with GitHub." checked={formData.githubOAuth} onChange={(val) => setFormData({...formData, githubOAuth: val})} />
                <ToggleRow label="Free Plan Available" description="Allow users to select the Free plan on signup." checked={formData.freePlanAvailable} onChange={(val) => setFormData({...formData, freePlanAvailable: val})} />
                
                <div className="pt-4 border-t border-gray-100">
                  <ToggleRow label="Maintenance Mode" description="Disable access to all non-admin users." danger checked={formData.maintenanceMode} onChange={(val) => setFormData({...formData, maintenanceMode: val})} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 pt-4 flex justify-end">
              <button onClick={handleSaveAll} disabled={isSaving} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50">
                <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        )}

        {/* ==================== SECURITY TAB ==================== */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Admin Account */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                <h3 className="font-semibold text-[#0f172a]">Admin Account Security</h3>
              </div>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Change Admin Password</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none" />
                  </div>
                  <button onClick={() => showToast("Password updated")} className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800">Update Password</button>
                </div>

                <div className="space-y-4 md:border-l border-gray-100 md:pl-8">
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication (2FA)</h4>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your admin account by requiring a code from an authenticator app.</p>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Authenticator App</p>
                      <p className="text-xs text-gray-500">Not configured</p>
                    </div>
                    <button className="px-3 py-1.5 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50">Enable 2FA</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                <h3 className="font-semibold text-[#0f172a]">Session Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout</label>
                  <p className="text-xs text-gray-500 mb-2">Force users to log in again after inactivity.</p>
                  <select value={formData.sessionTimeout} onChange={(e) => setFormData({...formData, sessionTimeout: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none">
                    <option>1 Hour</option>
                    <option>8 Hours</option>
                    <option>24 Hours</option>
                    <option>7 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
                  <p className="text-xs text-gray-500 mb-2">Number of failed attempts before temporary IP block.</p>
                  <select value={formData.maxLoginAttempts} onChange={(e) => setFormData({...formData, maxLoginAttempts: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none">
                    <option>3</option>
                    <option>5</option>
                    <option>10</option>
                    <option>Unlimited</option>
                  </select>
                </div>
              </div>
            </div>

            {/* IP Whitelist */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-semibold text-[#0f172a]">IP Whitelist (Admin Panel)</h3>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500 mb-4">Restrict access to the admin dashboard to specific IP addresses. Leave empty to allow all.</p>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter IP Address (e.g. 192.168.1.1)" 
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none text-sm" 
                  />
                  <button 
                    onClick={() => {
                      if(newIp) { setIps([...ips, newIp]); setNewIp(""); showToast("IP added to whitelist") }
                    }}
                    className="px-3 py-2 bg-[#6366f1] text-white rounded-md hover:bg-[#4f46e5] text-sm font-medium flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </button>
                </div>

                <div className="space-y-2 mt-4">
                  {ips.map((ip, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-md">
                      <span className="text-sm font-medium text-gray-900 font-mono">{ip}</span>
                      <button onClick={() => setIps(ips.filter(i => i !== ip))} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {ips.length === 0 && (
                    <div className="text-center p-4 text-sm text-gray-500 italic border border-dashed border-gray-300 rounded-md">
                      No IPs whitelisted. Open to all IPs.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 pt-4 flex justify-end">
              <button onClick={handleSaveAll} disabled={isSaving} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50">
                <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        )}

        {/* ==================== PLATFORM TAB ==================== */}
        {activeTab === 'platform' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Stripe Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#6366f1]" />
                  <h3 className="font-semibold text-[#0f172a]">Stripe Billing</h3>
                </div>
                <ToggleRow label="Test Mode" hideLabel checked={formData.stripeTestMode} onChange={(val) => setFormData({...formData, stripeTestMode: val})} noPadding />
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Public Key</label>
                    <input type="password" value={formData.stripePublicKey} onChange={(e) => setFormData({...formData, stripePublicKey: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stripe Secret Key</label>
                    <input type="password" value={formData.stripeSecretKey} onChange={(e) => setFormData({...formData, stripeSecretKey: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none font-mono text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
                    <input type="password" value={formData.stripeWebhookSecret} onChange={(e) => setFormData({...formData, stripeWebhookSecret: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none font-mono text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Email Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold text-[#0f172a]">Email Settings (Resend)</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                    <input type="password" value={formData.emailApiKey} onChange={(e) => setFormData({...formData, emailApiKey: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                    <input type="email" value={formData.emailFromEmail} onChange={(e) => setFormData({...formData, emailFromEmail: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                    <input type="text" value={formData.emailFromName} onChange={(e) => setFormData({...formData, emailFromName: e.target.value})} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#6366f1] outline-none text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 pt-4 flex justify-end">
              <button onClick={handleSaveAll} disabled={isSaving} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50">
                <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        )}

        {/* ==================== NOTIFICATIONS TAB ==================== */}
        {activeTab === 'notifications' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                <h3 className="font-semibold text-[#0f172a]">Admin Alert Preferences</h3>
                <p className="text-sm text-gray-500">Select which events trigger an email to the administrator.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-5">
                  <ToggleRow label="New user signup" description="Email me when a new user registers." checked={formData.notifyNewUser} onChange={(val) => setFormData({...formData, notifyNewUser: val})} />
                  <ToggleRow label="New Pro subscription" description="Email me when a user upgrades to a paid plan." checked={formData.notifyNewPro} onChange={(val) => setFormData({...formData, notifyNewPro: val})} />
                  <ToggleRow label="Payment failed" description="Email me when a recurring subscription payment fails." checked={formData.notifyPaymentFailed} onChange={(val) => setFormData({...formData, notifyPaymentFailed: val})} />
                  <ToggleRow label="User complaint/report" description="Email me when a user submits a moderation report." checked={formData.notifyReport} onChange={(val) => setFormData({...formData, notifyReport: val})} />
                  <ToggleRow label="System error" description="Email me on critical system errors or exceptions." checked={formData.notifyError} onChange={(val) => setFormData({...formData, notifyError: val})} />
                </div>
                
                <div className="pt-6 border-t border-gray-100 space-y-5">
                  <h4 className="font-medium text-gray-900 mb-2">Automated Reports</h4>
                  <ToggleRow label="Daily revenue report" description="Receive a daily summary of MRR and new signups." checked={formData.notifyDaily} onChange={(val) => setFormData({...formData, notifyDaily: val})} />
                  <ToggleRow label="Weekly summary" description="Receive a weekly roll-up of platform activity." checked={formData.notifyWeekly} onChange={(val) => setFormData({...formData, notifyWeekly: val})} />
                </div>
              </div>
            </div>
            
            <div className="pt-2 flex justify-end">
              <button onClick={handleSaveAll} disabled={isSaving} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50">
                <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* ==================== DANGER ZONE TAB ==================== */}
        {activeTab === 'danger' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-red-200 bg-red-50">
                <h3 className="font-semibold text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Actions
                </h3>
              </div>
              <div className="p-0">
                
                <DangerAction 
                  title="Clear All Sessions"
                  description="Force log out all users across all devices immediately. This does not affect active subscriptions."
                  buttonText="Clear Sessions"
                  onClick={() => setDangerAction("clear_sessions")}
                />
                
                <div className="border-t border-gray-100" />
                
                <DangerAction 
                  title="Export All Data"
                  description="Download a complete CSV backup of the entire database including all users, payments, and settings."
                  buttonText="Export Data"
                  onClick={handleExportData}
                />
                
                <div className="border-t border-gray-100" />
                
                <DangerAction 
                  title="Delete All Free Users"
                  description="Permanently delete all user accounts that are currently on the 'Free' plan and inactive for 30 days."
                  buttonText="Delete Free Users"
                  onClick={() => setDangerAction("delete_free")}
                />
                
                <div className="border-t border-red-200" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-red-50/50">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">Reset Platform</h4>
                    <p className="text-sm text-gray-600 mt-1">This is a nuclear option. It will permanently delete ALL users, subscriptions, and data, resetting the platform to a fresh install state.</p>
                  </div>
                  <button 
                    onClick={() => setDangerAction("reset")} 
                    className="shrink-0 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-md hover:bg-red-700 shadow-sm transition-colors w-full md:w-auto"
                  >
                    Reset Platform
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* DANGER MODALS */}
      {dangerAction === "clear_sessions" && (
        <ConfirmModal 
          title="Clear All Sessions"
          description="Are you sure you want to log out all users? They will be forced to log in again."
          onCancel={() => setDangerAction(null)}
          onConfirm={handleDangerAction}
        />
      )}
      
      {dangerAction === "delete_free" && (
        <ConfirmModal 
          title="Delete Free Users"
          description="You are about to permanently delete all free users. This action cannot be undone."
          onCancel={() => setDangerAction(null)}
          onConfirm={handleDangerAction}
        />
      )}

      {dangerAction === "reset" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={() => setDangerAction(null)} />
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md z-10 overflow-hidden animate-in zoom-in-95 border-2 border-red-500">
            <div className="p-6">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Nuclear Option</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                You are about to permanently wipe all data from this platform. This includes all users, billing records, and configuration.
              </p>
              <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4">
                <p className="text-sm text-gray-700 font-medium mb-2">Type <strong className="text-red-600 font-mono select-none">RESET</strong> to confirm.</p>
                <input 
                  type="text" 
                  value={dangerConfirmText}
                  onChange={(e) => setDangerConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none font-mono"
                  placeholder="RESET"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDangerAction(null)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium">Cancel</button>
                <button 
                  onClick={handleDangerAction} 
                  disabled={dangerConfirmText !== "RESET"}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  Wipe Platform
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// Helper Components

function ToggleRow({ label, description, defaultChecked = false, checked, onChange, danger = false, hideLabel = false, noPadding = false }: { label: string, description?: string, defaultChecked?: boolean, checked?: boolean, onChange?: (val: boolean) => void, danger?: boolean, hideLabel?: boolean, noPadding?: boolean }) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  
  const isChecked = checked !== undefined ? checked : internalChecked;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    } else {
      setInternalChecked(e.target.checked);
    }
  }

  return (
    <div className={`flex items-start sm:items-center justify-between ${noPadding ? '' : 'gap-4'}`}>
      {!hideLabel && (
        <div className="pr-4 flex-1">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
      )}
      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1 sm:mt-0">
        <input type="checkbox" className="sr-only peer" checked={isChecked} onChange={handleChange} />
        <div className={`
          w-11 h-6 peer-focus:outline-none rounded-full peer 
          peer-checked:after:translate-x-full peer-checked:after:border-white 
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
          ${isChecked ? (danger ? 'bg-red-500' : 'bg-[#6366f1]') : 'bg-gray-200'}
        `}></div>
      </label>
    </div>
  )
}

function DangerAction({ title, description, buttonText, onClick }: { title: string, description: string, buttonText: string, onClick: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 hover:bg-gray-50/50 transition-colors">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <button 
        onClick={onClick} 
        className="shrink-0 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm w-full md:w-auto"
      >
        {buttonText}
      </button>
    </div>
  )
}

function ConfirmModal({ title, description, onCancel, onConfirm }: { title: string, description: string, onCancel: () => void, onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm z-10 overflow-hidden animate-in zoom-in-95">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-6">{description}</p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  )
}
