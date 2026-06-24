// components/navbar/index.tsx
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { NavbarClient } from './navbar-client'
import { NavbarPublic } from './navbar-public'
import { Locale } from 'next-intl'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('mpp_session')?.value
  
  if (!token) return null
  
  try {
    const { payload } = await jwtVerify(token, secret)
    return {
      id: payload.id as string,
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
  
  async function changeLocalAction(locale: Locale) {
    "use server";
    const store = await cookies();
    store.set("locale", locale);
  }
  
  // Jika user ada, tampilkan NavbarClient (dengan dropdown profile)
  if (user) {
    return <NavbarClient user={user} changeLocalAction={changeLocalAction} />
  }
  
  // Jika tidak ada user, tampilkan NavbarPublic (tanpa profile)
  return <NavbarPublic changeLocalAction={changeLocalAction} />
}