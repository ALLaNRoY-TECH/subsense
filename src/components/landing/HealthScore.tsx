"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldAlert, Sparkles, Check, CheckCircle } from "lucide-react";

export default function HealthScore() {
  const score = 72;
  const strokeDasharray = 2 * Math.PI * 80; // 502.6
  const strokeDashoffset = strokeDasharray - (score / 100) * strokeDasharray;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const insights = [
    {
      title: "3 Unused Subscriptions",
      desc: "Adobe Premiere, Duolingo Premium & Xbox Live haven't been accessed in over 60 days.",
      saving: "₹1,850/mo",
      type: "waste",
    },
    {
      title: "2 Duplicate Services",
      desc: "You are paying for Apple Music and Spotify Premium simultaneously.",
      saving: "₹120/mo",
      type: "duplicate",
    },
    {
      title: "Alternative Family Options",
      desc: "Convert YouTube Premium to a Family Plan. Save ₹180/mo splitting with 3 household members.",
      saving: "₹180/mo",
      type: "optimize",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-80 h-80 bg-crimson/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-deep-red/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-5 mb-6">
        <div className="w-10 h-10 rounded-xl bg-crimson/20 border border-crimson/30 flex items-center justify-center">
          <Activity className="w-5 h-5 text-crimson" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Subscription Health Score</h3>
          <p className="text-sm text-white/50">AI audit scoring your overall subscription efficiency.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Circle Gauge (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center py-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Background glowing circle */}
            <div className="absolute inset-0 rounded-full bg-crimson/5 blur-lg" />
            
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="74"
                className="stroke-white/5"
                strokeWidth="10"
                fill="transparent"
              />
              <motion.circle
                cx="88"
                cy="88"
                r="74"
                className="stroke-crimson"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: strokeDasharray }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                strokeLinecap="round"
                style={{
                  filter: "drop-shadow(0px 0px 8px rgba(239, 35, 60, 0.6))",
                }}
              />
            </svg>

            {/* Score Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-4xl font-black text-white leading-none text-glow"
              >
                {score}
              </motion.span>
              <span className="text-[10px] uppercase tracking-widest text-white/40 mt-1 font-semibold">
                Health Score
              </span>
            </div>
          </div>
          <span className="mt-4 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-1.5 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" /> Action Required (Fair)
          </span>
        </div>

        {/* Insights list (7 cols) */}
        <div className="md:col-span-7 space-y-3.5">
          <span className="text-xs uppercase tracking-wider text-white/40 font-semibold block">
            AI Diagnosis Insights
          </span>
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <motion.div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`p-4 rounded-xl border transition-all duration-300 relative ${
                  hoveredIndex === idx
                    ? "bg-white/[0.04] border-crimson/40 translate-x-1"
                    : "bg-white/[0.01] border-white/5"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-crimson flex-shrink-0" />
                    <h4 className="text-sm font-bold text-white">{insight.title}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-crimson bg-crimson/10 border border-crimson/20 px-2.5 py-0.5 rounded-full">
                    Save {insight.saving}
                  </span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed pr-2">{insight.desc}</p>
                {hoveredIndex === idx && (
                  <div className="absolute right-3 bottom-3 flex items-center gap-1 text-[10px] text-crimson font-semibold pointer-events-none">
                    <span>Optimize</span>
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
