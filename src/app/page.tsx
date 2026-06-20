"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mail, Brain, Activity, Bell, BarChart3, Copy, Users, 
  RefreshCw, Sparkles, Trash2, Calendar as CalendarIcon, 
  FileText, MessageSquare, LineChart, MessageCircle, 
  ArrowRight, ShieldCheck, Flame, Zap, DollarSign, Check, Play, ChevronRight
} from "lucide-react";

// Subcomponents
import GmailScan from "@/components/landing/GmailScan";
import Calculator from "@/components/landing/Calculator";
import HealthScore from "@/components/landing/HealthScore";
import RoastSlider from "@/components/landing/RoastSlider";
import BillingTimeline from "@/components/landing/BillingTimeline";
import DashboardPreview from "@/components/landing/DashboardPreview";

const FEATURE_CARDS = [
  { title: "Gmail Subscription Detection", desc: "Instantly scan inbox receipts & invoice emails using secure, read-only AI recognition.", icon: Mail },
  { title: "AI Expense Analysis", desc: "Deconstruct your recurring billing patterns to map exactly where every rupee goes.", icon: Brain },
  { title: "Subscription Health Score", desc: "Understand your spending efficiency with a single dynamic AI metric score.", icon: Activity },
  { title: "Renewal Alerts", desc: "Get smart notifications 24 hours before auto-renewal charges hit your account.", icon: Bell },
  { title: "Spending Analytics", desc: "Beautifully visual interactive breakdowns of monthly, quarterly, and annual costs.", icon: BarChart3 },
  { title: "Duplicate Subscription Detection", desc: "Instantly flag double-billing or services with duplicate features (like Spotify & Apple Music).", icon: Copy },
  { title: "Family Sharing Suggestions", desc: "Identify options to transition standard plans to shared family accounts to split costs.", icon: Users },
  { title: "Recurring Payment Detection", desc: "Isolate non-standard recurring invoices and subtle direct-debit patterns.", icon: RefreshCw },
  { title: "AI Savings Recommendations", desc: "Tailored strategic plans showing you exactly which accounts to pause or downgrade.", icon: Sparkles },
  { title: "Financial Waste Detection", desc: "Pinpoint subscriptions you are paying for but haven't actually signed into in months.", icon: Trash2 },
  { title: "Smart Subscription Calendar", desc: "A neat calendar interface outlining billing dates and renewal deadlines chronologically.", icon: CalendarIcon },
  { title: "PDF Bank Statement Analysis", desc: "Drag and drop bank statement PDFs to extract historical billing data offline in seconds.", icon: FileText },
  { title: "SMS-Based Detection", desc: "Integrate billing alerts from transaction SMS receipts for total coverage.", icon: MessageSquare },
  { title: "Annual Spending Forecast", desc: "Advanced projections detailing where your subscription expenses will stand in 1-5 years.", icon: LineChart },
  { title: "AI Subscription Assistant", desc: "A smart chat bot to assist in drafting cancellation requests or negotiating discounts.", icon: MessageCircle }
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen relative overflow-x-hidden selection:bg-[#EF233C] selection:text-white">
      {/* Decorative background lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-crimson/10 rounded-full blur-[150px] pointer-events-none -z-20" />
      <div className="absolute top-[30%] right-[-10%] w-[45%] h-[45%] bg-deep-red/5 rounded-full blur-[150px] pointer-events-none -z-20" />
      <div className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] bg-crimson/5 rounded-full blur-[150px] pointer-events-none -z-20" />

      {/* Floating Header */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl glass-panel-heavy rounded-full px-6 py-3 flex items-center justify-between z-50 transition-all duration-300">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-deep-red to-crimson flex items-center justify-center font-black text-white text-base shadow-[0_0_15px_rgba(239,35,60,0.4)]">
            S
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-silver to-white bg-clip-text text-transparent">
            SubSense
          </span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-white/70">
          <a href="#features" className="hover:text-crimson transition">Features</a>
          <a href="#scan" className="hover:text-crimson transition">Gmail Scan</a>
          <a href="#calculator" className="hover:text-crimson transition">Calculator</a>
          <a href="#roast" className="hover:text-crimson transition">AI Roast</a>
          <a href="#pricing" className="hover:text-crimson transition">Pricing</a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="text-xs sm:text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 px-4.5 py-2 rounded-full transition flex items-center gap-1.5"
          >
            Launch App
            <ArrowRight className="w-3.5 h-3.5 text-crimson" />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-36 pb-20 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[90vh] text-center">
        
        {/* Animated Pill Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/10 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:border-crimson/30 transition-all cursor-pointer mb-6"
        >
          <Zap className="w-3.5 h-3.5 text-crimson animate-pulse" />
          <span>Announcing SubSense AI v2.0</span>
          <ChevronRight className="w-3 h-3 text-white/40" />
        </motion.div>

        {/* Big Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] max-w-4xl text-glow"
        >
          Stop Paying For What <br />
          <span className="bg-gradient-to-r from-deep-red via-crimson to-white bg-clip-text text-transparent">
            You Don't Use.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-white/60 font-medium max-w-2xl mt-6 leading-relaxed"
        >
          SubSense automatically discovers subscriptions, tracks recurring payments, and helps you save money with AI-powered insights.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
        >
          <a
            href="/dashboard"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-deep-red to-crimson hover:brightness-110 active:scale-95 text-white font-bold transition shadow-lg shadow-crimson/20 flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#dashboard-preview"
            className="px-8 py-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            Watch Demo
          </a>
        </motion.div>

        {/* Floating subscription badges container */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden hidden lg:block">
          {/* Netflix Badge */}
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[25%] left-[10%] bg-black/80 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-2xl"
          >
            <span className="text-lg">🎬</span>
            <div className="text-left">
              <p className="text-[10px] font-bold text-white">Netflix Premium</p>
              <p className="text-[8px] text-white/40">₹649/mo • Unused</p>
            </div>
          </motion.div>

          {/* Spotify Badge */}
          <motion.div
            animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[45%] right-[10%] bg-black/80 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-2xl"
          >
            <span className="text-lg">🎵</span>
            <div className="text-left">
              <p className="text-[10px] font-bold text-white">Spotify Duo</p>
              <p className="text-[8px] text-white/40">₹149/mo • Active</p>
            </div>
          </motion.div>

          {/* ChatGPT Badge */}
          <motion.div
            animate={{ y: [0, -10, 0], x: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[20%] left-[15%] bg-black/80 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-2xl"
          >
            <span className="text-lg">🤖</span>
            <div className="text-left">
              <p className="text-[10px] font-bold text-white">ChatGPT Plus</p>
              <p className="text-[8px] text-white/40">₹1,999/mo • Copied</p>
            </div>
          </motion.div>

          {/* Canva Badge */}
          <motion.div
            animate={{ y: [0, 15, 0], x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[28%] right-[15%] bg-black/80 border border-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-2xl"
          >
            <span className="text-lg">🎨</span>
            <div className="text-left">
              <p className="text-[10px] font-bold text-white">Canva Pro</p>
              <p className="text-[8px] text-white/40">₹499/mo • Duplicate</p>
            </div>
          </motion.div>
        </div>

        {/* Security badges */}
        <div className="flex items-center gap-6 mt-16 text-white/40 text-xs font-semibold">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SOC2 Type II Compliant</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AES-256 Data Encryption</span>
          </div>
        </div>
      </header>

      {/* Gmail Scan Section */}
      <section id="scan" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto text-center scroll-mt-24">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-glow">
          Zero Effort Discovery
        </h2>
        <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base mt-3 mb-12">
          Connect your account and let our advanced natural language processing map out your subscription landscape instantly.
        </p>
        <GmailScan />
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto text-center scroll-mt-24">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-glow">
          Calculate Your Leak
        </h2>
        <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base mt-3 mb-12">
          You are likely paying a lot more than you realize. Move the slider to gauge your potential annual savings.
        </p>
        <Calculator />
      </section>

      {/* Health Score Section */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-glow">
          AI Subscription Health
        </h2>
        <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base mt-3 mb-12">
          Receive a granular rating of your financial waste. Lower duplicate accounts, cancel idle trials, and raise your score.
        </p>
        <HealthScore />
      </section>

      {/* Roast Section */}
      <section id="roast" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto text-center scroll-mt-24">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-glow">
          No Holds Barred Roasts
        </h2>
        <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base mt-3 mb-12">
          Our AI scans your log inactivity metrics and delivers a brutal truth about your subscription waste.
        </p>
        <RoastSlider />
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-glow">
          Visual Renewal Tracker
        </h2>
        <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base mt-3 mb-12">
          See exactly when every subscription billing period restarts and avoid getting charged on forgotten trials.
        </p>
        <BillingTimeline />
      </section>

      {/* Dashboard Preview Section */}
      <section id="dashboard-preview" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto text-center scroll-mt-24">
        <div className="mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-crimson">SaaS Interface</span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-glow mt-2">
            The Dashboard of Financial Power
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm sm:text-base mt-3">
            Get an absolute view of your recurring balance outlays. Control, pause, or request cancellation of subscriptions directly.
          </p>
        </div>
        <DashboardPreview />
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-glow">
            Four Steps to Freedom
          </h2>
          <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base mt-3">
            Getting your recurring spending in check has never been this clean.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Connect Gmail", desc: "Grant highly secure, read-only receipt tracking permissions with one tap." },
            { step: "02", title: "AI Discovery", desc: "Our engine scans past receipts, transaction mails, and invoices instantly." },
            { step: "03", title: "Analyze Spending", desc: "Review your automated dashboard, categorizing waste, duplicates, and timeline dates." },
            { step: "04", title: "Optimize & Save", desc: "Cancel inactive plans with our AI cancellation helper or downgrade plans in one tap." },
          ].map((item, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl glass-panel relative group hover:border-crimson/30 transition-all duration-300"
            >
              <div className="text-4xl font-black text-crimson/20 group-hover:text-crimson/50 transition-colors font-mono">
                {item.step}
              </div>
              <h4 className="text-lg font-bold text-white mt-4">{item.title}</h4>
              <p className="text-sm text-white/50 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-crimson">Comprehensive Toolkit</span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-glow mt-2">
            Engineered For Total Control
          </h2>
          <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base mt-3">
            We built every tool you need to trace, understand, and reduce recurring costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURE_CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-crimson/30 hover:bg-white/[0.02] transition-all duration-300 flex gap-4 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-crimson/10 border border-crimson/20 flex items-center justify-center text-crimson flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{card.title}</h4>
                  <p className="text-sm text-white/40 mt-1.5 leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-glow">
              Backed by Real Savings
            </h2>
            <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base mt-3">
              Hear from startup founders, creators, and professionals who audited their finance pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Varun Sharma", role: "SaaS Founder", quote: "SubSense found 4 duplicate Canva accounts inside our marketing team folders within 2 mins of setup. Saved us over ₹22,000/yr immediately.", savings: "Saved ₹22,400/yr", avatar: "👨‍💻" },
              { name: "Riya Sen", role: "UX Designer", quote: "The AI roast was the wake-up call I needed. I was paying for Adobe Suite apps I hadn't opened since 2025. The circular dashboard score is addictive.", savings: "Saved ₹18,500/yr", avatar: "👩‍🎨" },
              { name: "Amit Patel", role: "Creative Lead", quote: "PDF Bank Statement scan works flawlessly. Dragged my quarterly statement in, and it mapped out two separate server hostings I forgot to deactivate.", savings: "Saved ₹9,800/yr", avatar: "👨‍💼" },
            ].map((test, index) => (
              <div 
                key={index} 
                className="p-6 rounded-2xl glass-panel flex flex-col justify-between hover:border-white/20 transition-all text-left"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm">{test.avatar}</div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{test.name}</h4>
                        <p className="text-[10px] text-white/40">{test.role}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {test.savings}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed italic">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-0.5 mt-4 text-[10px] text-white/30 font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified User
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 sm:px-12 max-w-5xl mx-auto text-center scroll-mt-24">
        <div className="mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-crimson">Simple Pricing</span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-glow mt-2">
            Invest in Your Budget
          </h2>
          <p className="text-white/50 max-w-md mx-auto text-sm sm:text-base mt-3">
            Choose the plan that matches your monthly recurring outlay complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 text-left flex flex-col justify-between hover:border-white/15 transition-all">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-white/50">Base Level</span>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40">Free Forever</span>
              </div>
              <h3 className="text-2xl font-black text-white">Free Tracker</h3>
              <p className="text-xs text-white/40 mt-1.5">Perfect for individual users tracking basic items.</p>
              
              <div className="text-3xl font-black text-white mt-6">₹0</div>
              
              <ul className="mt-8 space-y-3.5 text-xs text-white/70">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Track up to 10 active subscriptions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Manual receipt input</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Basic renewal notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Monthly spend chart view</span>
                </li>
              </ul>
            </div>
            
            <a 
              href="/dashboard"
              className="mt-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-center text-xs font-bold text-white transition cursor-pointer"
            >
              Start Free Tracking
            </a>
          </div>

          {/* Premium Plan */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-deep-red/10 to-transparent border border-crimson/30 text-left flex flex-col justify-between relative shadow-[0_0_30px_rgba(239,35,60,0.05)] hover:border-crimson/50 transition-all">
            <div className="absolute top-4 right-4 bg-crimson px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-md">
              Most Popular
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-crimson">Elite Tier</span>
              </div>
              <h3 className="text-2xl font-black text-white">Premium Intelligence</h3>
              <p className="text-xs text-white/40 mt-1.5">Unleash automated AI scans and high-tier recommendations.</p>
              
              <div className="text-3xl font-black text-white mt-6">
                ₹199<span className="text-xs font-medium text-white/40">/month</span>
              </div>
              
              <ul className="mt-8 space-y-3.5 text-xs text-white/70">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">Unlimited subscription tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">Automated Gmail Scanner</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Duplicate & Idle contract detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>AI Subscription Assistant Chat</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>SMS & PDF Bank Statement scanner</span>
                </li>
              </ul>
            </div>
            
            <a 
              href="/dashboard"
              className="mt-8 py-3 rounded-xl bg-gradient-to-r from-deep-red to-crimson hover:brightness-110 text-center text-xs font-bold text-white transition shadow-md shadow-crimson/25 cursor-pointer"
            >
              Get Premium Access
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-6 sm:px-12 max-w-5xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-gradient-to-t from-crimson/10 to-transparent blur-3xl pointer-events-none -z-10" />
        
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-glow">
          Your Wallet Deserves Better.
        </h2>
        <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base mt-6 mb-10 leading-relaxed">
          Plug the money leaks, optimize duplicate packages, and stop paying auto-renewals on products you abandoned. Setup takes 2 minutes.
        </p>

        <a
          href="/dashboard"
          className="px-10 py-4 rounded-full bg-gradient-to-r from-deep-red to-crimson hover:brightness-110 text-white font-black transition-all shadow-xl shadow-crimson/20 cursor-pointer inline-flex items-center gap-2 text-base"
        >
          Start Saving Today
          <ArrowRight className="w-4 h-4" />
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/60 py-12 px-6 sm:px-12 text-center text-xs text-white/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-crimson flex items-center justify-center font-black text-white text-[10px]">
              S
            </div>
            <span className="font-bold text-white/70">SubSense.ai</span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition">Terms of Service</a>
            <a href="#" className="hover:text-white/60 transition">Security Protocol</a>
            <a href="#" className="hover:text-white/60 transition">Support</a>
          </div>

          <div>
            <span>© 2026 SubSense Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
