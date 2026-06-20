import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
      </body>
    </html>
  );
}


