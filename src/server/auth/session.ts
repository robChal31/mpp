import { cookies } from "next/headers"

const SESSION_KEY = "mpp_session"

export function setSession(user: any) {
  cookies().then((cookiesObj) => {
    cookiesObj.set({
      name: SESSION_KEY,
      value: JSON.stringify(user),
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    })
  })
}

export async function getSession() {
  const cookiesObj = await cookies()
  const data = cookiesObj.get(SESSION_KEY)?.value
  if (!data) return null
  return JSON.parse(data)
}

export async function clearSession() {
  const cookiesObj = await cookies();
  cookiesObj.delete(SESSION_KEY);
}