"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { 
  Mail, Sparkles, Activity, BarChart3, Search, Play, ArrowRight, Check, Flame, Lock, Shield, ChevronRight
} from "lucide-react";

// Lazy Load Heavy Components for Performance
const DashboardPreview = dynamic(() => import("@/components/landing/DashboardPreview"), { ssr: false });
const RoastSlider = dynamic(() => import("@/components/landing/RoastSlider"), { ssr: false });

// Subtle Particle Background
const CanvasBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particles: Array<{ x: number; y: number; r: number; speed: number; opacity: number; color: string }> = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 1200,
        r: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.15 + 0.05,
        opacity: Math.random() * 0.3 + 0.1,
        color: Math.random() > 0.8 ? "rgba(229,57,53," : "rgba(255,255,255,",
      });
    }

    const drawBG = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = H;
        ctx.beginPath();
        ctx.arc(p.x % W, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ")";
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(drawBG);
    };

    drawBG();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} id="bg" className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-50" />;
};

export default function Home() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercent((window.scrollY / totalHeight) * 100);
      }
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Keep empty interval to avoid unused vars but keep timing logic if needed later
    const interval = setInterval(() => {
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { title: "Gmail Scanner", desc: "Instantly detect receipts from your inbox.", icon: Mail },
    { title: "Bank Statement Scanner", desc: "Upload PDFs to find hidden debit charges.", icon: Search },
    { title: "AI Spending Insights", desc: "Get smart recommendations on what to cancel.", icon: Sparkles },
    { title: "Subscription Health Meter", desc: "Audit your overall recurring spend efficiency.", icon: Activity },
    { title: "Spending Analytics", desc: "Interactive charts tracking your monthly projections.", icon: BarChart3 },
    { title: "AI Roast Mode", desc: "Let AI playfully judge your bad spending habits.", icon: Flame },
    { title: "Secure Dashboard", desc: "Bank-grade encryption for all your financial data.", icon: Shield }
  ];

  const testimonials = [
    { text: "I found ₹4,300 in forgotten subscriptions. The AI instantly mapped out two services I thought I had cancelled in 2024.", name: "Varun Sharma", role: "SaaS Founder", saved: "₹22,000/yr", initials: "VS" },
    { text: "Cancelled 6 unused subscriptions in minutes. The Gmail scan was incredibly accurate and found things my bank app missed entirely.", name: "Riya Sen", role: "Product Designer", saved: "₹8,400/yr", initials: "RS" },
    { text: "Finally knew where my money disappeared every month. The dashboard feels like a command center for my personal finances.", name: "Amit Patel", role: "Creative Lead", saved: "₹14,000/yr", initials: "AP" }
  ];

  return (
    <div className="bg-[#050505] text-white min-h-screen relative font-sans antialiased overflow-x-hidden selection:bg-[#E53935] selection:text-white">
      <CanvasBackground />
      
      <div 
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-[#8E1010] via-[#E53935] to-[#ff5252] z-[600]"
        style={{ width: `${scrollPercent}%` }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-300 ${
        scrolled ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-3" : "py-5 border-b border-transparent bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
          <a href="#home" className="font-display font-bold text-xl flex items-center gap-2 tracking-tight">
            Sub<span className="text-[#E53935]">Sense</span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="/dashboard" className="hidden md:inline text-[13px] font-semibold text-white/60 hover:text-white transition-colors">Log in</a>
            <a href="/dashboard" className="bg-white text-black hover:bg-neutral-200 font-bold text-[13px] px-5 py-2 rounded-full transition-all flex items-center gap-1.5 hover:-translate-y-[1px]">
              Scan Free
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden flex flex-col items-center text-center z-10 min-h-[90vh] justify-center" id="home">
        {/* Animated Background Glow */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.2, 0.15] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E53935] blur-[150px] rounded-full pointer-events-none -z-10" 
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-semibold text-white/80 uppercase tracking-widest backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#E53935] shadow-[0_0_8px_rgba(229,57,53,0.8)] animate-pulse" />
            AI-powered subscription intelligence
          </div>
          
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[1.05]">
            Stop Paying For<br />What You <span className="text-[#E53935]">Don&apos;t Use.</span>
          </h1>

          <p className="text-base sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-medium">
            Connect your Gmail or upload a bank statement. SubSense instantly discovers forgotten payments and hidden monthly expenses—then uses AI to recommend what to cancel.
          </p>

          <div className="flex flex-col items-center gap-4 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <a href="/dashboard" className="w-full sm:w-auto bg-[#E53935] hover:bg-[#d32f2f] text-white font-bold text-base px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(229,57,53,0.4)] hover:shadow-[0_8px_30px_rgba(229,57,53,0.6)] hover:-translate-y-1">
                Scan My Subscriptions Free <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#how" className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-base px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                <Play className="w-4 h-4 fill-white" /> Watch Demo
              </a>
            </div>
            <span className="text-[11px] text-white/40 font-medium tracking-wide">
              No credit card required • Free scan • 30 seconds
            </span>
          </div>
        </motion.div>
      </section>

      {/* TRUST TECH ROW */}
      <section className="relative z-10 py-8 border-y border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {["Google OAuth", "Gemini AI", "Supabase", "Next.js"].map((tech, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1), duration: 0.4 }}
                className="text-white/50 font-bold text-sm sm:text-base tracking-tight flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-[#E53935]" /> {tech}
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-white/50 font-medium">
            <Lock className="w-3.5 h-3.5 text-white/40" />
            Gmail access is read-only. We never sell your data.
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section className="py-24 px-6 max-w-7xl mx-auto scroll-mt-24 relative z-10">
        <DashboardPreview />
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 px-6 max-w-7xl mx-auto scroll-mt-24 relative z-10" id="how">
        <div className="text-center mb-20 space-y-4">
          <span className="text-[11px] font-bold text-[#E53935] uppercase tracking-widest">Workflow</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Three Steps to Savings</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          <div className="hidden lg:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />

          {[
            { step: "01", title: "Connect Gmail", desc: "Secure Google OAuth authentication or upload your bank statement.", icon: Mail },
            { step: "02", title: "AI Detects Everything", desc: "Automatically detects subscriptions, recurring payments and spending patterns.", icon: Search },
            { step: "03", title: "Save Money", desc: "Receive personalized AI insights and cancel unused subscriptions with confidence.", icon: Activity }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl relative flex flex-col items-center text-center group hover:bg-white/[0.04] hover:-translate-y-1 hover:border-white/10 transition-all shadow-lg"
            >
              <div className="w-20 h-20 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center group-hover:border-[#E53935] transition-colors relative shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <item.icon className="w-8 h-8 text-white/40 group-hover:text-[#E53935] transition-colors" />
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#E53935] text-white text-[10px] font-bold font-mono flex items-center justify-center shadow-lg">
                  {item.step}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mt-8">{item.title}</h3>
              <p className="text-[13px] text-white/60 mt-3 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto scroll-mt-24 relative z-10" id="features">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[11px] font-bold text-[#E53935] uppercase tracking-widest">Complete Toolkit</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Engineered for Total Control</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {features.map((feat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className={`p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.03] transition-all flex flex-col gap-5 group hover:-translate-y-1 shadow-lg ${idx === features.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/70 group-hover:bg-[#E53935]/10 group-hover:text-[#E53935] group-hover:border-[#E53935]/20 transition-all">
                <feat.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-[13px] text-white/50 mt-2 leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <a href="/dashboard" className="bg-white hover:bg-neutral-200 text-black font-bold px-8 py-4 rounded-full transition-all shadow-[0_4px_15px_rgba(255,255,255,0.1)] hover:-translate-y-1 flex items-center gap-2">
            Start Free Scan <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ROAST SLIDER (AI REALITY TRUTH) */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-left relative z-10 border-t border-white/5">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[11px] font-bold text-[#E53935] uppercase tracking-widest">Reality Audit</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">THE TRUTH</h2>
          <p className="text-sm text-white/50 max-w-md mx-auto">
            See actual roasts from other users of SubSense. Use our calculator deck to review how we score leaks.
          </p>
        </div>
        <RoastSlider />
      </section>

      {/* SOCIAL PROOF (TESTIMONIALS) */}
      <section className="py-32 bg-white/[0.01] border-y border-white/5 scroll-mt-24 relative z-10" id="reviews">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-16 space-y-4">
            <span className="text-[11px] font-bold text-[#E53935] uppercase tracking-widest">Verified Reviews</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold">Trusted by students, professionals and freelancers.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 text-left flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-6">
                  <div className="text-[#E53935] text-sm tracking-widest flex gap-1">
                    {[1,2,3,4,5].map(star => <span key={star}>★</span>)}
                  </div>
                  <p className="text-[15px] text-white/80 leading-relaxed font-medium">
                    &ldquo;{test.text}&rdquo;
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E53935] to-[#8E1010] flex items-center justify-center font-bold text-xs text-white">
                    {test.initials}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold text-white leading-none">{test.name}</h5>
                    <span className="text-[11px] text-white/50">{test.role}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/40 block">Found</span>
                    <span className="text-xs font-bold font-mono text-[#E53935]">{test.saved}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-32 px-6 max-w-7xl mx-auto scroll-mt-24 relative z-10" id="pricing">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[11px] font-bold text-[#E53935] uppercase tracking-widest">Pricing Model</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Invest in Your Budget</h2>
          <p className="text-white/50 max-w-md mx-auto text-sm sm:text-base">
            Choose the tier tailored to your monthly subscription complexity.
          </p>

          <div className="flex items-center justify-center gap-4 pt-6">
            <span className={`text-[13px] font-semibold transition ${billingInterval === "monthly" ? "text-white" : "text-white/40"}`}>Billed Monthly</span>
            <div 
              onClick={() => setBillingInterval(prev => prev === "monthly" ? "yearly" : "monthly")}
              className={`w-[56px] h-8 rounded-full border border-white/10 relative cursor-pointer bg-[#0a0a0a] transition-colors hover:border-white/30`}
            >
              <div 
                className="w-6 h-6 rounded-full bg-[#E53935] absolute top-[3px] left-[3px] transition-transform duration-300 shadow-md"
                style={{ transform: billingInterval === "yearly" ? "translateX(24px)" : "none" }}
              />
            </div>
            <span className={`text-[13px] font-semibold transition ${billingInterval === "yearly" ? "text-white" : "text-white/40"}`}>Billed Annually</span>
            <span className="bg-[#E53935]/10 border border-[#E53935]/30 text-[#E53935] text-[10px] font-bold font-mono px-2.5 py-1 rounded-full">Save 20%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Base Plan */}
          <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between min-h-[420px] shadow-lg">
            <div>
              <span className="text-[11px] text-white/50 uppercase tracking-widest font-bold font-mono">Starter Tier</span>
              <h3 className="font-display text-3xl font-bold mt-2">Free Tracker</h3>
              <div className="font-mono mt-6 flex items-baseline gap-1">
                <b className="text-5xl font-bold text-white">₹0</b>
                <span className="text-white/40 text-sm">/ forever</span>
              </div>
              <ul className="space-y-4 mt-8 text-[13px] text-white/70 font-medium">
                {["Track up to 10 subscriptions", "Manual receipt input log", "Basic cycle notifications"].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-white/30 mt-0.5 shrink-0" strokeWidth={3} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a href="/dashboard" className="w-full py-4 text-center border border-white/10 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors mt-8">
              Start Free Tracking
            </a>
          </div>

          {/* Pro Plan */}
          <div className="p-10 rounded-3xl bg-[#E53935]/5 border border-[#E53935]/30 text-left flex flex-col justify-between relative shadow-[0_8px_40px_-12px_rgba(229,57,53,0.3)] hover:border-[#E53935]/60 transition-all min-h-[420px]">
            <div className="absolute -top-4 right-8 bg-[#E53935] text-white font-mono text-[10px] font-bold tracking-wider px-4 py-1.5 rounded-full uppercase shadow-[0_4px_14px_rgba(229,57,53,0.5)]">
              Most Popular
            </div>

            <div>
              <span className="text-[11px] text-[#E53935] uppercase tracking-widest font-bold font-mono">Premium Intelligence</span>
              <h3 className="font-display text-3xl font-bold mt-2">Intelligence Pro</h3>
              <div className="font-mono mt-6 flex items-baseline gap-1">
                <b className="text-5xl font-bold text-white">{billingInterval === "monthly" ? "₹199" : "₹159"}</b>
                <span className="text-white/40 text-sm">/ month</span>
              </div>
              <ul className="space-y-4 mt-8 text-[13px] text-white/80 font-medium">
                {["Unlimited subscription tracking", "Automated Gmail API Scanning", "PDF Bank Statement scans", "AI Truth & insights console"].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#E53935] mt-0.5 shrink-0" strokeWidth={3} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a href="/dashboard" className="w-full py-4 text-center bg-[#E53935] hover:bg-[#d32f2f] rounded-xl text-sm font-bold text-white transition-all mt-8 shadow-[0_4px_14px_rgba(229,57,53,0.3)] hover:-translate-y-1">
              Get Pro Access
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center relative z-10">
        <div className="p-12 sm:p-20 rounded-[40px] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden text-center space-y-8 shadow-2xl">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Your Wallet Deserves <span className="text-[#E53935]">Better.</span>
          </h2>
          
          <p className="text-white/60 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Plug the money leaks, optimize duplicate packages, and stop paying auto-renewals on products you abandoned. Setup takes 30 seconds.
          </p>

          <a href="/dashboard" className="px-9 py-4 bg-[#E53935] hover:bg-[#d32f2f] hover:-translate-y-1 text-white font-bold rounded-full transition-all inline-flex items-center gap-2 text-sm shadow-[0_4px_20px_rgba(229,57,53,0.3)]">
            Start Saving Today <ArrowRight className="w-4.5 h-4.5" />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6 relative z-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <a href="#home" className="font-display font-bold text-xl flex items-center gap-2 tracking-tight">
            Sub<span className="text-[#E53935]">Sense</span>
          </a>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-[13px] font-semibold text-white/50">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>

          <span className="text-[11px] text-white/30 font-mono">
            © 2026 SubSense. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
