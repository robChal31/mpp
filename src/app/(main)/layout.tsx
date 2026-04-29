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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 min-h-[calc(100vh-64px)]">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}