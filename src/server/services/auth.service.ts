import { userRepo } from "../repositories/user.repo"
import { verifyPassword } from "../auth/password"

export async function loginService(
  email: string,
  password: string
) {
  const user = await userRepo.findUserByEmail(email)

  if (!user) return null

  const valid = await verifyPassword(password, user.password)

  if (!valid) return null

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  }
}

