"use client"

import { useState, useRef } from "react"
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
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ChevronDown,
  Type,
  PartyPopper,
  CreditCard,
  AlertTriangle,
  Megaphone,
  Underline,
  Strikethrough,
  Code,
  Code2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import toast from "react-hot-toast"

// Mock Data
function parseMarkdownToHTML(text: string) {
  if (!text) return "";
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    .replace(/```([\s\S]*?)```/g, '<pre style="background: #f1f5f9; padding: 12px; border-radius: 6px; overflow-x: auto;"><code>$1</code></pre>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #4f46e5; text-decoration: underline;">$1</a>')
    .replace(/\!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 6px;" />')
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.125rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.25rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.5rem;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h1>')
    .replace(/^\- (.*$)/gim, '<li style="margin-left: 1rem; list-style-type: disc;">$1</li>')
    .replace(/\n/g, '<br/>');
  return html;
}

const emailTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; color: #0f172a; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0; }
    .header { background-color: #6366f1; padding: 28px 32px; color: #ffffff; font-size: 22px; font-weight: 700; text-align: center; letter-spacing: -0.5px; }
    .content { padding: 32px; font-size: 16px; line-height: 1.6; color: #334155; }
    .content h1, .content h2, .content h3 { color: #0f172a; margin-top: 0; }
    .content p { margin-bottom: 16px; }
    .content a { color: #6366f1; text-decoration: none; font-weight: 500; }
    .footer { background-color: #f8fafc; padding: 24px 32px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      SaaS Dashboard
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} SaaS Dashboard. All rights reserved.<br/>
      You are receiving this email because you are a registered user.
    </div>
  </div>
</body>
</html>
`;

const templates = [
  { icon: PartyPopper, color: "text-indigo-600", bg: "bg-indigo-50", name: "Welcome Email", desc: "Sent automatically to new users upon registration.", subject: "Welcome to our platform!", body: "Hi [User Name],\n\nWelcome aboard! We're thrilled to have you here at [Organization Name].\n\nIf you have any questions, feel free to reach out to our team at any time.\n\nBest,\nThe Team" },
  { icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50", name: "Payment Confirmation", desc: "Sent when a subscription charge succeeds.", subject: "Payment Successful - Thank You!", body: "Hi [User Name],\n\nYour payment for the [Plan Name] plan has been successfully processed.\n\nAmount: $29.00\nDate: [Current Date]\n\nThank you for your business!" },
  { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", name: "Payment Failed", desc: "Sent when a subscription charge fails to process.", subject: "Action Required: Payment Failed", body: "Hi [User Name],\n\nWe couldn't process your recent payment for [Organization Name]. Please update your billing information to ensure uninterrupted service.\n\nThanks,\nBilling Team" },
  { icon: Megaphone, color: "text-blue-600", bg: "bg-blue-50", name: "Product Announcement", desc: "Template for releasing new features or updates.", subject: "Exciting New Features!", body: "Hi [User Name],\n\nWe just launched some highly requested features!\n\nHere is what's new:\n- Feature 1\n- Feature 2\n\nLog in now to check them out!" }
]

export default function EmailsClient({ initialHistory }: { initialHistory: any[] }) {
  const [recipientFilter, setRecipientFilter] = useState("All Users")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [customEmail, setCustomEmail] = useState("")
  const [history, setHistory] = useState(initialHistory)
  const [sending, setSending] = useState(false)
  const [cursorPos, setCursorPos] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedEmail, setSelectedEmail] = useState<any>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertTag = (tag: string) => {
    const currentBody = body;
    const pos = cursorPos !== null ? cursorPos : currentBody.length;
    const before = currentBody.substring(0, pos);
    const after = currentBody.substring(pos);
    const newBody = before + tag + after;
    setBody(newBody);
    
    const newPos = pos + tag.length;
    setCursorPos(newPos);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  }

  const formatText = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = body.substring(start, end);
    const before = body.substring(0, start);
    const after = body.substring(end);
    
    setBody(before + prefix + selectedText + suffix + after);
    
    const newPos = start + prefix.length + selectedText.length + suffix.length;
    setCursorPos(newPos);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  }

    const handleSend = async () => {
    if (!subject || !body) return;
    setSending(true);
    let toValue = "all";
    if (recipientFilter === "Pro Only") toValue = "pro";
    if (recipientFilter === "Free Only") toValue = "free";
    if (recipientFilter === "Enterprise Only") toValue = "enterprise";
    if (recipientFilter === "Custom") toValue = customEmail;
    
    try {
      const parsedBody = parseMarkdownToHTML(body);
      
      const res = await fetch("/api/admin/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: toValue, subject, body: parsedBody })
      });
      if (res.ok) {
        toast.success("Email sent successfully!");
        // Optimistically prepend to history
        setHistory([{
          id: Date.now().toString(),
          subject,
          body,
          recipients: recipientFilter === "Custom" ? customEmail : recipientFilter,
          sentBy: "Admin",
          date: new Date().toLocaleString(),
          status: "Sent"
        }, ...history]);
        setSubject("");
        setBody("");
      } else {
        const errorText = await res.text();
        toast.error(`Failed to send email: ${errorText || res.statusText}`);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "An error occurred while sending the email.");
    }
    setSending(false);
  }

  const handleSaveDraft = async () => {
    if (!subject || !body) return;
    setSending(true);
    let toValue = "all";
    if (recipientFilter === "Pro Only") toValue = "pro";
    if (recipientFilter === "Free Only") toValue = "free";
    if (recipientFilter === "Enterprise Only") toValue = "enterprise";
    if (recipientFilter === "Custom") toValue = customEmail;
    
    try {
      const parsedBody = parseMarkdownToHTML(body);
      
      const res = await fetch("/api/admin/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: toValue, subject, body: parsedBody, isDraft: true })
      });
      if (res.ok) {
        toast.success("Draft saved successfully!");
        setHistory([{
          id: Date.now().toString(),
          subject,
          body,
          recipients: recipientFilter === "Custom" ? customEmail : recipientFilter,
          sentBy: "Admin",
          date: new Date().toLocaleString(),
          status: "Draft"
        }, ...history]);
      } else {
        const errorText = await res.text();
        toast.error(`Failed to save draft: ${errorText || res.statusText}`);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "An error occurred while saving the draft.");
    }
    setSending(false);
  }

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    setHistory(history.filter((item: any) => item.id !== deleteConfirmId));
    setDeleteConfirmId(null);
    toast.success("Email record deleted.");
  };

  const handleDeleteHistory = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleResend = (email: any) => {
    setSubject(email.subject);
    if (email.body) setBody(email.body);
    toast.success("Loaded into editor! Click Send to dispatch.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getRecipientCount = () => {
    switch(recipientFilter) {
      case "All Users": return "All Users"
      case "Pro Only": return "Pro Users"
      case "Free Only": return "Free Users"
      case "Enterprise Only": return "Enterprise Users"
      case "Custom": return customEmail ? customEmail : "Specific User"
      default: return "Users"
    }
  }

  const filteredHistory = history.filter((item: any) => statusFilter === "All" || item.status === statusFilter)

  return (
    <div className="space-y-6 pb-10">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#eef2ff] to-white rounded-xl shadow-sm border border-[#c7d2fe] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">Email Center</h1>
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
                
                {/* Dynamic Tags & Formatting Bar */}
                <div className="flex flex-wrap items-center gap-1 bg-gray-50 border border-gray-300 border-b-0 rounded-t-md px-2 py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="px-2 py-1 text-sm font-medium text-gray-600 bg-transparent hover:bg-gray-200 rounded transition-colors outline-none flex items-center gap-1.5 border border-transparent">
                      <Type className="h-4 w-4" />
                        Format 
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44 p-1">
                        <DropdownMenuItem onClick={() => formatText('\n\n', '\n\n')} className="cursor-pointer rounded-sm py-1.5 text-sm">
                          <span className="font-medium text-gray-700">Paragraph</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem onClick={() => formatText('# ', '')} className="cursor-pointer rounded-sm py-1.5">
                          <span className="font-bold text-lg text-gray-900">Heading 1</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => formatText('## ', '')} className="cursor-pointer rounded-sm py-1.5">
                          <span className="font-bold text-base text-gray-800">Heading 2</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => formatText('### ', '')} className="cursor-pointer rounded-sm py-1.5">
                          <span className="font-bold text-sm text-gray-800">Heading 3</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => formatText('#### ', '')} className="cursor-pointer rounded-sm py-1.5">
                          <span className="font-semibold text-sm text-gray-700">Heading 4</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => formatText('##### ', '')} className="cursor-pointer rounded-sm py-1.5">
                          <span className="font-semibold text-xs text-gray-600">Heading 5</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => formatText('###### ', '')} className="cursor-pointer rounded-sm py-1.5">
                          <span className="font-medium text-xs text-gray-500 uppercase tracking-wider">Heading 6</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button type="button" onClick={() => formatText('**', '**')} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors" title="Bold">
                      <Bold className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => formatText('*', '*')} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors" title="Italic">
                      <Italic className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => formatText('<u>', '</u>')} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors" title="Underline">
                      <Underline className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => formatText('~~', '~~')} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors" title="Strikethrough">
                      <Strikethrough className="h-4 w-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button type="button" onClick={() => formatText('<div style="text-align: left;">\n', '\n</div>')} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors" title="Align Left">
                      <AlignLeft className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => formatText('<div style="text-align: center;">\n', '\n</div>')} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors" title="Align Center">
                      <AlignCenter className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => formatText('<div style="text-align: right;">\n', '\n</div>')} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors" title="Align Right">
                      <AlignRight className="h-4 w-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button type="button" onClick={() => formatText('[', '](url)')} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors" title="Link">
                      <LinkIcon className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => formatText('![Alt text](', ')')} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors" title="Image">
                      <ImageIcon className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => formatText('- ')} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors" title="Bullet List">
                      <List className="h-4 w-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button type="button" onClick={() => formatText('```\n', '\n```')} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded transition-colors" title="Code Block">
                      <Code className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => formatText('<div className="raw-html">\n  <!-- Insert raw HTML here -->\n</div>')} className="p-1.5 text-indigo-500 hover:bg-indigo-100 rounded transition-colors" title="HTML Source">
                      <Code2 className="h-4 w-4" />
                    </button>
                  
                  <div className="ml-auto flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-1 rounded hover:bg-indigo-100 transition-colors outline-none cursor-pointer whitespace-nowrap">
                        Insert Tag
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => insertTag('[User Name]')} className="cursor-pointer text-xs">
                          <span className="text-indigo-600 font-medium mr-2">[User Name]</span> 
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => insertTag('[Organization Name]')} className="cursor-pointer text-xs">
                          <span className="text-indigo-600 font-medium mr-2">[Organization Name]</span> 
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => insertTag('[User Email]')} className="cursor-pointer text-xs">
                          <span className="text-indigo-600 font-medium mr-2">[User Email]</span> 
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => insertTag('[Plan Name]')} className="cursor-pointer text-xs">
                          <span className="text-indigo-600 font-medium mr-2">[Plan Name]</span> 
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => insertTag('[Current Date]')} className="cursor-pointer text-xs">
                          <span className="text-indigo-600 font-medium mr-2">[Current Date]</span> 
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <textarea 
                  ref={textareaRef}
                  rows={8}
                  placeholder="Write your email content here. Use **bold** and *italic*." 
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    setCursorPos(e.target.selectionStart);
                  }}
                  onBlur={(e) => setCursorPos(e.target.selectionStart)}
                  onKeyUp={(e) => setCursorPos((e.target as HTMLTextAreaElement).selectionStart)}
                  onClick={(e) => setCursorPos((e.target as HTMLTextAreaElement).selectionStart)}
                  className="w-full rounded-b-md border border-gray-300 px-3 py-3 text-sm focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] outline-none resize-y" 
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
              <div className="flex-1 bg-[#f8fafc] flex flex-col overflow-hidden">
                {body ? (
                  <iframe 
                    title="Email Preview"
                    srcDoc={emailTemplate(parseMarkdownToHTML(body), subject)}
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <p className="text-gray-400 italic">Your email preview will appear here...</p>
                  </div>
                )}
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
            <button onClick={handleSaveDraft} disabled={sending || !subject || !body} className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md text-sm font-medium hover:bg-gray-50 flex items-center shadow-sm disabled:opacity-50">
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </button>
            <button onClick={handleSend} disabled={sending || !subject || !body} className="px-4 py-2 bg-[#6366f1] text-white rounded-md text-sm font-medium hover:bg-[#4f46e5] flex items-center shadow-sm disabled:opacity-50">
              <Send className="mr-2 h-4 w-4" /> Send Now
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* EMAIL TEMPLATES */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="h-9 flex items-center">
            <h3 className="font-bold text-gray-900">Quick Templates</h3>
          </div>
          <div className="grid gap-4">
            {templates.map((tpl, i) => (
              <div 
                key={i} 
                onClick={() => { setSubject(tpl.subject); setBody(tpl.body); }}
                className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-[#6366f1] hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
              >
                {/* Subtle gradient accent line on top */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${tpl.bg} group-hover:bg-[#6366f1] transition-colors`} />
                
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${tpl.bg} ${tpl.color} group-hover:bg-[#6366f1] group-hover:text-white transition-colors`}>
                    <tpl.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-base group-hover:text-[#6366f1] transition-colors">{tpl.name}</h4>
                    <p className="text-sm text-gray-500 mt-1.5 mb-3 leading-relaxed">{tpl.desc}</p>
                    <span className="inline-flex items-center text-xs font-semibold text-[#6366f1] bg-[#eef2ff] px-2.5 py-1 rounded-md group-hover:bg-[#6366f1] group-hover:text-white transition-colors">
                      Use Template &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SENT EMAILS TABLE */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="h-9 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Email History</h3>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-1.5 border border-gray-300 rounded-md text-gray-600 bg-white hover:bg-gray-50 shadow-sm flex items-center gap-1.5 outline-none">
                <Filter className="h-4 w-4" />
                {statusFilter !== "All" && <span className="text-xs font-medium text-indigo-600">{statusFilter}</span>}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("All")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Sent")}>Sent</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Draft")}>Draft</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Scheduled")}>Scheduled</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Failed")}>Failed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-gray-400 text-xs uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">Subject / Date</th>
                  <th className="px-6 py-3">Recipients</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredHistory.map((email: any) => (
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
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setSelectedEmail(email)} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleResend(email)} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Load into Editor">
                          <RefreshCcw className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteHistory(email.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
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
            Showing {filteredHistory.length} emails
            <button className="text-indigo-600 font-medium hover:text-indigo-800">View All History &rarr;</button>
          </div>
        </div>
        </div>

      </div>

      {/* View Details Modal */}
      <Dialog open={!!selectedEmail} onOpenChange={(open) => !open && setSelectedEmail(null)}>
        <DialogContent className="max-w-3xl sm:max-w-3xl h-[85vh] flex flex-col p-0 overflow-hidden bg-white">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
            <DialogTitle className="text-lg">Email Details</DialogTitle>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {selectedEmail && (
              <>
                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase mb-1">Subject</span>
                    <span className="text-sm text-gray-900 font-medium">{selectedEmail.subject}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase mb-1">Status</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
                      selectedEmail.status === 'Sent' ? 'bg-green-50 text-green-700 border-green-200' : 
                      selectedEmail.status === 'Failed' ? 'bg-red-50 text-red-700 border-red-200' : 
                      selectedEmail.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {selectedEmail.status}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase mb-1">Sent By</span>
                    <span className="text-sm text-gray-900">{selectedEmail.sentBy}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase mb-1">Recipients</span>
                    <span className="text-sm text-gray-900">{selectedEmail.recipients}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase mb-1">Date</span>
                    <span className="text-sm text-gray-900">{selectedEmail.date}</span>
                  </div>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-900 mb-3">Content Preview</span>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-[#f8fafc] h-[400px]">
                    <iframe
                      title="Email View Details"
                      srcDoc={emailTemplate(parseMarkdownToHTML(selectedEmail.body || ''), selectedEmail.subject)}
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-[425px] flex flex-col p-6 overflow-hidden bg-white">
          <div className="flex flex-col items-center justify-center text-center space-y-4 pt-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 mb-2">Are you sure?</DialogTitle>
              <p className="text-sm text-gray-500">
                This will permanently delete this email log. This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button 
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
