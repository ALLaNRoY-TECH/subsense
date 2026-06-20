"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShieldAlert, Sparkles, TrendingUp, User, CreditCard, ChevronRight, Ban } from "lucide-react";

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState<"spend" | "waste" | "insights">("spend");

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      {/* Top Window Bar */}
      <div className="bg-black/80 border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="text-[10px] text-white/30 ml-2 font-mono">dashboard.subsense.ai/overview</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white/10" />
          <span className="text-[10px] text-white/50">Demo Space</span>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px] bg-black/40">
        
        {/* Sidebar Mock (3 cols) */}
        <div className="md:col-span-3 border-r border-white/5 p-4 hidden md:flex flex-col justify-between bg-black/20">
          <div className="space-y-5">
            <div className="flex items-center gap-2 px-2">
              <div className="w-6 h-6 rounded-lg bg-crimson flex items-center justify-center font-black text-xs">S</div>
              <span className="font-bold text-sm text-glow">SubSense</span>
            </div>

            <div className="space-y-1">
              {[
                { name: "Overview", active: true },
                { name: "Subscriptions", active: false },
                { name: "AI Roast Board", active: false },
                { name: "Smart Alerts", active: false },
                { name: "Analytics", active: false }
              ].map((item) => (
                <button
                  key={item.name}
                  disabled
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    item.active 
                      ? "bg-white/5 text-crimson font-bold border-l-2 border-crimson" 
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-2 border-t border-white/5 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white/60" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-white truncate">Allan Carter</p>
              <p className="text-[8px] text-white/40 truncate">allan@subsense.ai</p>
            </div>
          </div>
        </div>

        {/* Dashboard Main Area (9 cols) */}
        <div className="md:col-span-9 p-5 space-y-5 flex flex-col justify-between">
          {/* Dashboard Metrics Header */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Monthly Spend", value: "₹3,450", sub: "12 Active Subs", color: "text-white" },
              { label: "Wasted Spending", value: "₹1,050", sub: "3 Unused Services", color: "text-crimson" },
              { label: "Annual Forecast", value: "₹41,400", sub: "-₹12,600 Optimized", color: "text-emerald-400" },
            ].map((metric, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                <span className="text-[9px] uppercase tracking-wider text-white/40 font-semibold block">{metric.label}</span>
                <span className={`text-lg font-black block mt-1 ${metric.color}`}>{metric.value}</span>
                <span className="text-[8px] text-white/40 mt-0.5 block">{metric.sub}</span>
              </div>
            ))}
          </div>

          {/* Quick tab filters */}
          <div className="flex border-b border-white/5 pb-1 gap-4 text-xs font-semibold">
            {[
              { id: "spend", label: "Monthly Outlay Trend" },
              { id: "waste", label: "Financial Waste Alerts" },
              { id: "insights", label: "AI Suggestions" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-1.5 px-0.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "border-crimson text-white font-bold"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Chart or alerts based on tab */}
          <div className="flex-1 min-h-[160px] flex items-center justify-center">
            {activeTab === "spend" && (
              <div className="w-full h-full flex flex-col justify-between">
                {/* SVG Area Chart */}
                <div className="w-full h-[120px] relative">
                  <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF233C" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#EF233C" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    
                    {/* Fill Area */}
                    <path
                      d="M 0,110 L 0,80 L 80,95 L 160,50 L 240,65 L 320,30 L 400,10 L 400,110 Z"
                      fill="url(#chartGlow)"
                    />
                    
                    {/* Line */}
                    <path
                      d="M 0,80 L 80,95 L 160,50 L 240,65 L 320,30 L 400,10"
                      fill="none"
                      stroke="#EF233C"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    
                    {/* Highlight Dots */}
                    <circle cx="320" cy="30" r="4.5" fill="#FFFFFF" stroke="#EF233C" strokeWidth="2.5" />
                    <circle cx="400" cy="10" r="4.5" fill="#FFFFFF" stroke="#EF233C" strokeWidth="2.5" />
                  </svg>
                </div>
                <div className="flex justify-between text-[8px] text-white/30 font-mono mt-1 px-1">
                  <span>JAN</span>
                  <span>FEB</span>
                  <span>MAR</span>
                  <span>APR</span>
                  <span>MAY</span>
                  <span>JUN (CURRENT)</span>
                </div>
              </div>
            )}

            {activeTab === "waste" && (
              <div className="w-full space-y-2">
                {[
                  { name: "Adobe Premiere Pro", reason: "0 logins in 90 days", price: "₹2,230/mo", icon: "🎬" },
                  { name: "Gym Membership", reason: "0 entries in 30 days", price: "₹1,500/mo", icon: "🏋️" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded bg-white/5 flex items-center justify-center text-sm">{item.icon}</span>
                      <div>
                        <span className="text-[11px] font-bold text-white block">{item.name}</span>
                        <span className="text-[9px] text-crimson block">{item.reason}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-white">{item.price}</span>
                      <button className="px-2.5 py-1 rounded bg-crimson text-white font-bold text-[9px] hover:brightness-110 flex items-center gap-1 cursor-pointer">
                        <Ban className="w-2.5 h-2.5" /> Cancel Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "insights" && (
              <div className="w-full space-y-2 text-left">
                {[
                  { type: "Save Money", desc: "You are paying for Apple Music and Spotify Premium. Cancel one of them to save ₹120/mo." },
                  { type: "Family Sharing", desc: "Share Canva Pro with 2 teammates to split standard expenses by 66%." }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-crimson flex-shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <span className="text-[10px] font-bold text-white/80 block uppercase tracking-wider">{item.type}</span>
                      <p className="text-[10px] text-white/50 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer of Preview */}
          <div className="border-t border-white/5 pt-3.5 flex items-center justify-between text-[10px] text-white/30">
            <span>Data synced: 3 mins ago</span>
            <span className="flex items-center gap-1 text-crimson font-bold">
              Secure Cloud Sync <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
