'use server'

import React from "react"
import { Navbar } from '@/components/navbar'
import Footer from "@/components/footer"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      
      {/* Large blurred circles - kayak di Silo */}
      <div className="absolute -top-40 -right-20 w-150 h-150 bg-linear-to-br from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-20 w-125 h-125 bg-linear-to-tr from-blue-400/20 via-cyan-400/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-75 bg-emerald-400/5 rounded-full blur-3xl rotate-12" />
      
      {/* Floating orbs - small circles dengan border */}
      <div className="absolute top-[15%] right-[10%] w-24 h-24 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm" />
      <div className="absolute bottom-[20%] left-[5%] w-32 h-32 rounded-full border border-blue-400/20 bg-blue-400/5 backdrop-blur-sm" />
      <div className="absolute top-[60%] right-[15%] w-16 h-16 rounded-full border border-emerald-400/20 bg-emerald-400/5 backdrop-blur-sm" />
      
      {/* Connected dots / nodes - kayak network visualization */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* Node 1 ke Node 2 */}
        <line x1="15%" y1="20%" x2="85%" y2="30%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="4 4" />
        {/* Node 2 ke Node 3 */}
        <line x1="85%" y1="30%" x2="70%" y2="75%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="4 4" />
        {/* Node 1 ke Node 3 */}
        <line x1="15%" y1="20%" x2="70%" y2="75%" stroke="url(#lineGradient)" strokeWidth="0.5" strokeDasharray="2 6" />
        {/* Node 4 */}
        <line x1="10%" y1="80%" x2="85%" y2="30%" stroke="url(#lineGradient)" strokeWidth="0.5" strokeDasharray="2 6" />
        <circle cx="15%" cy="20%" r="4" fill="#3b82f6" opacity="0.4" />
        <circle cx="85%" cy="30%" r="3" fill="#8b5cf6" opacity="0.3" />
        <circle cx="70%" cy="75%" r="5" fill="#10b981" opacity="0.3" />
        <circle cx="10%" cy="80%" r="3" fill="#f59e0b" opacity="0.3" />
      </svg>
      
      {/* Grid pattern halus */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_0.5px,transparent_0.5px)] dark:bg-[radial-gradient(#1f2937_0.5px,transparent_0.5px)] bg-size-[32px_32px] opacity-40 pointer-events-none" />
      
      {/* Gradient edge */}
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-primary/5 via-primary/3 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-gray-100/50 to-transparent dark:from-gray-950/30 pointer-events-none" />
      
      <Navbar />
      <main className="flex-1 relative z-10">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}