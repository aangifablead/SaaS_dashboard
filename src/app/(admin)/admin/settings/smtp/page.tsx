"use client"

import { useState, useEffect } from "react"
import { 
  Server, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  Save,
  Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import toast from "react-hot-toast"

export default function SmtpSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<"Connected" | "Not configured" | "Connection failed">("Connected")
  
  const [config, setConfig] = useState({
    host: "",
    port: 587,
    secure: false,
    user: "",
    password: "",
    fromName: "",
    fromEmail: ""
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load existing settings on mount
  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (data) {
          setConfig(prev => ({
            ...prev,
            host: data.smtpHost || "",
            port: data.smtpPort ? parseInt(data.smtpPort) : 587,
            secure: data.smtpSecure === "true",
            user: data.smtpUser || "",
            password: data.smtpPassword ? "••••••••" : "",
            fromName: data.emailFromName || "",
            fromEmail: data.emailFromEmail || ""
          }))
          if (data.smtpHost) {
            setStatus("Connected")
          } else {
            setStatus("Not configured")
          }
        }
      })
      .catch(console.error)
  }, [])

  // Test email state
  const [testEmail, setTestEmail] = useState("admin@example.com")
  const [showTestInput, setShowTestInput] = useState(false)

  const validateForm = (isTesting: boolean = false) => {
    const newErrors: Record<string, string> = {}
    
    if (!config.host) newErrors.host = "SMTP Host is required"
    if (!config.port || config.port <= 0) newErrors.port = "Valid SMTP Port is required"
    if (!config.user) newErrors.user = "SMTP Username is required"
    if (!config.password) newErrors.password = "SMTP Password is required"
    
    // For saving, Sender Identity is required. For testing, it's optional (server falls back to SMTP user).
    if (!isTesting) {
      if (!config.fromName) newErrors.fromName = "From Name is required"
      if (!config.fromEmail) {
        newErrors.fromEmail = "From Email is required"
      } else if (!/^\S+@\S+\.\S+$/.test(config.fromEmail)) {
        newErrors.fromEmail = "Please enter a valid email address"
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      // Focus the first field with an error
      const firstErrorKey = Object.keys(newErrors)[0]
      const element = document.getElementById(`input-${firstErrorKey}`)
      if (element) {
        element.focus()
      }
      return false
    }
    
    return true
  }

  const handleSave = async () => {
    if (!validateForm(false)) return;
    
    setLoading(true)
    try {
      const payload: Record<string, string> = {
        smtpHost: config.host,
        smtpPort: String(config.port),
        smtpSecure: String(config.secure),
        smtpUser: config.user,
        emailFromName: config.fromName,
        emailFromEmail: config.fromEmail,
      };
      
      if (config.password && config.password !== "••••••••") {
        payload.smtpPassword = config.password;
      }

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      toast.success("SMTP settings saved successfully")
      setStatus("Connected")
    } catch (e: any) {
      toast.error(e.message || "Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async () => {
    if (!showTestInput) {
      setShowTestInput(true)
      return
    }
    
    if (!testEmail) {
      toast.error("Please enter a test email address")
      return
    }

    if (!validateForm(true)) return;

    setTesting(true)
    try {
      const res = await fetch("/api/admin/settings/smtp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...config, testEmail })
      });
      
      if (!res.ok) throw new Error(await res.text());
      
      toast.success("Test email sent — check your inbox")
      setShowTestInput(false)
      setStatus("Connected")
    } catch (e: any) {
      toast.error(e.message || "Failed to send test email")
      setStatus("Connection failed")
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a] mb-2 flex items-center gap-3">
          SMTP Settings
          {status === "Connected" && <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200"><CheckCircle className="h-3.5 w-3.5" /> Connected</span>}
          {status === "Not configured" && <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200"><Server className="h-3.5 w-3.5" /> Not configured</span>}
          {status === "Connection failed" && <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 border border-red-200"><XCircle className="h-3.5 w-3.5" /> Connection failed</span>}
        </h1>
        <p className="text-[#64748b]">Configure the email server used to send notifications, password resets, and other system emails.</p>
      </div>

      <div className="space-y-6">
        {/* Server Connection Section */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-6 flex items-center gap-2">
            <Server className="h-5 w-5 text-gray-400" />
            Server Connection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">SMTP Host</label>
              <input 
                id="input-host"
                type="text" 
                value={config.host}
                onChange={e => { setConfig({...config, host: e.target.value}); setErrors(prev => ({...prev, host: ""})) }}
                placeholder="smtp.gmail.com" 
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${errors.host ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
              />
              {errors.host ? (
                <p className="mt-1.5 text-xs text-red-500">{errors.host}</p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500">The hostname of your SMTP server</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">SMTP Port</label>
              <input 
                id="input-port"
                type="number" 
                value={config.port}
                onChange={e => { setConfig({...config, port: parseInt(e.target.value) || 0}); setErrors(prev => ({...prev, port: ""})) }}
                placeholder="587" 
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${errors.port ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
              />
              {errors.port ? (
                <p className="mt-1.5 text-xs text-red-500">{errors.port}</p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500">Common ports: 587 for TLS, 465 for SSL, 25 for unencrypted</p>
              )}
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50/50">
            <div>
              <h3 className="text-sm font-semibold text-[#0f172a]">Use SSL/TLS (Secure)</h3>
              <p className="text-xs text-gray-500 mt-1">Enable secure connection for email transmission</p>
            </div>
            <Switch checked={config.secure} onCheckedChange={checked => setConfig({...config, secure: checked})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">SMTP Username</label>
              <input 
                id="input-user"
                type="text" 
                value={config.user}
                onChange={e => { setConfig({...config, user: e.target.value}); setErrors(prev => ({...prev, user: ""})) }}
                placeholder="you@example.com" 
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${errors.user ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
              />
              {errors.user ? (
                <p className="mt-1.5 text-xs text-red-500">{errors.user}</p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500">Usually your full email address</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-[#0f172a]">SMTP Password</label>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  <Lock className="h-3 w-3" /> Encrypted
                </div>
              </div>
              <div className="relative">
                <input 
                  id="input-password"
                  type={showPassword ? "text" : "password"} 
                  value={config.password}
                  onChange={e => { setConfig({...config, password: e.target.value}); setErrors(prev => ({...prev, password: ""})) }}
                  placeholder="Enter SMTP password" 
                  className={`w-full rounded-lg border pl-3 pr-10 py-2 text-sm outline-none ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500">Your password is encrypted and never displayed after saving</p>
              )}
            </div>
          </div>
        </section>

        {/* Sender Identity Section */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0f172a] mb-2 flex items-center gap-2">
            <Mail className="h-5 w-5 text-gray-400" />
            Sender Identity
          </h2>
          
          <div className="mb-6 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
            <p className="text-sm text-indigo-900 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
              Live Preview: <strong>&quot;{config.fromName}&quot; &lt;{config.fromEmail}&gt;</strong>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">From Name</label>
              <input 
                id="input-fromName"
                type="text" 
                value={config.fromName}
                onChange={e => { setConfig({...config, fromName: e.target.value}); setErrors(prev => ({...prev, fromName: ""})) }}
                placeholder="SaaS Dashboard Team" 
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${errors.fromName ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
              />
              {errors.fromName ? (
                <p className="mt-1.5 text-xs text-red-500">{errors.fromName}</p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500">The name recipients will see</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">From Email</label>
              <input 
                id="input-fromEmail"
                type="email" 
                value={config.fromEmail}
                onChange={e => { setConfig({...config, fromEmail: e.target.value}); setErrors(prev => ({...prev, fromEmail: ""})) }}
                placeholder="you@example.com" 
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${errors.fromEmail ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
              />
              {errors.fromEmail ? (
                <p className="mt-1.5 text-xs text-red-500">{errors.fromEmail}</p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500">The email address recipients will see</p>
              )}
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 sticky bottom-6 z-10 bg-gray-50/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {showTestInput ? (
              <div className="flex items-center gap-2 w-full">
                <input 
                  type="email" 
                  value={testEmail}
                  onChange={e => setTestEmail(e.target.value)}
                  placeholder="Send test to..." 
                  className="w-full sm:w-64 rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  autoFocus
                />
                <Button 
                  onClick={handleTest} 
                  disabled={testing}
                  variant="outline"
                  className="gap-2 font-medium bg-white shrink-0"
                >
                  {testing ? <span className="animate-spin">⌛</span> : <Send className="h-4 w-4" />}
                  Send
                </Button>
                <button 
                  onClick={() => setShowTestInput(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 shrink-0"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Button 
                onClick={handleTest}
                variant="outline" 
                className="w-full sm:w-auto gap-2 font-medium bg-white"
              >
                <Mail className="h-4 w-4 text-indigo-500" />
                Send Test Email
              </Button>
            )}
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="w-full sm:w-auto gap-2 font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            {loading ? <span className="animate-spin">⌛</span> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
