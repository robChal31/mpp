// components/navbar/index.tsx
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { NavbarClient } from './navbar-client'
import { NavbarPublic } from './navbar-public'
import { Locale } from 'next-intl'
import { getCurrentUser } from '@/lib/auth'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function Navbar() {
  const user = await getCurrentUser()
  
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