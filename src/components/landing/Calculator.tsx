"use client";

import React, { useState, useEffect } from "react";
import { animate } from "framer-motion";
import { Calculator as CalcIcon, AlertTriangle, TrendingDown } from "lucide-react";

// CountUp component to animate number counting
function CountUp({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span>₹{displayValue.toLocaleString("en-IN")}</span>;
}

export default function Calculator() {
  const [monthlySpend, setMonthlySpend] = useState<number>(3450);

  // Math variables
  const yearlySpend = monthlySpend * 12;
  // Estimate that 35% of subscription spending is wasted on average (forgotten, unused, duplicates)
  const potentialSavings = Math.round(monthlySpend * 0.365) * 12;
  const wastePercentage = 36.5;

  return (
    <div className="w-full max-w-3xl mx-auto glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-80 h-80 bg-deep-red/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-5 mb-6">
        <div className="w-10 h-10 rounded-xl bg-crimson/20 border border-crimson/30 flex items-center justify-center">
          <CalcIcon className="w-5 h-5 text-crimson animate-pulse" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Interactive Savings Calculator</h3>
          <p className="text-sm text-white/50">See how much forgotten charges cost you every single year.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Slider inputs (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-sm font-semibold text-white/70">Estimated Monthly Spend</span>
              <span className="text-xl font-black text-crimson">
                ₹{monthlySpend.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="relative group py-4">
              <input
                type="range"
                min="500"
                max="15000"
                step="250"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="w-full h-2 bg-black/60 rounded-lg appearance-none cursor-pointer accent-crimson outline-none border border-white/5"
              />
              <div className="flex justify-between text-[10px] text-white/30 mt-2 font-mono">
                <span>₹500</span>
                <span>₹5,000</span>
                <span>₹10,000</span>
                <span>₹15,000+</span>
              </div>
            </div>
          </div>

          {/* Quick toggle presets */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">Spending Presets</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Casual User", value: 1250 },
                { label: "Power User", value: 3450 },
                { label: "Pro/SaaS Heavy", value: 7800 }
              ].map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setMonthlySpend(preset.value)}
                  className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer text-xs ${
                    monthlySpend === preset.value
                      ? "bg-crimson/20 border-crimson text-white font-bold"
                      : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="font-semibold">{preset.label}</div>
                  <div className="text-[10px] opacity-70">₹{preset.value}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex gap-3 text-xs text-white/70 items-start">
            <AlertTriangle className="w-5 h-5 text-crimson flex-shrink-0 mt-0.5" />
            <p>
              On average, users underestimate their monthly subscription costs by **60%**. Gym memberships, cloud storage, streaming duplicates, and unused software accounts quickly stack up.
            </p>
          </div>
        </div>

        {/* Results display (5 cols) */}
        <div className="md:col-span-5 bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-5 relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 w-32 h-32 bg-crimson/5 rounded-full blur-2xl pointer-events-none" />

          {/* Monthly Spend Display */}
          <div className="border-b border-white/5 pb-3">
            <span className="text-xs text-white/40 block">Total Monthly Spend</span>
            <span className="text-lg font-bold text-white">
              <CountUp value={monthlySpend} />
            </span>
          </div>

          {/* Yearly Spend Display */}
          <div className="border-b border-white/5 pb-3">
            <span className="text-xs text-white/40 block">Total Yearly Spend</span>
            <span className="text-lg font-bold text-white/80">
              <CountUp value={yearlySpend} />
            </span>
          </div>

          {/* Potential Savings Display */}
          <div className="bg-gradient-to-br from-deep-red/20 to-crimson/10 border border-crimson/30 rounded-xl p-3.5 relative">
            <span className="text-xs text-white/70 block font-semibold flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-crimson" />
              Annual Savings Opportunity
            </span>
            <span className="text-3xl font-black text-white text-glow block mt-1">
              <CountUp value={potentialSavings} />
            </span>
            <span className="text-[10px] text-white/50 block mt-1">
              Based on optimizing ~{wastePercentage}% duplicate/unused spending.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
