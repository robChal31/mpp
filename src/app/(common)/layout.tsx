// app/(main)/layout.tsx
'use server'

import React from "react"
import { Navbar } from '@/components/navbar'
import Footer from "@/components/footer"
import BackgroundOrnament from "@/components/background-ornament"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FCF6E4]">
      
      <BackgroundOrnament />
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