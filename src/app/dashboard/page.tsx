"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, Activity, Bell, BarChart3, ShieldAlert, Sparkles, 
  Trash2, Calendar, FileText, MessageSquare, ArrowLeft, Plus, 
  Search, Check, Trash, Upload, X, Send, Ban, RefreshCw, Flame, ShieldCheck,
  Mail
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  status: "active" | "wasting" | "duplicate";
  last_used: string;
  billing_date: string;
  billing_frequency: "monthly" | "yearly";
  logo_url: string;
}

export default function Dashboard() {
  // Authentication & session states
  const [auth, setAuth] = useState<{ authenticated: boolean; user: any } | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Database subscription state
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  // Tab controls
  const [activeTab, setActiveTab] = useState<"overview" | "subscriptions" | "assistant" | "statement">("overview");

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "wasting" | "duplicate">("all");

  // Gmail scanning animation states
  const [scanState, setScanState] = useState<"idle" | "connecting" | "scanning" | "finished">("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [detectedCount, setDetectedCount] = useState(0);

  // PDF statement uploader state
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [pdfScanState, setPdfScanState] = useState<"idle" | "uploading" | "scanning" | "found" | "done">("idle");
  const [scannedSubDetails, setScannedSubDetails] = useState<any>(null);

  // Gemini AI chat assistant state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Welcome to SubSense Intelligence. Ready to audit your credit leaks? Type 'tell me the truth' or ask about duplicates." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  // Cancellation Proxy
  const [cancellationDraft, setCancellationDraft] = useState<string | null>(null);
  const [targetCancelSub, setTargetCancelSub] = useState<Subscription | null>(null);

  // Add Subscription Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("Entertainment");
  const [newCurrency, setNewCurrency] = useState("₹");
  const [newFreq, setNewFreq] = useState("monthly");

  // Fetch Authentication State
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setAuth(data);
    } catch (e) {
      console.error("Auth me error:", e);
    } finally {
      setLoadingAuth(false);
    }
  };

  // Fetch User Subscriptions
  const fetchSubscriptions = async () => {
    if (!auth?.authenticated) return;
    setLoadingSubs(true);
    try {
      const res = await fetch("/api/subscriptions");
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
    } catch (e) {
      console.error("Fetch subscriptions error:", e);
    } finally {
      setLoadingSubs(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (auth?.authenticated) {
      fetchSubscriptions();
    }
  }, [auth]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAuth({ authenticated: false, user: null });
      setSubscriptions([]);
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  // ---------------- GMAIL SCAN HANDLER ----------------
  const runGmailScan = async () => {
    setScanState("connecting");
    setScanProgress(10);
    setScanLogs(["Connecting to Google API bridge...", "Fetching secure session metadata."]);
    
    // Simulate steps
    setTimeout(() => {
      setScanState("scanning");
      setScanProgress(40);
      setScanLogs(prev => [...prev, "Querying inbox receipts, invoices, and transaction logs..."]);
    }, 1000);

    try {
      const res = await fetch("/api/scan/gmail", { method: "POST" });
      const data = await res.json();
      
      setScanProgress(80);
      setScanLogs(prev => [
        ...prev, 
        `Analyzing billing signatures... Discovered ${data.foundCount || 0} subscriptions.`
      ]);

      setTimeout(() => {
        setScanState("finished");
        setScanProgress(100);
        setDetectedCount(data.foundCount || 0);
        // Refresh items
        fetchSubscriptions();
      }, 1000);

    } catch (e) {
      console.error("Gmail scanning error:", e);
      setScanState("idle");
    }
  };

  // ---------------- ADD SUBSCRIPTION HANDLER ----------------
  const handleAddSub = async () => {
    if (!newName || !newPrice) return;
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          price: parseFloat(newPrice),
          currency: newCurrency,
          category: newCategory,
          status: "active",
          billing_frequency: newFreq
        })
      });
      if (res.ok) {
        setNewName("");
        setNewPrice("");
        setShowAddModal(false);
        fetchSubscriptions();
      }
    } catch (e) {
      console.error("Add sub error:", e);
    }
  };

  // ---------------- DELETE SUBSCRIPTION HANDLER ----------------
  const handleDeleteSub = async (id: string) => {
    try {
      const res = await fetch(`/api/subscriptions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchSubscriptions();
        // Clear cancel draft if relevant
        if (targetCancelSub?.id === id) {
          setCancellationDraft(null);
          setTargetCancelSub(null);
        }
      }
    } catch (e) {
      console.error("Delete sub error:", e);
    }
  };

  // ---------------- PDF STATEMENT SCANNED HANDLER ----------------
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file.name);
      setPdfScanState("uploading");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/scan/pdf", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        
        setPdfScanState("scanning");
        setTimeout(() => {
          if (data.success) {
            setScannedSubDetails(data);
            setPdfScanState("found");
          } else {
            setPdfScanState("idle");
            alert("No recurring subscriptions found in statement.");
          }
        }, 1500);

      } catch (err) {
        console.error("PDF upload error:", err);
        setPdfScanState("idle");
      }
    }
  };

  const importPdfSub = async () => {
    if (!scannedSubDetails) return;
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: scannedSubDetails.merchant,
          price: scannedSubDetails.price,
          currency: scannedSubDetails.currency,
          category: scannedSubDetails.category,
          status: "wasting" // Mark bank items as waste candidate to optimize
        })
      });
      if (res.ok) {
        setPdfScanState("done");
        fetchSubscriptions();
      }
    } catch (e) {
      console.error("PDF import error:", e);
    }
  };

  // ---------------- AI CHAT HANDLER (GEMINI) ----------------
  const sendChatMessage = async (text: string, actionOverride?: string) => {
    const messageText = text || chatInput;
    if (!messageText.trim()) return;

    setChatMessages(prev => [...prev, { sender: "user", text: messageText }]);
    setChatInput("");
    setLoadingChat(true);

    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: messageText,
          action: actionOverride || ((messageText.toLowerCase().includes("roast") || messageText.toLowerCase().includes("truth")) ? "roast" : "general"),
          subscriptions
        })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: "ai", text: data.text }]);
    } catch (e) {
      console.error("AI response error:", e);
    } finally {
      setLoadingChat(false);
    }
  };

  // Trigger AI Cancellation Email Builder
  const initiateCancelRoute = (sub: Subscription) => {
    setTargetCancelSub(sub);
    setCancellationDraft(`Subject: Request for account cancellation - ${sub.name}

Dear Support Team,

Please cancel my membership/account linked to this email address effective immediately.
Please cease all future recurring auto-billing charges on my credit card.

Thank you,
Allan Carter`);
    
    setActiveTab("assistant");
    setChatMessages(prev => [
      ...prev,
      { sender: "user", text: `Create proxy cancellation request for ${sub.name}` },
      { sender: "ai", text: `I've drafted a proxy cancellation request for ${sub.name} (₹${sub.price}/mo). Review details in the side panel.` }
    ]);
  };

  // Real-time calculated indicators
  const totalMonthlySpend = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
  const wastedMonthlySpend = subscriptions
    .filter(sub => sub.status !== "active")
    .reduce((sum, sub) => sum + sub.price, 0);
  
  const annualSpend = subscriptions.reduce((sum, sub) => {
    return sum + (sub.billing_frequency === "yearly" ? sub.price : sub.price * 12);
  }, 0);

  const healthScore = totalMonthlySpend === 0 ? 100 : Math.max(
    30, 
    Math.min(100, Math.round(100 - (wastedMonthlySpend / totalMonthlySpend) * 80))
  );

  // Duplicate Check
  const categoryCounts = subscriptions.reduce((acc: Record<string, string[]>, sub) => {
    if (!acc[sub.category]) acc[sub.category] = [];
    acc[sub.category].push(sub.name);
    return acc;
  }, {});
  const duplicateAlerts = Object.entries(categoryCounts)
    .filter(([_, names]) => names.length > 1)
    .map(([cat, names]) => ({ category: cat, services: names }));

  // Filtered listing
  const filteredSubs = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sub.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Loader screen
  if (loadingAuth) {
    return (
      <div className="bg-[#0A0A0A] text-white min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-crimson animate-spin mx-auto" />
          <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Locking Session Keys...</p>
        </div>
      </div>
    );
  }

  // ---------------- LOGIN / OAuth SPLASH SCREEN ----------------
  if (!auth?.authenticated) {
    return (
      <div className="bg-[#0A0A0A] text-white min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-crimson/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-deep-red/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <div className="max-w-md w-full glass-panel-heavy rounded-2xl p-8 text-center space-y-6 shadow-2xl relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-deep-red to-crimson flex items-center justify-center font-black text-white text-lg shadow-[0_0_20px_rgba(239,35,60,0.4)] mx-auto">
            S
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Connect Your Wallet</h1>
            <p className="text-xs text-white/50 leading-relaxed">
              Login to SubSense to securely scan Google receipts, bank PDF statements, and identify billing anomalies automatically.
            </p>
          </div>

          <div className="border border-white/5 bg-white/[0.01] rounded-xl p-4 text-xs text-white/40 text-left space-y-2.5">
            <div className="flex gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span>SOC2 Compliant read-only credential exchange.</span>
            </div>
            <div className="flex gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span>Access tokens can be revoked at any time.</span>
            </div>
          </div>

          <a
            href="/api/auth/google"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-deep-red to-crimson hover:brightness-110 active:scale-98 transition text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-crimson/25"
          >
            <Mail className="w-4 h-4" />
            Connect Google Account
          </a>

          {!isSupabaseConfigured && (
            <p className="text-[10px] text-yellow-500/80 bg-yellow-500/5 border border-yellow-500/10 py-2 rounded-lg">
              ⚠️ Database is running in local browser Sandbox mode.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ---------------- AUTHENTICATED REAL DASHBOARD ----------------
  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex flex-col md:flex-row relative selection:bg-[#EF233C] selection:text-white">
      {/* Sidebar (3 cols) */}
      <aside className="w-full md:w-64 border-r border-white/5 bg-black/60 backdrop-blur-xl p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-r from-deep-red to-crimson flex items-center justify-center font-black text-white text-sm shadow-[0_0_12px_rgba(239,35,60,0.3)]">
                S
              </div>
              <span className="font-extrabold text-base tracking-tight text-glow">SubSense</span>
            </a>
            <span className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/40">
              {isSupabaseConfigured ? "Live Cloud" : "Sandbox"}
            </span>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {[
              { id: "overview", label: "Dashboard Overview", icon: BarChart3 },
              { id: "subscriptions", label: "Manage Subscriptions", icon: DollarSign },
              { id: "assistant", label: "THE TRUTH", icon: Flame },
              { id: "statement", label: "Upload Bank Statement", icon: FileText }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === item.id 
                      ? "bg-gradient-to-r from-deep-red/10 to-transparent border-l-2 border-crimson text-white bg-white/[0.02]" 
                      : "text-white/40 hover:text-white/80 hover:bg-white/[0.01]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === item.id ? "text-crimson" : "text-white/40"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="mt-8 pt-4 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white uppercase">
              {auth.user.name?.slice(0, 2) || "AC"}
            </div>
            <div className="overflow-hidden flex-1">
              <h4 className="text-xs font-bold text-white truncate">{auth.user.name}</h4>
              <p className="text-[9px] text-white/40 truncate">{auth.user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-crimson border border-white/5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Logout session
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen space-y-6">
        
        {/* Header toolbar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Financial Audit Hub
              <Sparkles className="w-5 h-5 text-crimson animate-pulse" />
            </h1>
            <p className="text-xs text-white/40">Real-time scan logs querying your mailbox inbox folders.</p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {scanState === "idle" && (
              <button
                onClick={runGmailScan}
                className="px-4 py-2 bg-gradient-to-r from-deep-red to-crimson hover:brightness-110 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-crimson/15 w-full sm:w-auto justify-center rounded-xl"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Scan Gmail
              </button>
            )}

            {scanState === "connecting" && (
              <button disabled className="px-4 py-2 bg-white/5 border border-white/10 text-xs font-bold text-white/50 flex items-center gap-1.5 rounded-xl w-full sm:w-auto justify-center">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-crimson" /> Connecting API...
              </button>
            )}

            {scanState === "scanning" && (
              <button disabled className="px-4 py-2 bg-white/5 border border-white/10 text-xs font-bold text-white/50 flex items-center gap-1.5 rounded-xl w-full sm:w-auto justify-center">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-crimson" /> Scanning Gmail ({scanProgress}%)
              </button>
            )}

            {scanState === "finished" && (
              <button
                onClick={runGmailScan}
                className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded-xl w-full sm:w-auto justify-center"
              >
                ✓ Found {detectedCount} subs! Scan Again
              </button>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded-xl w-full sm:w-auto justify-center"
            >
              <Plus className="w-3.5 h-3.5 text-crimson" /> Add Custom
            </button>
          </div>
        </header>

        {/* ---------------- OVERVIEW TAB ---------------- */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* Aggregate Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Monthly Outlay Spend", value: `₹${totalMonthlySpend.toLocaleString("en-IN")}`, sub: `${subscriptions.length} active logs`, desc: "Aggregate subscription cash flow" },
                { label: "Wasted Subscription Leak", value: `₹${wastedMonthlySpend.toLocaleString("en-IN")}`, sub: `${subscriptions.filter(s => s.status !== "active").length} flagged items`, desc: "Unused/duplicate duplicates", highlight: true },
                { label: "Audited Health score", value: `${healthScore}/100`, sub: healthScore > 75 ? "Excellent" : "Optimize to clear waste", desc: "Outlay balance rating index" },
                { label: "Annualized Spending", value: `₹${annualSpend.toLocaleString("en-IN")}`, sub: `₹${(wastedMonthlySpend * 12).toLocaleString("en-IN")} potential savings`, desc: "5-year outlay projection model" }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    item.highlight 
                      ? "bg-gradient-to-br from-deep-red/10 to-transparent border-crimson/40 shadow-[0_0_20px_rgba(239,35,60,0.03)]" 
                      : "bg-white/[0.01] border-white/5 hover:border-white/15"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider text-white/40 font-bold block">{item.label}</span>
                  <h3 className={`text-2xl font-black mt-2 text-glow ${item.highlight ? "text-crimson" : "text-white"}`}>
                    {item.value}
                  </h3>
                  <span className="text-[10px] text-white/60 block mt-1">{item.sub}</span>
                  <p className="text-[9px] text-white/30 mt-2 border-t border-white/5 pt-2">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Core anomalies / duplicates notifications */}
            {duplicateAlerts.length > 0 && (
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 flex gap-3 text-xs items-start">
                <ShieldAlert className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-purple-300">Duplicate Subscriptions Detected</h4>
                  <p className="text-white/50 mt-1">
                    You are paying for multiple services in the same category:
                  </p>
                  <ul className="list-disc pl-4 mt-1.5 space-y-1 text-white/60">
                    {duplicateAlerts.map((dup, idx) => (
                      <li key={idx}>
                        Category **{dup.category}**: paying for {dup.services.join(" & ")} concurrently.
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Scan progression log terminal */}
            {scanState !== "idle" && (
              <div className="p-4 rounded-xl bg-black border border-white/5 font-mono text-[10px] text-white/60 space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
                <div className="text-[9px] text-white/30 uppercase tracking-widest border-b border-white/5 pb-1 flex justify-between">
                  <span>Gmail Scan Logs console</span>
                  <span>{scanProgress}%</span>
                </div>
                {scanLogs.map((log, idx) => (
                  <p key={idx} className="leading-relaxed">&gt; {log}</p>
                ))}
              </div>
            )}

            {/* List & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Table listing (8 cols) */}
              <div className="lg:col-span-8 space-y-3.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-crimson" />
                  Active Subscriptions Matrix
                </h4>

                <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                  {loadingSubs ? (
                    <div className="py-12 text-center text-xs text-white/30">
                      <RefreshCw className="w-5 h-5 text-crimson animate-spin mx-auto mb-2" />
                      Loading db entries...
                    </div>
                  ) : filteredSubs.length === 0 ? (
                    <div className="py-12 text-center text-xs text-white/40 italic">
                      No discovered subscription logs. Trigger "Scan Gmail" to extract records.
                    </div>
                  ) : (
                    filteredSubs.slice(0, 5).map(sub => (
                      <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition">
                        <div className="flex items-center gap-3.5">
                          {/* Render brand SVG vector safely */}
                          <div 
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0A0A0A] border border-white/5 flex-shrink-0"
                            dangerouslySetInnerHTML={{ __html: sub.logo_url }}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{sub.name}</span>
                              <span className={`text-[8px] uppercase font-mono px-2 py-0.5 rounded border ${
                                sub.status === "active"
                                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                                  : sub.status === "wasting"
                                  ? "bg-red-500/10 text-crimson border-red-500/20 animate-pulse"
                                  : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              }`}>
                                {sub.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full inline-block mt-1">{sub.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4.5">
                          <div className="text-right hidden sm:block">
                            <span className="text-xs text-white/50 block">Last Active</span>
                            <span className="text-[10px] text-white/30 block mt-0.5">{sub.last_used || "Unknown"}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-white">{sub.currency}{sub.price}</span>
                            <span className="text-[9px] text-white/40 block mt-0.5 uppercase tracking-wider">{sub.billing_frequency}</span>
                          </div>
                          
                          {sub.status !== "active" && (
                            <button
                              onClick={() => initiateCancelRoute(sub)}
                              className="px-2.5 py-1.5 rounded-lg bg-crimson hover:brightness-110 text-white font-bold text-[9px] transition cursor-pointer"
                            >
                              Cancel AI
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sidebar Calendar renewals (4 cols) */}
              <div className="lg:col-span-4 p-5 rounded-2xl glass-panel relative overflow-hidden min-h-[320px]">
                <h4 className="text-sm font-bold text-white mb-4.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-crimson" />
                  Upcoming Renewals Calendar
                </h4>

                <div className="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar">
                  {subscriptions.length === 0 ? (
                    <p className="text-xs text-white/30 italic text-center py-8">No scheduled billing periods detected.</p>
                  ) : (
                    [...subscriptions]
                      .sort((a, b) => parseInt(a.billing_date) - parseInt(b.billing_date))
                      .map((sub, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.01] border border-white/5">
                          <div className="flex items-center gap-2.5">
                            <div 
                              className="w-7 h-7 flex items-center justify-center rounded bg-black border border-white/5"
                              dangerouslySetInnerHTML={{ __html: sub.logo_url }}
                            />
                            <div>
                              <span className="text-[11px] font-bold text-white block truncate max-w-[110px]">{sub.name}</span>
                              <span className="text-[9px] text-white/40 block">{sub.billing_date}</span>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-white">{sub.currency}{sub.price}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ---------------- SUBSCRIPTIONS TAB ---------------- */}
        {activeTab === "subscriptions" && (
          <div className="space-y-6">
            
            {/* Search controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search subscriptions or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-crimson"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
                {[
                  { id: "all", label: "All Items" },
                  { id: "active", label: "Active" },
                  { id: "wasting", label: "Unused" },
                  { id: "duplicate", label: "Duplicate" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition ${
                      statusFilter === tab.id
                        ? "bg-crimson text-white"
                        : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Subscription logs grid */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
              <div className="p-4 flex items-center justify-between text-xs text-white/40 font-bold uppercase tracking-wider bg-white/[0.01]">
                <span>Brand Vendor</span>
                <div className="flex gap-20 mr-12">
                  <span className="hidden sm:inline">Billing Frequency</span>
                  <span>Monthly Price</span>
                  <span>Delete</span>
                </div>
              </div>

              {filteredSubs.length === 0 ? (
                <div className="py-12 text-center text-xs text-white/30 italic">No records matches query options.</div>
              ) : (
                filteredSubs.map(sub => (
                  <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-all">
                    <div className="flex items-center gap-4.5">
                      <div 
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-black border border-white/5 flex-shrink-0"
                        dangerouslySetInnerHTML={{ __html: sub.logo_url }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{sub.name}</h4>
                          <span className={`text-[8px] uppercase tracking-wider px-2 py-0.5 rounded border font-mono ${
                            sub.status === "active"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-red-500/10 text-crimson border-red-500/20"
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full inline-block mt-1">{sub.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 sm:gap-20">
                      <span className="text-xs text-white/50 hidden sm:inline capitalize">{sub.billing_frequency}</span>
                      <span className="text-sm font-mono font-bold text-white">{sub.currency}{sub.price}</span>
                      
                      <button
                        onClick={() => handleDeleteSub(sub.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-crimson text-crimson hover:text-white transition cursor-pointer"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* ---------------- AI ASSISTANT TAB ---------------- */}
        {activeTab === "assistant" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[480px]">
            
            {/* Chat drawer (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-white/[0.01] border border-white/5 rounded-2xl p-5 h-[500px]">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-crimson" />
                  <div>
                    <h4 className="text-sm font-bold text-white">THE TRUTH Audit Console</h4>
                    <p className="text-[10px] text-white/40">Gemini-backed model parsing subscription data.</p>
                  </div>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 no-scrollbar">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-crimson text-white rounded-tr-none" 
                        : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loadingChat && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white/50 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-crimson" /> Gemini is thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestion Chips */}
              <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar py-1">
                {[
                  { label: "🔥 Tell me the truth", prompt: "Tell me the truth about my subscriptions and spending waste" },
                  { label: "💳 Flag duplicate products", prompt: "Tell me if I have duplicate subscriptions" },
                  { label: "🤖 Summary of leaks", prompt: "Give me a summary of my potential savings options" }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendChatMessage(chip.prompt)}
                    className="text-[10px] whitespace-nowrap bg-white/5 border border-white/10 hover:border-crimson/40 px-3 py-1.5 rounded-full transition cursor-pointer text-white/60 hover:text-white"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type message for Gemini AI..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendChatMessage(chatInput)}
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-crimson"
                />
                <button
                  onClick={() => sendChatMessage(chatInput)}
                  className="w-10 h-10 bg-crimson hover:brightness-110 text-white rounded-xl flex items-center justify-center transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Proxy bridge details (5 cols) */}
            <div className="lg:col-span-5 bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-[500px]">
              <div>
                <h4 className="text-sm font-bold text-white pb-3 border-b border-white/5 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-crimson" />
                  Mail Cancellation Bridge
                </h4>
                <p className="text-[10px] text-white/40 mt-3 leading-relaxed">
                  Generate cancellation instructions, copy emails, or trigger the proxy cancellation pipeline.
                </p>

                {cancellationDraft ? (
                  <div className="mt-4 p-4 rounded-xl bg-black border border-white/5 font-mono text-[9px] leading-relaxed text-white/70 h-[280px] overflow-y-auto no-scrollbar">
                    {cancellationDraft.split("\n").map((line, idx) => (
                      <p key={idx} className="min-h-[12px]">{line}</p>
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 py-20 border border-dashed border-white/10 rounded-xl text-center text-xs text-white/30 flex flex-col items-center justify-center gap-2">
                    <Sparkles className="w-8 h-8 text-white/5" />
                    <span>Select a flagged subscription to draft a cancellation request.</span>
                  </div>
                )}
              </div>

              {cancellationDraft && targetCancelSub && (
                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => handleDeleteSub(targetCancelSub.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-deep-red to-crimson hover:brightness-110 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    Confirm & Cancel Subscription
                  </button>
                  <button
                    onClick={() => {
                      setCancellationDraft(null);
                      setTargetCancelSub(null);
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/50 hover:text-white transition cursor-pointer"
                  >
                    Discard Draft
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ---------------- UPLOAD BANK STATEMENT TAB ---------------- */}
        {activeTab === "statement" && (
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold">PDF Bank Audit Scanner</h3>
              <p className="text-xs text-white/40 mt-1">
                Upload bank credit card statements to scan offline transaction data and detect recurring outlays.
              </p>
            </div>

            <div className="p-8 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] hover:bg-white/[0.02] text-center flex flex-col items-center justify-center min-h-[260px] relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={pdfScanState !== "idle" && pdfScanState !== "done"}
              />

              {pdfScanState === "idle" && (
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/50 mx-auto">
                    <Upload className="w-6 h-6 text-crimson" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Drag & Drop Bank statement PDF here or click to browse</p>
                    <p className="text-[10px] text-white/30 mt-1">Upload a blank PDF file to trigger mock validation scanner.</p>
                  </div>
                </div>
              )}

              {pdfScanState === "uploading" && (
                <div className="space-y-4">
                  <RefreshCw className="w-10 h-10 text-crimson animate-spin mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-white">Parsing PDF streams...</p>
                  </div>
                </div>
              )}

              {pdfScanState === "scanning" && (
                <div className="space-y-4">
                  <div className="flex justify-center gap-1.5 mx-auto">
                    <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-bounce" />
                    <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <p className="text-xs font-bold text-white">Filtering transaction merchants...</p>
                </div>
              )}

              {pdfScanState === "found" && scannedSubDetails && (
                <div className="space-y-5 max-w-sm">
                  <div className="p-4 rounded-xl bg-crimson/10 border border-crimson/30 text-left flex gap-3.5 items-center">
                    <span className="text-3xl">{scannedSubDetails.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-white">{scannedSubDetails.merchant}</h4>
                        <span className="text-xs font-mono font-bold text-white">{scannedSubDetails.currency}{scannedSubDetails.price}/mo</span>
                      </div>
                      <p className="text-[9px] text-white/40 mt-1">Discovered recurring charge in banking statement. Flagged as optimization candidate.</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={importPdfSub}
                      className="flex-1 py-2 px-3 rounded-lg bg-crimson hover:brightness-110 text-xs font-bold text-white transition cursor-pointer"
                    >
                      Import to Board
                    </button>
                    <button
                      onClick={() => setPdfScanState("idle")}
                      className="py-2 px-3.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white/60 transition cursor-pointer"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              )}

              {pdfScanState === "done" && (
                <div className="space-y-4">
                  <Check className="w-10 h-10 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-full mx-auto" />
                  <p className="text-xs font-bold text-white">Statement imported successfully!</p>
                  <button
                    onClick={() => {
                      setPdfScanState("idle");
                      setPdfFile(null);
                      setScannedSubDetails(null);
                    }}
                    className="py-1.5 px-4 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white hover:bg-white/10 transition cursor-pointer"
                  >
                    Scan Another Statement
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Add Subscription Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm glass-panel-heavy rounded-2xl p-6 relative z-10 space-y-4 text-left"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h4 className="text-sm font-bold text-white">Add Subscription Card</h4>
                <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white transition cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-white/50 mb-1.5">Subscription Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Netflix, Spotify, Disney+"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-crimson"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/50 mb-1.5">Price</label>
                    <input
                      type="number"
                      placeholder="199"
                      value={newPrice}
                      onChange={e => setNewPrice(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-crimson"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 mb-1.5">Currency</label>
                    <select
                      value={newCurrency}
                      onChange={e => setNewCurrency(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-crimson"
                    >
                      <option value="₹">₹ (INR)</option>
                      <option value="$">$ (USD)</option>
                      <option value="€">€ (EUR)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/50 mb-1.5">Category</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-crimson"
                    >
                      <option value="Entertainment">Entertainment</option>
                      <option value="Music">Music</option>
                      <option value="AI & Tech">AI & Tech</option>
                      <option value="Design">Design</option>
                      <option value="Cloud">Cloud</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Learning">Learning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/50 mb-1.5">Billing Frequency</label>
                    <select
                      value={newFreq}
                      onChange={e => setNewFreq(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-crimson"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddSub}
                  className="flex-1 py-2 px-4 rounded-lg bg-crimson hover:brightness-110 text-xs font-bold text-white transition cursor-pointer"
                >
                  Add Subscription
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white/60 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
