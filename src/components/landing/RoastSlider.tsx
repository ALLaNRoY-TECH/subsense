"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChevronLeft, ChevronRight, Share2, AlertOctagon } from "lucide-react";

interface RoastCard {
  quote: string;
  sub: string;
  metric: string;
  advice: string;
  cost: string;
}

const ROASTS: RoastCard[] = [
  {
    quote: "You paid ₹7,788 for Netflix this year and watched exactly 3 movies. That is ₹2,596 per movie.",
    sub: "Netflix Premium",
    metric: "Last opened: 42 days ago",
    advice: "Downgrade to Standard or pause. You are literally funding their blockbusters without watching them.",
    cost: "₹7,788 wasted",
  },
  {
    quote: "Your gym membership is more committed to taking your money than you are to lifting weights.",
    sub: "Gold's Gym Membership",
    metric: "Card scanned: Jan 4th (1 time total)",
    advice: "Cancel immediately. If you need exercise, running away from this subscription is free.",
    cost: "₹18,000 wasted",
  },
  {
    quote: "Prime Video has not been opened in 87 days. Jeff Bezos is personally thanking you for the donation.",
    sub: "Amazon Prime",
    metric: "Last opened: Mar 25th",
    advice: "You probably only keep it for free delivery. Turn off auto-renew and order in bulk.",
    cost: "₹1,499 wasted",
  },
  {
    quote: "You paid for Canva Pro to remove the background from exactly 2 PNG files this whole quarter.",
    sub: "Canva Pro",
    metric: "Created designs: 2 templates",
    advice: "Use free background remover websites. Cancel Pro until you actually start a design business.",
    cost: "₹1,497 wasted",
  },
  {
    quote: "Paying for Duolingo Plus for a 432-day streak of doing 1 lesson of Spanish. 'Hola' is not worth ₹7,200.",
    sub: "Duolingo Super",
    metric: "Lessons completed: 1 min/day",
    advice: "Switch back to the free ad-supported tier. The owl will survive, we promise.",
    cost: "₹7,200 spent",
  },
];

export default function RoastSlider() {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const nextRoast = () => {
    setIndex((prev) => (prev + 1) % ROASTS.length);
  };

  const prevRoast = () => {
    setIndex((prev) => (prev - 1 + ROASTS.length) % ROASTS.length);
  };

  const shareRoast = () => {
    setCopied(true);
    navigator.clipboard.writeText(`"${ROASTS[index].quote}" - Tracked & Revealed by SubSense.ai`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative px-4">
      {/* Absolute glow element */}
      <div className="absolute inset-0 bg-gradient-to-r from-deep-red/10 to-transparent blur-2xl pointer-events-none -z-10" />

      {/* Main card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 relative min-h-[280px] flex flex-col justify-between border border-crimson/20 shadow-[0_0_30px_rgba(217,4,41,0.05)]">
        <div className="absolute -top-3.5 left-6 bg-crimson px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-crimson/30">
          <Flame className="w-3.5 h-3.5 fill-white animate-bounce" />
          THE TRUTH
        </div>

        <div className="absolute top-4 right-4 text-white/20">
          <AlertOctagon className="w-6 h-6" />
        </div>

        <div className="my-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 uppercase tracking-widest font-mono">
                  Target: {ROASTS[index].sub}
                </span>
                <span className="text-[9px] bg-red-500/10 text-crimson border border-red-500/20 px-2 py-0.5 rounded font-bold uppercase">
                  {ROASTS[index].cost}
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white leading-relaxed italic">
                &ldquo;{ROASTS[index].quote}&rdquo;
              </p>
              <div className="text-xs text-white/40 font-medium bg-white/[0.02] border border-white/5 p-3 rounded-lg flex items-center justify-between">
                <span>💡 {ROASTS[index].advice}</span>
                <span className="text-[10px] text-white/30 whitespace-nowrap ml-2 font-mono">
                  {ROASTS[index].metric}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Buttons and controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
          <div className="flex gap-2">
            <button
              onClick={prevRoast}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextRoast}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={shareRoast}
            className="py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? "Copied Link!" : "Share Truth"}
          </button>
        </div>
      </div>
    </div>
  );
}
