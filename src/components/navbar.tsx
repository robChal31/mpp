// components/navbar/index.tsx (Server Component)
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { NavbarClient } from './navbar-client'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('mpp_session')?.value
  
  if (!token) return null
  
  try {
    const { payload } = await jwtVerify(token, secret)
    return {
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string
    }
  } catch {
    return null
  }
}

export async function Navbar() {
  const user = await getUserFromToken()
  
  return <NavbarClient user={user} />
}