// app/(main)/layout.tsx
'use server'

import Footer from "@/components/footer"
import { Navbar } from '@/components/navbar'
import React from "react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* <BackgroundOrnament /> */}
      <Navbar />
      <main className="flex-1 relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  )
}