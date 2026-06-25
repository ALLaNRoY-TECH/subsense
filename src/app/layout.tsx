import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SubSense - AI-Powered Subscription Intelligence",
  description: "Stop paying for what you don't use. SubSense automatically discovers, tracks, and optimizes your subscriptions with Gmail receipt scanning and bank transaction intelligence.",
  keywords: ["subscriptions", "tracker", "finance", "AI scanner", "save money", "SubSense", "fintech"],
  authors: [{ name: "SubSense Team" }],
  openGraph: {
    title: "SubSense - AI-Powered Subscription Intelligence",
    description: "Connect your Gmail or upload a bank statement. SubSense instantly discovers recurring payments, flags duplicate services, and securely uncovers wasted spending.",
    url: "https://subsense.ai",
    siteName: "SubSense",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SubSense - Stop Paying For What You Don't Use",
    description: "AI-Powered Subscription Intelligence platform.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-[#EF233C] selection:text-white">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}


