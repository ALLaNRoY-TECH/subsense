"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Search, CheckCircle, RefreshCw } from "lucide-react";

interface DetectedSub {
  name: string;
  price: string;
  category: string;
  icon: string;
  status: "active" | "wasting" | "duplicate";
  color: string;
}

const SAMPLE_SUBS: DetectedSub[] = [
  { name: "Netflix Premium", price: "₹649/mo", category: "Entertainment", icon: "🎬", status: "wasting", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { name: "Spotify Premium", price: "₹119/mo", category: "Music", icon: "🎵", status: "active", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { name: "ChatGPT Plus", price: "₹1,999/mo", category: "AI & Productivity", icon: "🤖", status: "active", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { name: "Prime Video", price: "₹299/mo", category: "Entertainment", icon: "📦", status: "wasting", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { name: "Canva Pro", price: "₹499/mo", category: "Design", icon: "🎨", status: "duplicate", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { name: "Github Copilot", price: "₹850/mo", category: "Development", icon: "💻", status: "active", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
];

export default function GmailScan() {
  const [scanState, setScanState] = useState<"idle" | "connecting" | "scanning" | "finished">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [detectedList, setDetectedList] = useState<DetectedSub[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const runScan = () => {
    setScanState("connecting");
    setLogs(["Requesting read-only metadata access to Gmail API...", "OAuth 2.0 handshake verified securely."]);
    setCurrentStep(0);
    setDetectedList([]);
    setScanProgress(0);
  };

  useEffect(() => {
    if (scanState === "connecting") {
      const timer = setTimeout(() => {
        setScanState("scanning");
        setLogs(prev => [...prev, "Analyzing receipts & monthly invoices from past 12 months..."]);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [scanState]);

  useEffect(() => {
    if (scanState === "scanning") {
      const interval = setInterval(() => {
        if (currentStep < SAMPLE_SUBS.length) {
          const nextSub = SAMPLE_SUBS[currentStep];
          setDetectedList(prev => [...prev, nextSub]);
          setLogs(prev => [
            ...prev,
            `Scan: Found ${nextSub.name} transaction confirmation (${nextSub.price})`
          ]);
          setScanProgress(((currentStep + 1) / SAMPLE_SUBS.length) * 100);
          setCurrentStep(prev => prev + 1);
        } else {
          clearInterval(interval);
          setScanState("finished");
          setLogs(prev => [
            ...prev,
            "Gmail scan completed. Found 12 recurring subscriptions (6 displayed in quick preview).",
            "Subscription Health score calculated: 72/100."
          ]);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [scanState, currentStep]);

  return (
    <div className="w-full max-w-3xl mx-auto glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-crimson/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-deep-red/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-6 mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Mail className="w-6 h-6 text-crimson" />
            Inbox Scan Simulator
          </h3>
          <p className="text-sm text-white/50">
            Securely discover subscriptions without manual logging.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-[380px]">
        <div className="md:col-span-2 flex flex-col justify-between bg-black/60 rounded-xl border border-white/5 p-4 font-mono text-[11px] leading-relaxed text-white/70 h-[380px] overflow-hidden">
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[320px] no-scrollbar">
            <div className="flex items-center gap-1.5 text-white/40 pb-1 border-b border-white/5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="ml-1 text-[10px]">subsense-ai-scanner ~ bash</span>
            </div>
            {scanState === "idle" && (
              <span className="text-white/40 italic">Waiting to connect... Press &quot;Scan Gmail Account&quot; to begin simulator.</span>
            )}
            {logs.map((log, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={log.startsWith("✓") ? "text-emerald-400" : log.includes("Error") ? "text-red-400" : "text-white/70"}
              >
                {log.startsWith("✓") || log.startsWith("Scan:") ? "" : "> "}{log}
              </motion.p>
            ))}
            {scanState === "scanning" && (
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-crimson"
              >
                &gt; Analyzing email threads...
              </motion.div>
            )}
          </div>

          <div className="pt-2 border-t border-white/5 mt-2 flex items-center justify-between text-white/40 text-[10px]">
            <span>STATUS: {scanState.toUpperCase()}</span>
            <span>{Math.round(scanProgress)}%</span>
          </div>
        </div>

        <div className="md:col-span-3 flex flex-col justify-between bg-white/[0.01] rounded-xl border border-white/5 p-4">
          <div className="flex flex-col h-full justify-between">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mt-4">Automated Inbox Extraction</h3>
              <p className="text-sm text-white/50 mt-2 mb-6">Connect via read-only OAuth to extract historical receipts. We ignore personal mail. It&apos;s 100% private.</p>
              <div className="space-y-2.5 max-h-[250px] overflow-y-auto no-scrollbar pr-1">
                <AnimatePresence>
                  {detectedList.length === 0 && (
                    <div className="h-40 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg text-white/30 text-xs gap-2">
                      <Search className="w-8 h-8 opacity-40 animate-pulse text-crimson" />
                      <span>No subscriptions loaded yet.</span>
                    </div>
                  )}
                  {detectedList.map((sub) => (
                    <motion.div
                      key={sub.name}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-xl w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                          {sub.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">{sub.name}</h4>
                          <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{sub.category}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-sm font-bold text-white">{sub.price}</span>
                        <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono border ${sub.color}`}>
                          {sub.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA action bottom */}
            <div>
              {scanState === "idle" && (
                <button
                  onClick={runScan}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-deep-red to-crimson hover:brightness-110 active:brightness-95 text-white font-semibold transition-all shadow-lg shadow-crimson/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  Connect & Scan My Gmail
                </button>
              )}

              {scanState === "connecting" && (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/50 font-semibold flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 animate-spin text-crimson" />
                  Establishing Secure Bridge...
                </button>
              )}

              {scanState === "scanning" && (
                <div className="space-y-2">
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-deep-red to-crimson"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/50 font-semibold flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4 animate-pulse text-crimson" />
                    Scanning... ({Math.round(scanProgress)}%)
                  </button>
                </div>
              )}

              {scanState === "finished" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold justify-center bg-emerald-500/10 py-2 border border-emerald-500/20 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    12 Active Subscriptions Discovered
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={runScan}
                      className="py-2.5 px-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Scan Again
                    </button>
                    <a
                      href="/dashboard"
                      className="py-2.5 px-3 rounded-lg bg-gradient-to-r from-deep-red to-crimson hover:brightness-110 transition text-xs font-semibold flex items-center justify-center gap-1 text-center"
                    >
                      View AI Dashboard
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
