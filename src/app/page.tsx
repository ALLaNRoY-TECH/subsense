"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Sparkles, Activity, Bell, BarChart3, Copy, Users, 
  RefreshCw, LineChart, ShieldAlert, Calendar, FileText, 
  MessageSquare, Cpu, Search, Play, ArrowRight, Check, Plus, 
  X, ArrowUp, DollarSign, Flame, Trash2, ShieldCheck
} from "lucide-react";
import { getSubscriptionLogo } from "@/lib/subscription-logos";

// List of features
const FEATURES = [
  { title: "Gmail Detection", desc: "Instantly scan inbox receipts & invoices using secure Google OAuth read-only scopes.", icon: Mail },
  { title: "AI Expense Analysis", desc: "Deconstruct your recurring billing patterns to map exactly where your cash flow goes.", icon: Sparkles },
  { title: "Subscription Health Score", desc: "Audit your overall recurring spend efficiency with a single rating gauge.", icon: Activity },
  { title: "Renewal Alerts", desc: "Receive smart push alerts 24 hours before auto-renewal charges hit your account.", icon: Bell },
  { title: "Spending Analytics", desc: "Interactive charts tracking monthly, quarterly, and annual spending projections.", icon: BarChart3 },
  { title: "Duplicate Detection", desc: "Instantly flag dual-billing or identical services in the same category.", icon: Copy },
  { title: "Family Suggestions", desc: "Identify shared family plans to split standard accounts and save money.", icon: Users },
  { title: "Recurring Detection", desc: "Isolate hidden debit plans and subtle transaction intervals automatically.", icon: RefreshCw },
  { title: "AI Recommendations", desc: "Custom instructions indicating exactly which platforms to pause or cancel.", icon: LineChart }
];

export default function Home() {
  // Cursor follow coordinates
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollPercent, setScrollPercent] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Outlay Ticker count
  const [tickerAmt, setTickerAmt] = useState(1280.45);

  // Pricing Interval Toggle
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");

  // Gmail Simulator state
  const [scanState, setScanState] = useState<"idle" | "scanning" | "finished">("idle");
  const [scanStep, setScanStep] = useState(0);
  const [scannedItems, setScannedItems] = useState<any[]>([]);

  // Dashboard preview active tab
  const [previewTab, setPreviewTab] = useState<"spend" | "waste" | "calendar">("spend");

  // Gmail mock items for scanner simulation
  const mockScanList = [
    { name: "Netflix Premium", price: "₹649 / month", icon: "Netflix", label: "Wasting" },
    { name: "Spotify Premium", price: "₹119 / month", icon: "Spotify", label: "Active" },
    { name: "ChatGPT Plus", price: "₹1,999 / month", icon: "OpenAI", label: "Active" },
    { name: "Prime Video", price: "₹299 / month", icon: "Prime Video", label: "Wasting" },
    { name: "Canva Pro", price: "₹499 / month", icon: "Canva", label: "Duplicate" }
  ];

  // Mouse move glow follow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll triggers (progress, header scrolled, back-to-top)
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercent((window.scrollY / totalHeight) * 100);
      }
      setScrolled(window.scrollY > 50);
      setShowBackTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Money ticker count up simulator (₹0.35 every 100ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerAmt(prev => prev + 0.35);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Run Gmail Simulator
  const startGmailScan = () => {
    if (scanState !== "idle") return;
    setScanState("scanning");
    setScanStep(0);
    setScannedItems([]);
  };

  useEffect(() => {
    if (scanState === "scanning") {
      const interval = setInterval(() => {
        if (scanStep < mockScanList.length) {
          setScannedItems(prev => [...prev, mockScanList[scanStep]]);
          setScanStep(prev => prev + 1);
        } else {
          setScanState("finished");
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [scanState, scanStep]);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen relative font-sans antialiased overflow-x-hidden selection:bg-[#EF233C] selection:text-white">
      
      {/* 520px Mouse Follow Radial Glow */}
      <div 
        className="fixed w-[520px] h-[520px] rounded-full pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          background: "radial-gradient(circle, rgba(217, 4, 41, 0.12), transparent 70%)",
          transition: "left 0.4s cubic-bezier(0.16, 1, 0.3, 1), top 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      />

      {/* Top viewport scroll progress */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#D90429] via-[#EF233C] to-[#C0C0C0] z-50 shadow-[0_0_12px_rgba(239,35,60,0.7)]"
        style={{ width: `${scrollPercent}%` }}
      />

      {/* Floating Navigation Menu */}
      <nav className={`fixed top-0 left-0 right-0 z-[400] py-5.5 transition-all duration-350 border-b border-transparent ${
        scrolled ? "bg-[#0a0a0a]/80 backdrop-blur-md py-3 border-white/5" : ""
      }`}>
        <div className="max-w-[1240px] mx-auto px-8 flex items-center justify-between gap-6">
          <a href="#home" className="font-display text-2xl tracking-wide uppercase flex items-center gap-2">
            Sub<span className="text-[#EF233C]">Sense</span>
            <span className="w-2 h-2 rounded-full bg-[#EF233C] shadow-[0_0_10px_#EF233C]" />
          </a>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-9 text-sm font-medium text-neutral-400">
            <a href="#discover" className="hover:text-white transition">Features</a>
            <a href="#how" className="hover:text-white transition">How It Works</a>
            <a href="#dashboard" className="hover:text-white transition">Dashboard</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition">Reviews</a>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-4.5">
            <a href="/dashboard" className="hidden lg:inline text-sm font-semibold text-neutral-400 hover:text-white transition">Log in</a>
            <a href="/dashboard" className="bg-gradient-to-r from-[#EF233C] to-[#D90429] hover:translate-y-[-2px] hover:shadow-[0_14px_40px_-6px_rgba(239,35,60,0.7)] text-white font-bold text-[13px] px-5 py-2.5 rounded-full transition duration-350 flex items-center gap-1.5 shadow-lg shadow-crimson/25">
              Launch Dashboard
            </a>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 transition"
            >
              <BarChart3 className="w-5 h-5 -rotate-90" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.45 }}
            className="fixed inset-0 bg-[#080809]/98 backdrop-blur-xl z-[500] p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-9">
                <span className="font-display text-2xl uppercase">Sub<span className="text-[#EF233C]">Sense</span></span>
                <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 border border-white/10 rounded-xl flex items-center justify-center">
                  <X className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              <div className="space-y-4 font-display text-3xl uppercase text-left">
                <a href="#discover" onClick={() => setMobileMenuOpen(false)} className="block py-3.5 border-b border-white/5">Features</a>
                <a href="#how" onClick={() => setMobileMenuOpen(false)} className="block py-3.5 border-b border-white/5">How It Works</a>
                <a href="#dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-3.5 border-b border-white/5">Dashboard</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-3.5 border-b border-white/5">Pricing</a>
                <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-3.5 border-b border-white/5">Reviews</a>
              </div>
            </div>

            <a href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-center bg-gradient-to-r from-[#EF233C] to-[#D90429] rounded-xl text-sm font-bold text-white shadow-lg">
              Get Started Free
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative min-h-screen flex items-center pt-36 pb-20 px-8 overflow-hidden" id="home">
        {/* Lights & Grid masks */}
        <div className="absolute inset-0 bg-radial-gradient-[ellipse_at_30%_20%,_rgba(217,4,41,0.25),_transparent_60%] z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.035)_1px,_transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,_black,_transparent_75%)] z-0 pointer-events-none" />

        <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Copy (7 cols) */}
          <div className="lg:col-span-7 text-left space-y-9">
            <span className="eyebrow">AI-powered subscription intelligence</span>
            
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[0.96] uppercase tracking-wide">
              Stop Paying<br />For What You<br /><span className="text-[#EF233C]">Don't Use.</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 max-w-lg leading-relaxed">
              SubSense scans your inbox, finds every subscription you forgot you're paying for, and uses AI to tell you exactly what to cancel — before it cancels your savings instead.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#pricing" className="bg-gradient-to-r from-[#EF233C] to-[#D90429] hover:translate-y-[-3px] hover:shadow-[0_14px_40px_-6px_rgba(239,35,60,0.75)] text-white font-bold text-sm px-7 py-4.5 rounded-full transition duration-350 flex items-center gap-1.5 shadow-lg shadow-crimson/35">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#dashboard" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-sm px-7 py-4.5 rounded-full transition flex items-center gap-1.5 hover:translate-y-[-3px]">
                <Play className="w-4 h-4 fill-white" /> Watch Demo
              </a>
            </div>

            {/* Proof blocks */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/5 max-w-sm">
              <div className="flex -space-x-2.5">
                {["AC", "RK", "VM", "+"].map((s, idx) => (
                  <span key={idx} className="w-8 h-8 rounded-full border border-black flex items-center justify-center font-mono text-[9px] font-bold bg-neutral-900 text-neutral-300">
                    {s}
                  </span>
                ))}
              </div>
              <div>
                <p className="text-[12px] text-neutral-400">
                  <b>12,000+</b> people quit subscriptions they forgot they had
                </p>
                <span className="text-[#EF233C] text-[11px] tracking-widest block mt-0.5">★★★★★ <span className="text-neutral-500 font-mono">4.9/5</span></span>
              </div>
            </div>
          </div>

          {/* Visual (5 cols) */}
          <div className="lg:col-span-5 h-[560px] flex items-center justify-center relative">
            
            {/* Spinning decorative rings */}
            <div className="absolute w-[340px] h-[340px] rounded-full border border-white/5 animate-spin-slow" />
            <div className="absolute w-[430px] h-[430px] rounded-full border border-dashed border-white/[0.04] animate-spin-reverse-slow" />

            {/* Diet Coke Inspired Can Capsule Container */}
            <div className="capsule">
              <div className="capsule-cap" />
              <div className="capsule-label font-display text-white">SubSense</div>
            </div>

            {/* Floating Brand Badges (using actual brand SVG mappings!) */}
            <div className="badge b1 animate-float" dangerouslySetInnerHTML={{ __html: getSubscriptionLogo("Netflix").svg }} />
            <div className="badge b2 animate-float [animation-delay:1.1s]" dangerouslySetInnerHTML={{ __html: getSubscriptionLogo("Spotify").svg }} />
            <div className="badge b3 animate-float [animation-delay:0.6s]" dangerouslySetInnerHTML={{ __html: getSubscriptionLogo("Prime Video").svg }} />
            <div className="badge b4 animate-float [animation-delay:1.6s]" dangerouslySetInnerHTML={{ __html: getSubscriptionLogo("ChatGPT Plus").svg }} />
            <div className="badge b5 animate-float [animation-delay:0.9s]" dangerouslySetInnerHTML={{ __html: getSubscriptionLogo("Canva Pro").svg }} />

            {/* Rising Bubbles with Prices */}
            <div className="bubble animate-rise-bubble left-[18%] [animation-delay:0s]">₹649</div>
            <div className="bubble animate-rise-bubble left-[62%] [animation-delay:1.6s]">₹119</div>
            <div className="bubble animate-rise-bubble left-[40%] [animation-delay:3.1s]">₹1,999</div>
            <div className="bubble animate-rise-bubble left-[75%] [animation-delay:4.4s]">₹499</div>
            <div className="bubble animate-rise-bubble left-[8%] [animation-delay:5.6s]">₹2,230</div>
          </div>

        </div>
      </header>

      {/* LIVE ADDICTION TICKER STRIP */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.01] py-4.5">
        <div className="max-w-[1240px] mx-auto px-8 flex items-center justify-center gap-3 text-xs sm:text-sm text-neutral-400">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#EF233C] flex-shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <p>
            Since you opened this page, forgotten subscriptions have quietly taken <span className="font-mono font-bold text-[#EF233C] text-sm">₹{tickerAmt.toFixed(2)}</span> from people just like you <span className="text-[10px] text-neutral-500 font-mono ml-1">(illustrative waste)</span>
          </p>
        </div>
      </section>

      {/* GMAIL SCANNING DISCOVER SECTION */}
      <section className="py-28 px-8 max-w-[1240px] mx-auto scroll-mt-24" id="discover">
        <div className="text-left space-y-2 mb-16">
          <span className="eyebrow">Automatic detection</span>
          <h2 className="font-display text-4xl sm:text-6xl uppercase leading-[1.04]">We find what you<br />forgot you're <em>paying for.</em></h2>
          <p className="text-neutral-400 max-w-lg mt-4 text-sm sm:text-base leading-relaxed">
            Our AI reads through your Gmail receipts, payment confirmations, and bank statements to build a complete, living map of every recurring charge on your account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Mock scanner panel (7 cols) */}
          <div className="lg:col-span-7 glass p-6.5 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
              <div className="flex items-center gap-2.5 font-mono text-xs text-neutral-400">
                <span className={`w-2 h-2 rounded-full bg-[#EF233C] shadow-[0_0_8px_#EF233C] ${scanState === "scanning" ? "animate-pulse" : ""}`} />
                <span>{scanState === "scanning" ? "Scanning Gmail inbox files..." : "Connect and run inbox bridge"}</span>
              </div>
              {scanState === "idle" && (
                <button 
                  onClick={startGmailScan}
                  className="px-3.5 py-1.5 bg-[#EF233C]/10 border border-[#EF233C]/20 hover:bg-[#EF233C] text-[#EF233C] hover:text-white rounded-lg text-[11px] font-bold font-mono transition cursor-pointer"
                >
                  Run Demo scan
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {scannedItems.length === 0 && (
                <div className="py-20 text-center border border-dashed border-white/5 rounded-xl text-neutral-500 text-xs">
                  Console idle. Press "Run Demo scan" above or trigger a live Google Auth scan on the dashboard.
                </div>
              )}
              
              {scannedItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 transition-all detected"
                >
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="w-9 h-9 rounded-lg bg-black border border-white/5 flex items-center justify-center p-1.5 flex-shrink-0"
                      dangerouslySetInnerHTML={{ __html: getSubscriptionLogo(item.icon).svg }}
                    />
                    <div className="text-left">
                      <span className="text-sm font-bold text-white block">{item.name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">{item.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#EF233C]">
                    <span>{item.label}</span>
                    <span className="w-4 h-4 rounded-full bg-[#EF233C]/10 border border-[#EF233C]/20 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-[#EF233C]" strokeWidth={3} />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {scanState === "finished" && (
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#D90429]/15 to-[#D90429]/5 border border-[#EF233C]/35 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-sm font-bold text-white font-mono">Found 12 active subscriptions</span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">5 flagged as duplicate or wasted outlays.</span>
                </div>
                <Sparkles className="w-5 h-5 text-[#EF233C] animate-pulse" />
              </div>
            )}
          </div>

          {/* Sparkline cards (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4.5">
            <div className="p-5.5 glass flex flex-col justify-between min-h-[160px] text-left group hover:border-white/20 transition duration-350">
              <span className="text-[12px] text-neutral-400 font-semibold uppercase tracking-wider">Monthly Spend</span>
              <span className="font-mono font-bold text-3xl block mt-2 text-glow">₹3,450</span>
              <div className="spark flex items-end gap-1 height-[30px] mt-4">
                {[38, 46, 52, 49, 58, 55].map((h, i) => (
                  <span key={i} className="flex-1 bg-gradient-to-t from-neutral-800 to-neutral-400 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            <div className="p-5.5 glass flex flex-col justify-between min-h-[160px] text-left group hover:border-white/20 transition duration-350">
              <span className="text-[12px] text-neutral-400 font-semibold uppercase tracking-wider">Yearly Spend</span>
              <span className="font-mono font-bold text-3xl block mt-2 text-glow">₹41,400</span>
              <div className="spark flex items-end gap-1 height-[30px] mt-4">
                {[30, 55, 40, 65, 48, 70].map((h, i) => (
                  <span key={i} className="flex-1 bg-gradient-to-t from-neutral-800 to-neutral-400 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            <div className="p-5.5 glass flex flex-col justify-between min-h-[160px] text-left bg-gradient-to-br from-[#D90429]/15 to-transparent border-[#EF233C]/30 shadow-[0_0_20px_rgba(239,35,60,0.02)]">
              <span className="text-[12px] text-[#EF233C] font-semibold uppercase tracking-wider">Potential Savings</span>
              <span className="font-mono font-bold text-3xl block mt-2 text-glow text-white">₹12,600</span>
              <div className="spark flex items-end gap-1 height-[30px] mt-4">
                {[20, 35, 55, 68, 72, 85].map((h, i) => (
                  <span key={i} className="flex-1 bg-gradient-to-t from-[#D90429] to-[#EF233C] rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            <div className="p-5.5 glass flex flex-col justify-between min-h-[160px] text-left group hover:border-white/20 transition duration-350">
              <span className="text-[12px] text-neutral-400 font-semibold uppercase tracking-wider">Renewals Due</span>
              <span className="font-mono font-bold text-3xl block mt-2">6 Items</span>
              <div className="flex gap-1.5 mt-4">
                {["🎬", "🎵", "🤖", "🎨"].map((e, idx) => (
                  <span key={idx} className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* HEALTH SCORE SECTION */}
      <section className="py-28 px-8 max-w-[1240px] mx-auto scroll-mt-24" id="health">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          
          {/* Radial score gauge (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-72 h-72 flex items-center justify-center">
              {/* Glowing ring background */}
              <div className="absolute w-[240px] h-[240px] rounded-full bg-[#EF233C]/5 blur-lg" />
              
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="144" cy="144" r="120" className="stroke-white/5" strokeWidth="12" fill="transparent" />
                <motion.circle 
                  cx="144" 
                  cy="144" 
                  r="120" 
                  className="stroke-[#EF233C]" 
                  strokeWidth="12" 
                  fill="transparent"
                  strokeDasharray="754"
                  initial={{ strokeDashoffset: 754 }}
                  animate={{ strokeDashoffset: 754 - (72 / 100) * 754 }}
                  transition={{ duration: 1.6, ease: "easeOut" }}
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 10px rgba(239, 35, 60, 0.6))" }}
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-mono font-bold text-5xl block text-white text-glow">72<span className="text-neutral-500 text-lg">/100</span></span>
                <span className="text-[10px] uppercase tracking-widest text-[#EF233C] mt-2 font-bold">Health Index</span>
              </div>
            </div>
          </div>

          {/* Diagnosis details (7 cols) */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div>
              <span className="eyebrow">Financial Scorecard</span>
              <h2 className="font-display text-4xl sm:text-5xl uppercase mt-2">Audit Your Waste Score</h2>
              <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
                Your subscription health is Fair. AI has isolated duplicate streaming packages and inactive contracts representing ₹1,050 leaks.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { title: "3 Inactive Services", sub: "Duolingo and Adobe haven't been opened in 60 days.", icon: Trash2 },
                { title: "2 Duplicate Streams", sub: "Paying for Spotify and Apple Music simultaneously.", icon: Copy }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/15 transition duration-350">
                  <div className="w-10 h-10 rounded-xl bg-[#EF233C]/10 border border-[#EF233C]/20 flex items-center justify-center text-[#EF233C]">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 text-left">
              <h4 className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">AI RECOMMENDATION</h4>
              <p className="font-mono text-2xl font-bold mt-2 leading-tight">
                Cancel HBO Max & Downgrade Canva Pro to save <em className="text-[#EF233C] not-italic">₹1,850/mo</em>
              </p>
              <span className="text-[11px] text-neutral-500 block mt-2">This action does not affect active usage accounts.</span>
            </div>
          </div>

        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="py-20 px-8 max-w-[1240px] mx-auto text-left">
        <span className="eyebrow">Billing Timeline</span>
        <h2 className="font-display text-4xl sm:text-5xl uppercase mt-2">Renewal calendar cycle</h2>
        
        <div className="timeline-track flex gap-0 mt-12 overflow-x-auto no-scrollbar">
          {[
            { month: "June 2", name: "Netflix Premium", price: "₹649", logo: "Netflix" },
            { month: "June 9", name: "Adobe CC", price: "₹4,230", logo: "Adobe" },
            { month: "June 14", name: "Spotify Duo", price: "₹149", logo: "Spotify" },
            { month: "June 21", name: "ChatGPT Plus", price: "₹1,999", logo: "OpenAI" },
            { month: "June 24", name: "Canva Pro", price: "₹499", logo: "Canva" },
            { month: "June 28", name: "iCloud+ 2TB", price: "₹749", logo: "iCloud" }
          ].map((item, idx) => (
            <div key={idx} className="timeline-item flex-shrink-0 w-52 relative pr-6 text-left">
              <div className="timeline-line h-[2px] bg-white/10 mb-7 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#EF233C] border-3 border-[#0a0a0a] shadow-[0_0_14px_rgba(239,35,60,0.7)]" />
              </div>
              <div className="timeline-month font-mono text-[11px] text-neutral-400 uppercase tracking-widest">{item.month}</div>
              <div className="glass p-4 text-left space-y-2">
                <div className="w-8 h-8 rounded-lg bg-black border border-white/5 flex items-center justify-center p-1.5" dangerouslySetInnerHTML={{ __html: getSubscriptionLogo(item.logo).svg }} />
                <h4 className="timeline-card-svc text-xs font-bold text-white truncate max-w-[140px]">{item.name}</h4>
                <div className="timeline-card-amt font-mono text-[11px] text-[#EF233C]">{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI REALITY ROAST CAROUSEL SECTION */}
      <section className="py-20 px-8 max-w-[1240px] mx-auto text-left">
        <div className="roast-head flex items-end justify-between gap-5 flex-wrap">
          <div>
            <span className="eyebrow">Reality Audit</span>
            <h2 className="font-display text-4xl sm:text-5xl uppercase mt-2">No Holds Barred Roasts</h2>
          </div>
        </div>

        {/* Roast Cards scroll track */}
        <div className="flex gap-4.5 mt-10 overflow-x-auto no-scrollbar pb-4">
          {[
            { quote: "You paid ₹7,788 for Netflix this year and watched exactly 3 movies.", sub: "Netflix Premium", cost: "₹7,788 spent", icon: "Netflix" },
            { quote: "Your gym membership is more committed to taking your money than you are to lifting weights.", sub: "Gold's Gym Membership", cost: "₹18,000 spent", icon: "🏋️" },
            { quote: "Prime Video has not been opened in 87 days. Jeff Bezos says thank you.", sub: "Amazon Prime", cost: "₹1,499 spent", icon: "Prime Video" },
            { quote: "You paid for Canva Pro to remove background from exactly 2 PNG images.", sub: "Canva Pro", cost: "₹1,497 spent", icon: "Canva" }
          ].map((card, idx) => (
            <div key={idx} className="flex-shrink-0 w-72 p-6.5 bg-gradient-to-br from-[#D90429]/15 to-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between min-h-[220px] text-left">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono truncate max-w-[150px]">{card.sub}</span>
                  <span className="text-[9px] bg-[#EF233C]/10 text-[#EF233C] border border-[#EF233C]/20 px-2 py-0.5 rounded font-mono font-bold uppercase whitespace-nowrap">{card.cost}</span>
                </div>
                <p className="text-sm font-bold text-white leading-relaxed italic">
                  &ldquo;{card.quote}&rdquo;
                </p>
              </div>
              <span className="text-[10px] text-neutral-500 font-semibold block mt-4.5">AI ROAST ALERT</span>
            </div>
          ))}

          {/* Add subscription prompt card */}
          <a href="/dashboard" className="flex-shrink-0 w-72 p-6.5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center bg-white/[0.01] hover:bg-white/[0.02] transition min-h-[220px]">
            <div className="w-12 h-12 rounded-full bg-[#EF233C]/10 border border-[#EF233C]/20 flex items-center justify-center text-[#EF233C] mb-3">
              <Plus className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Scan Gmail Account</h4>
            <span className="text-xs text-neutral-400 mt-1">Identify other waste candidate outlays</span>
          </a>
        </div>
      </section>

      {/* DASHBOARD PREVIEW & AI ASSISTANT DEMO */}
      <section className="py-28 px-8 max-w-[1240px] mx-auto scroll-mt-24" id="dashboard">
        <div className="dash-wrap grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          
          {/* Mock Copy (5 cols) */}
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="eyebrow">Interactive Mockup</span>
            <h2 className="font-display text-4xl sm:text-5xl uppercase">The Dashboard of Financial Power</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Analyze monthly curves, filter active subscriptions, and communicate with the AI Cancellation assistant to negotiate prices or draft letters.
            </p>

            <ul className="dash-feature-list space-y-4 pt-4 border-t border-white/5">
              {[
                { title: "Real-time updates", desc: "Removing or pauses automatically rebuilds monthly outlines." },
                { title: "AI chat console integrations", desc: "Direct communications for cancellations and custom roasts." },
                { title: "Branded Vector Assets", desc: "Crisp matching vector brand visuals representing every item." }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3.5 items-start">
                  <div className="w-5.5 h-5.5 rounded-full bg-[#EF233C]/10 border border-[#EF233C]/20 flex items-center justify-center text-[#EF233C] flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#EF233C]" strokeWidth={3} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{item.title}</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Mock Dashboard (7 cols) */}
          <div className="lg:col-span-7 glass overflow-hidden shadow-2xl relative text-left">
            <div className="bg-black/40 border-b border-white/5 px-5 py-4 flex items-center justify-between">
              <div className="dash-dots flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-[10px] text-white/30 ml-2 font-mono">dashboard.subsense.ai</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Sandbox Mode</span>
              </div>
            </div>

            <div className="dash-body flex flex-col sm:flex-row min-h-[380px]">
              
              {/* Mini nav */}
              <div className="w-full sm:w-44 border-r border-white/5 p-4 space-y-1 bg-black/20 flex-shrink-0">
                {[
                  { id: "spend", label: "Overview Spend" },
                  { id: "waste", label: "Leaks & Alerts" },
                  { id: "calendar", label: "Calendar outlays" }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setPreviewTab(item.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      previewTab === item.id 
                        ? "bg-[#EF233C]/10 border border-[#EF233C]/20 text-[#EF233C]" 
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Main content area */}
              <div className="flex-1 p-5 space-y-4">
                
                {previewTab === "spend" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-lg">
                        <span className="text-[9px] text-neutral-500 uppercase tracking-wider block">Monthly Spend</span>
                        <span className="text-base font-black font-mono mt-0.5 block">₹3,450</span>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-lg">
                        <span className="text-[9px] text-neutral-500 uppercase tracking-wider block">Health score</span>
                        <span className="text-base font-black font-mono mt-0.5 block text-[#EF233C]">72%</span>
                      </div>
                    </div>

                    <div className="h-[140px] relative w-full bg-white/[0.01] border border-white/5 rounded-lg p-3">
                      <span className="text-[9px] text-neutral-400 uppercase tracking-wider block mb-2">Spending outline (6 mos)</span>
                      <svg className="w-full h-24" viewBox="0 0 300 80" preserveAspectRatio="none">
                        <path d="M0,70 L50,55 L100,60 L150,30 L200,45 L250,20 L300,10 L300,80 L0,80 Z" fill="rgba(239,35,60,0.15)" />
                        <path d="M0,70 L50,55 L100,60 L150,30 L200,45 L250,20 L300,10" fill="none" stroke="#EF233C" strokeWidth="2.5" />
                      </svg>
                    </div>
                  </div>
                )}

                {previewTab === "waste" && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono block">Flagged leaks</span>
                    {[
                      { name: "Adobe CC", price: "₹4,230/mo", reason: "0 active usage logs" },
                      { name: "Netflix Premium", price: "₹649/mo", reason: "3 movie opens" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg bg-red-500/5 border border-red-500/10 text-xs">
                        <div>
                          <span className="font-bold text-white block">{item.name}</span>
                          <span className="text-[9px] text-[#EF233C] block mt-0.5">{item.reason}</span>
                        </div>
                        <span className="font-mono font-bold text-white">{item.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {previewTab === "calendar" && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono block">Billing schedule</span>
                    {[
                      { name: "Spotify Premium", price: "₹119", date: "June 14" },
                      { name: "ChatGPT Plus", price: "₹1,999", date: "June 21" },
                      { name: "Canva Pro", price: "₹499", date: "June 24" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg bg-white/[0.01] border border-white/5 text-xs font-mono">
                        <div>
                          <span className="font-bold text-white block">{item.name}</span>
                          <span className="text-[9px] text-neutral-500 block mt-0.5">{item.date}</span>
                        </div>
                        <span className="font-bold text-[#EF233C]">{item.price}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 15 DETAILED FEATURES SECTION */}
      <section className="py-28 px-8 max-w-[1240px] mx-auto scroll-mt-24" id="features">
        <div className="text-center mb-16 space-y-3">
          <span className="eyebrow">Complete Toolkit</span>
          <h2 className="font-display text-4xl sm:text-6xl uppercase">Engineered for Total Control</h2>
          <p className="text-neutral-400 max-w-md mx-auto text-sm sm:text-base">
            Every feature you need to audit, optimize, and negotiate recurring costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, idx) => (
            <div key={idx} className="p-6.5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/20 hover:bg-white/[0.02] transition duration-350 flex gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#EF233C]/10 border border-[#EF233C]/20 flex items-center justify-center text-[#EF233C] flex-shrink-0">
                <feat.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 px-8 max-w-[1240px] mx-auto scroll-mt-24" id="how">
        <div className="text-left space-y-2 mb-16">
          <span className="eyebrow">Operation Protocol</span>
          <h2 className="font-display text-4xl sm:text-5xl uppercase mt-2">Four Steps to Savings</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Horizontal connecting line on desktop */}
          <div className="absolute top-[34px] left-0 right-0 h-[1px] bg-white/5 z-0 hidden lg:block" />

          {[
            { step: "01", title: "Connect Google", desc: "Sync Gmail securely using OAuth 2.0 read-only credentials.", icon: Mail },
            { step: "02", title: "AI Scan runs", desc: "NLP searches receipts, invoices, and payment confirmed headers.", icon: Search },
            { step: "03", title: "Audit waste", desc: "Filter duplicate products, inactive plans, and health score ratios.", icon: Activity },
            { step: "04", title: "Downgrade & cancel", desc: "Execute cancellation proxy letters or toggle portal redirects.", icon: Check }
          ].map((item, idx) => (
            <div key={idx} className="how-step relative z-10 text-left space-y-4 group">
              <div className="w-16 h-16 rounded-full bg-[#0a0a0a] border border-white/5 group-hover:border-[#EF233C] group-hover:shadow-[0_0_22px_rgba(239,35,60,0.4)] flex items-center justify-center transition duration-500">
                <item.icon className="w-5 h-5 text-neutral-400 group-hover:text-[#EF233C] transition" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#EF233C] uppercase tracking-widest">{item.step}</span>
                <h3 className="text-base font-bold text-white mt-1 uppercase">{item.title}</h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-28 px-8 max-w-[1240px] mx-auto scroll-mt-24" id="pricing">
        <div className="text-center mb-16 space-y-3">
          <span className="eyebrow">Pricing Model</span>
          <h2 className="font-display text-4xl sm:text-6xl uppercase">Invest in Your Budget</h2>
          <p className="text-neutral-400 max-w-md mx-auto text-sm sm:text-base">
            Choose the tier tailored to your monthly subscription complexity.
          </p>

          <div className="flex items-center justify-center gap-4.5 pt-6">
            <span className={`text-xs font-semibold transition ${billingInterval === "monthly" ? "text-white" : "text-neutral-400"}`}>Billed Monthly</span>
            <div 
              onClick={() => setBillingInterval(prev => prev === "monthly" ? "yearly" : "monthly")}
              className={`w-[52px] h-7 rounded-full border border-white/10 relative cursor-pointer bg-neutral-900 transition ${billingInterval === "yearly" ? "on" : ""}`}
            >
              <div 
                className="w-[22px] h-[22px] rounded-full bg-gradient-to-r from-[#EF233C] to-[#D90429] absolute top-[2px] left-[2px] transition duration-350"
                style={{ transform: billingInterval === "yearly" ? "translateX(24px)" : "none" }}
              />
            </div>
            <span className={`text-xs font-semibold transition ${billingInterval === "yearly" ? "text-white" : "text-neutral-400"}`}>Billed Annually</span>
            <span className="bg-[#EF233C]/10 border border-[#EF233C]/25 text-[#EF233C] text-[10px] font-bold font-mono px-2 py-0.5 rounded-full">Save 20%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6.5 max-w-3xl mx-auto">
          
          {/* Base Plan */}
          <div className="p-8.5 glass text-left flex flex-col justify-between hover:border-white/20 transition duration-350 min-h-[380px]">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold font-mono">Starter Tier</span>
              <h3 className="font-display text-2xl uppercase mt-2">Free Tracker</h3>
              <div className="font-mono mt-4 flex items-baseline gap-1">
                <b className="text-4xl font-bold text-white">₹0</b>
                <span className="text-neutral-500 text-xs">/ forever</span>
              </div>
              <ul className="space-y-3 mt-6 text-xs text-neutral-300">
                {["Track up to 10 subscriptions", "Manual receipt input log", "Basic cycle notifications"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#EF233C]" strokeWidth={3} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a href="/dashboard" className="w-full py-3 text-center border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold transition mt-6">
              Start Free Tracking
            </a>
          </div>

          {/* Pro Plan */}
          <div className="p-8.5 border border-[#EF233C]/45 bg-gradient-to-br from-[#D90429]/15 to-white/[0.02] text-left flex flex-col justify-between relative shadow-[0_8px_30px_-6px_rgba(239,35,60,0.45)] hover:border-[#EF233C] transition duration-350 min-h-[380px]">
            <div className="absolute top-[-13px] right-7 bg-gradient-to-r from-[#EF233C] to-[#D90429] font-mono text-[9px] font-bold tracking-wider px-3.5 py-1.5 rounded-full uppercase shadow-[0_6px_20px_rgba(239,35,60,0.5)]">
              Most Popular
            </div>

            <div>
              <span className="text-[10px] text-[#EF233C] uppercase tracking-widest font-bold font-mono">Premium Intelligence</span>
              <h3 className="font-display text-2xl uppercase mt-2">Intelligence Pro</h3>
              <div className="font-mono mt-4 flex items-baseline gap-1">
                <b className="text-4xl font-bold text-white">{billingInterval === "monthly" ? "₹199" : "₹159"}</b>
                <span className="text-neutral-500 text-xs">/ month</span>
              </div>
              <ul className="space-y-3 mt-6 text-xs text-neutral-300">
                {["Unlimited subscription tracking", "Automated Gmail API Scanning", "PDF Bank Statement uploader scans", "Gemini AI Roast & insights console"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#EF233C]" strokeWidth={3} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a href="/dashboard" className="w-full py-3 text-center bg-gradient-to-r from-[#EF233C] to-[#D90429] hover:brightness-110 rounded-xl text-xs font-bold text-white transition mt-6">
              Get Pro Access
            </a>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-black/40 border-y border-white/5 scroll-mt-24" id="testimonials">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="text-center mb-16 space-y-2">
            <span className="eyebrow">Verified Reviews</span>
            <h2 className="font-display text-4xl sm:text-5xl uppercase">Backed by Real Savings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Varun Sharma", role: "SaaS Founder", quote: "SubSense found 4 duplicate Canva accounts inside our marketing team folders within 2 mins of setup. Saved us over ₹22,000/yr immediately.", avatar: "VS" },
              { name: "Riya Sen", role: "UX Designer", quote: "The AI roast was the wake-up call I needed. I was paying for Adobe Suite apps I hadn't opened since 2025. The circular dashboard score is addictive.", avatar: "RS" },
              { name: "Amit Patel", role: "Creative Lead", quote: "PDF Bank Statement scan works flawlessly. Dragged my quarterly statement in, and it mapped out two separate server hostings I forgot to deactivate.", avatar: "AP" }
            ].map((test, idx) => (
              <div key={idx} className="p-6.5 glass text-left flex flex-col justify-between min-h-[200px]">
                <div className="space-y-4">
                  <div className="text-[#EF233C] text-xs tracking-wider">★★★★★</div>
                  <p className="text-sm text-neutral-300 leading-relaxed italic">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center font-mono text-xs font-bold text-neutral-300">
                    {test.avatar}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{test.name}</h5>
                    <span className="text-[10px] text-neutral-500">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 px-8 max-w-[1240px] mx-auto text-center relative z-10">
        <div className="absolute inset-0 bg-radial-gradient-[circle_at_50%_0%,_rgba(239,35,60,0.2),_transparent_60%] z-0 pointer-events-none" />
        
        <div className="p-12 sm:p-20 rounded-[36px] border border-[#EF233C]/35 bg-gradient-to-b from-[#1a0306] to-[#0a0a0a] relative overflow-hidden text-center space-y-6">
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase leading-none">
            Your Wallet<br />Deserves <span className="text-[#EF233C]">Better.</span>
          </h2>
          
          <p className="text-neutral-400 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Plug the money leaks, optimize duplicate packages, and stop paying auto-renewals on products you abandoned. Setup takes 2 minutes.
          </p>

          <a href="/dashboard" className="px-9 py-4 bg-gradient-to-r from-[#EF233C] to-[#D90429] hover:translate-y-[-2px] text-white font-bold rounded-full transition duration-350 inline-flex items-center gap-2 text-sm shadow-xl shadow-crimson/30 cursor-pointer">
            Start Saving Today <ArrowRight className="w-4.5 h-4.5" />
          </a>
          <span className="block text-[11px] text-neutral-500 font-mono">Connect securely via Google OAuth. Revoke access anytime.</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer border-t border-white/5 py-20 px-8 text-neutral-400 text-xs text-left relative z-10">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4 text-left">
            <span className="font-display text-2xl uppercase text-white">Sub<span className="text-[#EF233C]">Sense</span></span>
            <p className="text-neutral-500 max-w-xs leading-relaxed">
              AI-powered subscription discovery, tracking, and cancellation proxy intelligence. Zero effort cost control.
            </p>
          </div>

          {[
            { title: "Product", links: ["Features", "Dashboard", "Pricing", "API scans"] },
            { title: "Resources", links: ["AI Assistant", "Bank statement uploader", "Privacy keys", "Integrations"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "OAuth Scopes", "SOC2 compliance"] }
          ].map((col, idx) => (
            <div key={idx} className="space-y-3.5 text-left">
              <h6 className="text-[11px] uppercase tracking-wider text-white font-bold">{col.title}</h6>
              <div className="space-y-2">
                {col.links.map((link, i) => (
                  <a key={i} href="#" className="block hover:text-[#EF233C] transition">{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t border-white/5 text-neutral-500 font-mono text-[10px]">
          <span>© 2026 SubSense Inc. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
            <span>256-Bit SSL Encryption Secure Connection</span>
          </span>
        </div>
      </footer>

      {/* Back to top button */}
      <a 
        href="#"
        className={`fixed bottom-7 right-7 z-[400] w-12 h-12 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#EF233C] hover:border-[#EF233C] transition duration-350 shadow-2xl ${
          showBackTop ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </a>

    </div>
  );
}
