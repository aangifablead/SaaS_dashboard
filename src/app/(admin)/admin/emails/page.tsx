"use client"

import { useState } from "react"
import { 
  Mail, 
  Send, 
  Save, 
  Users, 
  Filter, 
  MoreHorizontal,
  Eye,
  RefreshCcw,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react"

// Mock Data
const mockEmailHistory = [
  { id: 1, subject: "Welcome to SaaS Kit Pro!", recipients: "1,156 Users", sentBy: "System", date: "Today, 10:30 AM", openRate: "68%", status: "Sent" },
  { id: 2, subject: "Action Required: Payment Failed", recipients: "1 User", sentBy: "System", date: "Today, 09:15 AM", openRate: "-", status: "Failed" },
  { id: 3, subject: "Product Update: New AI Features", recipients: "1,284 Users", sentBy: "Rahul Mehta", date: "Yesterday, 2:00 PM", openRate: "42%", status: "Sent" },
  { id: 4, subject: "Scheduled Maintenance Notice", recipients: "All Active Users", sentBy: "Admin", date: "Tomorrow, 2:00 AM", openRate: "-", status: "Scheduled" },
  { id: 5, subject: "Your trial expires in 3 days", recipients: "45 Users", sentBy: "System", date: "Jun 14, 2025", openRate: "81%", status: "Sent" },
  { id: 6, subject: "Draft: Q3 Roadmap Announcement", recipients: "All Users", sentBy: "Priya Shah", date: "Last edited 3 days ago", openRate: "-", status: "Draft" },
  { id: 7, subject: "Action Required: Payment Failed", recipients: "1 User", sentBy: "System", date: "Jun 12, 2025", openRate: "100%", status: "Sent" },
  { id: 8, subject: "Welcome to SaaS Kit Pro!", recipients: "12 Users", sentBy: "System", date: "Jun 12, 2025", openRate: "75%", status: "Sent" }
]

const templates = [
  { icon: "🎉", name: "Welcome Email", desc: "Sent automatically to new users upon registration." },
  { icon: "💳", name: "Payment Confirmation", desc: "Sent when a subscription charge succeeds." },
  { icon: "⚠️", name: "Payment Failed", desc: "Sent when a subscription charge fails to process." },
  { icon: "📢", name: "Product Announcement", desc: "Template for releasing new features or updates." }
]

export default function EmailsPage() {
  const [recipientFilter, setRecipientFilter] = useState("All Users")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [customEmail, setCustomEmail] = useState("")

  const getRecipientCount = () => {
    switch(recipientFilter) {
      case "All Users": return "1,284 users"
      case "Pro Only": return "1,156 users"
      case "Free Only": return "128 users"
      case "Enterprise Only": return "35 users"
      case "Custom": return customEmail ? "1 user" : "0 users"
      default: return "0 users"
    }
  }

  return (
    <div className="space-y-6 pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Email Center</h1>
        <button className="inline-flex items-center justify-center rounded-md bg-[#6366f1] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#4f46e5] transition-colors">
          <Send className="mr-2 h-4 w-4" />
          Compose Email
        </button>
      </div>

      {/* COMPOSE EMAIL CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Send Email to Users</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Editor Side */}
            <div className="space-y-6">
              
              {/* TO Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["All Users", "Pro Only", "Free Only", "Enterprise Only", "Custom"].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setRecipientFilter(opt)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                        recipientFilter === opt 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {opt} {recipientFilter === opt && <span className="ml-1 text-indigo-400">×</span>}
                    </button>
                  ))}
                </div>
                {recipientFilter === "Custom" && (
                  <input 
                    type="email" 
                    placeholder="Enter email address..." 
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full mt-2 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none" 
                  />
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="Enter email subject..." 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none font-medium" 
                />
              </div>

              {/* Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Message Body</label>
                  <span className="text-xs text-gray-400">Markdown supported</span>
                </div>
                <textarea 
                  rows={8}
                  placeholder="Write your email content here. Use **bold** and *italic*." 
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none resize-y" 
                />
              </div>

            </div>

            {/* Preview Side */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 flex flex-col h-full">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-100/50 flex items-center justify-between rounded-t-lg">
                <span className="text-sm font-medium text-gray-600">Email Preview</span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-500 shadow-sm">
                  <Users className="h-3 w-3" />
                  {getRecipientCount()}
                </span>
              </div>
              <div className="p-6 bg-white flex-1 overflow-auto">
                <div className="max-w-md mx-auto space-y-4">
                  {/* Mock Email Header */}
                  <div className="border-b border-gray-100 pb-4">
                    <p className="text-sm text-gray-500 mb-1">From: <span className="font-medium text-gray-900">SaaS Kit Team</span></p>
                    <p className="text-sm text-gray-500">Subject: <span className="font-medium text-gray-900">{subject || "New Message"}</span></p>
                  </div>
                  {/* Mock Email Content */}
                  <div className="prose prose-sm text-gray-800">
                    {body ? (
                      <div className="whitespace-pre-wrap">{body}</div>
                    ) : (
                      <p className="text-gray-400 italic">Your email content will appear here...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sending to: <span className="font-semibold text-gray-900">{getRecipientCount()}</span>
          </p>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md text-sm font-medium hover:bg-gray-50 flex items-center shadow-sm">
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </button>
            <button className="px-4 py-2 bg-[#6366f1] text-white rounded-md text-sm font-medium hover:bg-[#4f46e5] flex items-center shadow-sm disabled:opacity-50">
              <Send className="mr-2 h-4 w-4" /> Send Now
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* EMAIL TEMPLATES */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-gray-900">Quick Templates</h3>
          <div className="grid gap-3">
            {templates.map((tpl, i) => (
              <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 transition-colors group cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-0.5">{tpl.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{tpl.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 mb-3 leading-relaxed">{tpl.desc}</p>
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">Use Template &rarr;</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SENT EMAILS TABLE */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Email History</h3>
            <button className="p-1.5 border border-gray-300 rounded-md text-gray-600 bg-white hover:bg-gray-50 shadow-sm">
              <Filter className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-gray-400 text-xs uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Subject / Date</th>
                  <th className="px-6 py-3">Recipients</th>
                  <th className="px-6 py-3">Stats</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockEmailHistory.map((email) => (
                  <tr key={email.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 mb-0.5">{email.subject}</div>
                      <div className="text-xs text-gray-500">{email.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 font-medium">{email.recipients}</div>
                      <div className="text-xs text-gray-500">By {email.sentBy}</div>
                    </td>
                    <td className="px-6 py-4">
                      {email.openRate !== "-" ? (
                        <div className="flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">{email.openRate}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${
                        email.status === 'Sent' ? 'bg-green-50 text-green-700 border-green-200' : 
                        email.status === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' : 
                        email.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {email.status === 'Sent' && <CheckCircle2 className="h-3 w-3" />}
                        {email.status === 'Failed' && <AlertCircle className="h-3 w-3" />}
                        {email.status === 'Scheduled' && <Clock className="h-3 w-3" />}
                        {email.status === 'Draft' && <FileText className="h-3 w-3" />}
                        {email.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Resend">
                          <RefreshCcw className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
            Showing 8 of 142 emails sent
            <button className="text-indigo-600 font-medium hover:text-indigo-800">View All History &rarr;</button>
          </div>
        </div>

      </div>

    </div>
  )
}
