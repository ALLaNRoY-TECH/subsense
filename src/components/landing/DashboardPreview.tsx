"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Sparkles, User, Ban, LayoutDashboard, CreditCard, Flame, Activity } from "lucide-react";

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<"overview" | "waste" | "insights">("overview");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] border border-white/10 bg-[#080808]/90 backdrop-blur-3xl relative flex flex-col"
    >
      {/* Deep Background Glows */}
      <div className="absolute top-[-20%] left-[10%] w-[60%] h-[300px] bg-[#E53935]/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Safari-like Window Bar */}
      <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center justify-between relative z-10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="hidden sm:flex text-[11px] text-white/40 font-mono font-medium items-center gap-2 bg-black/40 px-3 py-1 rounded-md border border-white/5">
            app.subsense.ai/dashboard
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#E53935]/10 border border-[#E53935]/20 shadow-[0_0_15px_rgba(229,57,53,0.1)]">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Live Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 flex-1 relative z-10 bg-transparent min-h-[500px]">
        
        {/* Sidebar */}
        <div className="md:col-span-3 border-r border-white/5 p-5 hidden md:flex flex-col justify-between bg-black/40 backdrop-blur-md">
          <div className="space-y-8">
            <div className="flex items-center gap-3 px-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E53935] to-[#8E1010] shadow-[0_4px_15px_rgba(229,57,53,0.4)] flex items-center justify-center font-display font-black text-sm text-white border border-white/10">S</div>
              <span className="font-display font-bold text-lg text-white tracking-wide">SubSense</span>
            </div>

            <div className="space-y-2">
              {[
                { name: "Overview", icon: LayoutDashboard, active: true },
                { name: "Subscriptions", icon: CreditCard, active: false },
                { name: "AI Roasts", icon: Flame, active: false },
                { name: "Health Score", icon: Activity, active: false }
              ].map((item) => (
                <button
                  key={item.name}
                  disabled
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                    item.active 
                      ? "bg-[#E53935]/10 text-[#E53935] border border-[#E53935]/20 shadow-inner" 
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border border-white/10 rounded-xl bg-white/[0.03] flex items-center gap-3 shadow-lg">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <User className="w-5 h-5 text-white/80" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Allan Carter</p>
              <p className="text-[10px] text-[#E53935] truncate font-bold uppercase tracking-wider mt-0.5">Pro Tier</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-9 p-6 sm:p-8 flex flex-col gap-6">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: "Total Monthly Spend", value: "₹4,250", sub: "14 Active Subscriptions", trend: "+2.4%" },
              { label: "Identified Waste", value: "₹1,450", sub: "4 Unused Services", trend: "-15%", highlight: true },
              { label: "Health Score", value: "82/100", sub: "Good efficiency", trend: "up" },
            ].map((metric, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (idx * 0.1), duration: 0.5 }}
                className={`bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative overflow-hidden flex flex-col justify-between ${metric.highlight ? 'border-[#E53935]/30 bg-[#E53935]/5' : ''}`}
              >
                {metric.highlight && <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#E53935]/20 blur-2xl rounded-full" />}
                <span className="text-[11px] uppercase tracking-wider text-white/50 font-bold block">{metric.label}</span>
                <div className="mt-2 mb-1 flex items-end gap-3">
                  <span className={`text-3xl font-black font-mono leading-none ${metric.highlight ? 'text-[#E53935]' : 'text-white'}`}>{metric.value}</span>
                </div>
                <span className="text-[11px] text-white/40 font-medium">{metric.sub}</span>
              </motion.div>
            ))}
          </div>

          {/* Quick Tabs */}
          <div className="flex border-b border-white/10 gap-8 text-sm font-bold px-1">
            {[
              { id: "overview", label: "Spending Curve" },
              { id: "waste", label: "Actionable Leaks" },
              { id: "insights", label: "AI Suggestions" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "waste" | "insights")}
                className={`pb-3 border-b-2 transition-all cursor-pointer relative ${
                  activeTab === tab.id ? "border-[#E53935] text-white" : "border-transparent text-white/40 hover:text-white/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 relative min-h-[220px]">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                  className="w-full h-full flex flex-col"
                >
                  <div className="flex-1 w-full relative bg-white/[0.01] border border-white/5 rounded-xl p-4 shadow-inner">
                    <svg className="w-full h-[150px]" viewBox="0 0 500 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E53935" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#E53935" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid */}
                      <path d="M 0,30 L 500,30 M 0,75 L 500,75 M 0,120 L 500,120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                      
                      {/* Realistic Data Curve */}
                      <path d="M 0,140 L 0,110 C 50,110 80,95 120,95 C 160,95 180,60 220,60 C 260,60 280,80 320,80 C 380,80 420,40 500,30 L 500,140 Z" fill="url(#chartGradient)" />
                      <motion.path 
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}
                        d="M 0,110 C 50,110 80,95 120,95 C 160,95 180,60 220,60 C 260,60 280,80 320,80 C 380,80 420,40 500,30" 
                        fill="none" stroke="#E53935" strokeWidth="3" strokeLinecap="round" 
                      />
                      {/* Data Point */}
                      <circle cx="500" cy="30" r="5" fill="#080808" stroke="#E53935" strokeWidth="3" />
                      
                      {/* Tooltip */}
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                        <rect x="440" y="0" width="50" height="20" rx="4" fill="#E53935" />
                        <text x="465" y="14" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">₹4,250</text>
                      </motion.g>
                    </svg>
                    <div className="flex justify-between text-[10px] text-white/40 font-mono mt-3 font-semibold px-2">
                      <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span className="text-white">JUN (NOW)</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "waste" && (
                <motion.div 
                  key="waste"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                  className="w-full space-y-4"
                >
                  {[
                    { name: "Adobe Creative Cloud", reason: "0 app opens in 60 days", price: "₹4,230/mo", icon: "🎨" },
                    { name: "Vercel Pro Plan", reason: "Project archived", price: "₹1,600/mo", icon: "▲" }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#E53935]/10 to-transparent border border-[#E53935]/20 shadow-md gap-4 sm:gap-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-xl shadow-inner">{item.icon}</div>
                        <div>
                          <span className="text-sm font-bold text-white block">{item.name}</span>
                          <span className="text-[11px] text-[#E53935] block mt-1 font-medium bg-[#E53935]/10 inline-block px-2 py-0.5 rounded-sm">{item.reason}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0 mt-2 sm:mt-0">
                        <span className="text-lg font-bold font-mono text-white">{item.price}</span>
                        <button className="px-4 py-2 rounded-lg bg-[#E53935] text-white font-bold text-xs hover:brightness-110 flex items-center gap-2 shadow-[0_4px_15px_rgba(229,57,53,0.4)] transition-all">
                          <Ban className="w-3.5 h-3.5" /> 1-Click Cancel
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "insights" && (
                <motion.div 
                  key="insights"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                  className="w-full space-y-4 text-left"
                >
                  {[
                    { type: "Optimization Found", desc: "You are paying for both Apple Music and Spotify Premium. Cancel one to instantly save ₹120/mo." },
                    { type: "Downgrade Suggestion", desc: "You have 3 active Figma editors but only 1 has edited in 30 days. Downgrading saves ₹2,400/mo." }
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                      className="p-5 rounded-xl bg-white/[0.03] border border-white/10 flex gap-4 shadow-lg hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="mt-1 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#E53935]/10 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-[#E53935]" />
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block uppercase tracking-widest">{item.type}</span>
                        <p className="text-sm text-white/60 mt-2 leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[10px] text-white/40 font-mono">
            <span>Last scanned: just now</span>
            <span className="flex items-center gap-1.5 text-white/50 font-sans font-semibold">
              <ShieldAlert className="w-3 h-3 text-emerald-400" /> Bank-Grade Security Verified
            </span>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
