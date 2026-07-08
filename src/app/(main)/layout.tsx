// app/(main)/layout.tsx
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
    <div className="min-h-screen relative overflow-hidden bg-[#ffffff]">
      
      {/* <BackgroundOrnament /> */}
      <Navbar />
      <main className="flex-1 relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  )
}