"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  User as UserIcon, KeyRound, Loader2, CheckCircle2, 
  AlertCircle, Lock, Eye, EyeOff, Upload, ShieldCheck, Image as ImageIcon, Trash2
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import toast from "react-hot-toast"

interface ProfileClientProps {
  user: {
    name: string;
    email: string;
    image: string;
    role: string;
    plan: string;
    createdAt: Date | string;
    hasPassword: boolean;
  };
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general')
  
  const [name, setName] = useState(user.name || "")
  const [image, setImage] = useState(user.image || "")
  
  const [currentPassword, setCurrentPassword] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{currentPassword?: string, password?: string}>({})
  const [success, setSuccess] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const currentPasswordRef = useRef<HTMLInputElement>(null)
  const newPasswordRef = useRef<HTMLInputElement>(null)

  const passwordsMatch = password === confirmPassword && password.length > 0

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('Image size must be less than 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setError("")
    setFieldErrors({})
    setSuccess("")
    setIsLoading(true)
    
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: activeTab === 'general' ? name : undefined,
          image: activeTab === 'general' ? image : undefined,
          currentPassword: activeTab === 'security' && currentPassword ? currentPassword : undefined,
          password: activeTab === 'security' && password ? password : undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      setSuccess("Profile updated successfully")
      toast.success("Profile updated successfully")
      router.refresh()
      
      if (activeTab === 'security') {
        setCurrentPassword("")
        setPassword("")
        setConfirmPassword("")
        user.hasPassword = true // They definitely have a password now
      }
      
    } catch (err: any) {
      if (err.message.includes("Incorrect current password") || err.message.includes("Current password is required")) {
        setFieldErrors({ currentPassword: err.message })
        currentPasswordRef.current?.focus()
      } else if (err.message.includes("6 characters")) {
        setFieldErrors({ password: err.message })
        newPasswordRef.current?.focus()
      } else {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-10 space-y-6">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#eef2ff] to-white rounded-xl shadow-sm border border-[#c7d2fe] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="p-2 hover:bg-indigo-100 rounded-full transition-colors"
            title="Go Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Profile Settings</h1>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Tabs */}
        <div className="flex px-6 border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => { setActiveTab('general'); setError(""); setSuccess(""); }}
            className={`px-4 py-4 text-sm font-medium transition-colors relative ${activeTab === 'general' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" /> General Info
            </div>
            {activeTab === 'general' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
          <button
            onClick={() => { setActiveTab('security'); setError(""); setSuccess(""); }}
            className={`px-4 py-4 text-sm font-medium transition-colors relative ${activeTab === 'security' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" /> Security
            </div>
            {activeTab === 'security' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-5 w-5 shrink-0" /> {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="h-5 w-5 shrink-0" /> {success}
            </div>
          )}

          <form id="profile-form" onSubmit={handleUpdate} className="max-w-2xl">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
                
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="relative shrink-0">
                    <Avatar className="h-24 w-24 border border-gray-200 shadow-sm overflow-hidden">
                      <AvatarImage src={image} className="object-cover" />
                      <AvatarFallback className="bg-indigo-50 text-indigo-600 text-3xl font-medium">
                        {name ? name.charAt(0).toUpperCase() : <UserIcon className="h-10 w-10" />}
                      </AvatarFallback>
                    </Avatar>
                    {image !== user.image && image !== "" && (
                      <button 
                        type="button" 
                        onClick={() => setImage(user.image)}
                        className="absolute top-0 right-0 p-1.5 bg-white border border-gray-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-full shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/20 z-10"
                        title="Remove pending image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900">Profile Picture</h3>
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-2" /> Upload photo
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-gray-900">Full Name</label>
                      <span className="text-xs text-gray-400">{name.length}/50</span>
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={50}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
                    />
                  </div>

                  {/* Email (Locked) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Email Address</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        value={user.email}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Contact support to change your email address.</p>
                  </div>
                </div>

                {/* Account Info Section */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Account Information</h3>
                  <div className="grid sm:grid-cols-3 gap-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-gray-500 text-xs mb-1.5">Role</p>
                      <p className="font-medium text-gray-900 capitalize">{user.role?.toLowerCase() || 'User'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1.5">Current Plan</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {user.plan}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1.5">Member Since</p>
                      <p className="font-medium text-gray-900">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                
                <div className="flex items-center gap-3 mb-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-indigo-100">
                    <ShieldCheck className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>
                    <p className="text-xs text-gray-500">Update your password to keep your account secure.</p>
                  </div>
                </div>

                {/* Current Password */}
                {user.hasPassword && (
                  <div className="space-y-2 pb-4 border-b border-gray-100">
                    <label className="block text-sm font-semibold text-gray-900">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showCurrentPassword ? "text" : "password"} 
                        ref={currentPasswordRef}
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value)
                          if (fieldErrors.currentPassword) setFieldErrors({})
                        }}
                        placeholder="Enter your current password"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all pr-10 ${
                          fieldErrors.currentPassword 
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20" 
                            : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20"
                        }`}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {fieldErrors.currentPassword && (
                      <p className="text-xs flex items-center gap-1 mt-1.5 text-rose-500">
                        <AlertCircle className="h-3.5 w-3.5" /> {fieldErrors.currentPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* New Password */}
                <div className="space-y-2 pt-2">
                  <label className="block text-sm font-semibold text-gray-900">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      ref={newPasswordRef}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }))
                      }}
                      placeholder="Enter new password"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all pr-10 ${
                        fieldErrors.password 
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20" 
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20"
                      }`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs flex items-center gap-1 mt-1.5 text-rose-500">
                      <AlertCircle className="h-3.5 w-3.5" /> {fieldErrors.password}
                    </p>
                  )}
                </div>
                
                {/* Confirm Password */}
                <div className="space-y-2 pt-2">
                  <label className="block text-sm font-semibold text-gray-900">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all pr-10 ${
                        confirmPassword.length > 0 
                          ? passwordsMatch 
                            ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20" 
                            : "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20"
                      }`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && (
                    <p className={`text-xs flex items-center gap-1 mt-1.5 ${passwordsMatch ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {passwordsMatch 
                        ? <><CheckCircle2 className="h-3.5 w-3.5" /> Passwords match</> 
                        : <><AlertCircle className="h-3.5 w-3.5" /> Passwords do not match</>}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="pt-8 mt-8 flex items-center gap-3 border-t border-gray-100">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm relative overflow-hidden"
              >
                <div className={`flex items-center transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  Save Changes
                </div>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
