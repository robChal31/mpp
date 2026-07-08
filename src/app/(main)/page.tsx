"use server"
import DashboardPage from '@/components/dashboard/dashboard-page'
import { getCurrentUser } from '@/lib/auth'

export default async function Dashboard() {
  const user = await getCurrentUser()
  return <DashboardPage user={user} />
}