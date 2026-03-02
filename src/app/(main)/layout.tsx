'use client'

import React from "react"

import { Sidebar } from '@/components/sidebar'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from "@/server/auth/session"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const session = getSession()
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="min-h-[calc(100vh-64px)]">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
