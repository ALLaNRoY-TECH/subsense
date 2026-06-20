"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Bell, DollarSign } from "lucide-react";

interface TimelineItem {
  day: number;
  month: string;
  name: string;
  price: string;
  logo: string;
  status: string;
}

const TIMELINE_DATA: TimelineItem[] = [
  { day: 2, month: "June", name: "Netflix Premium", price: "₹649", logo: "🎬", status: "Billed" },
  { day: 9, month: "June", name: "Adobe Creative Cloud", price: "₹4,230", logo: "🎨", status: "Billed" },
  { day: 14, month: "June", name: "Spotify Premium", price: "₹119", logo: "🎵", status: "Billed" },
  { day: 21, month: "June", name: "ChatGPT Plus", price: "₹1,999", logo: "🤖", status: "Renewal Today" },
  { day: 24, month: "June", name: "Canva Pro", price: "₹499", logo: "🖌️", status: "Upcoming" },
  { day: 28, month: "June", name: "iCloud+ 2TB", price: "₹749", logo: "☁️", status: "Upcoming" },
];

export default function BillingTimeline() {
  const [selectedItem, setSelectedItem] = useState<number>(3); // Default to ChatGPT Plus (today's renewal)

  return (
    <div className="w-full max-w-3xl mx-auto glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-80 h-80 bg-deep-red/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-5 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-crimson/20 border border-crimson/30 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-crimson" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Billing Cycle Timeline</h3>
            <p className="text-sm text-white/50">Keep track of auto-renewals before the charge hits.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-crimson bg-crimson/10 border border-crimson/20 px-3 py-1 rounded-full font-semibold">
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span>Next Alert: 6 Hours (ChatGPT Plus)</span>
        </div>
      </div>

      {/* Timeline Track */}
      <div className="relative py-8 my-4 overflow-x-auto no-scrollbar">
        {/* Horizontal Progress Line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/10 -translate-y-1/2 -z-10" />
        <div 
          className="absolute top-1/2 left-4 h-0.5 bg-gradient-to-r from-crimson to-deep-red -translate-y-1/2 -z-10 transition-all duration-500" 
          style={{ width: `${(selectedItem / (TIMELINE_DATA.length - 1)) * 90}%` }}
        />

        {/* Nodes */}
        <div className="flex justify-between min-w-[600px] px-4">
          {TIMELINE_DATA.map((item, index) => {
            const isSelected = selectedItem === index;
            const isPast = index < 3;
            const isToday = index === 3;

            return (
              <div 
                key={index} 
                className="flex flex-col items-center cursor-pointer relative"
                onClick={() => setSelectedItem(index)}
              >
                {/* Logo Node */}
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 transition-all relative ${
                    isSelected 
                      ? "bg-crimson border-white text-white shadow-[0_0_20px_rgba(239,35,60,0.6)]" 
                      : isToday
                      ? "bg-[#0A0A0A] border-crimson text-white animate-pulse"
                      : isPast
                      ? "bg-neutral-900 border-neutral-700 text-white/60"
                      : "bg-[#0A0A0A] border-white/15 text-white/40"
                  }`}
                >
                  {item.logo}
                  {isToday && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-crimson"></span>
                    </span>
                  )}
                </motion.div>

                {/* Day label */}
                <span className={`text-xs mt-3.5 font-bold ${
                  isSelected ? "text-crimson" : isToday ? "text-crimson" : "text-white/60"
                }`}>
                  {item.month.substring(0, 3)} {item.day}
                </span>
                
                {/* Cost label */}
                <span className="text-[10px] text-white/40 mt-0.5 font-mono">
                  {item.price}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Item Card details */}
      <motion.div 
        key={selectedItem}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6 p-5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-3xl">
            {TIMELINE_DATA[selectedItem].logo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">{TIMELINE_DATA[selectedItem].name}</h4>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                TIMELINE_DATA[selectedItem].status === "Renewal Today"
                  ? "bg-red-500/20 text-crimson border-red-500/30 animate-pulse"
                  : TIMELINE_DATA[selectedItem].status === "Upcoming"
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  : "bg-white/5 text-white/50 border-white/10"
              }`}>
                {TIMELINE_DATA[selectedItem].status}
              </span>
            </div>
            <p className="text-xs text-white/40 mt-1">
              Billing cycle: 21st of every month. Automatic renewal via Linked Card (**** 4892).
            </p>
          </div>
        </div>

        <div className="text-right flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
          <span className="text-xs text-white/40">Amount Due</span>
          <span className="text-2xl font-black text-white ml-2 sm:ml-0">
            {TIMELINE_DATA[selectedItem].price}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
