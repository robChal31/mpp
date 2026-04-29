import { userRepo } from "../repositories/user.repo"
import { hashPassword, verifyPassword } from "../auth/password"

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
    name: user.name
  }
}

export async function changePasswordService(
  userId: number,
  currentPassword: string,
  newPassword: string
) {
  // 1. Cari user berdasarkan ID
  const user = await userRepo.findUserById(userId)
  
  if (!user) {
    throw new Error('User not found')
  }
  
  // 2. Verifikasi current password
  const isValid = await verifyPassword(currentPassword, user.password)
  
  if (!isValid) {
    throw new Error('Current password is incorrect')
  }
  
  // 3. Hash new password
  const hashedNewPassword = await hashPassword(newPassword)
  
  // 4. Update password
  await userRepo.updatePassword(userId, hashedNewPassword)
  
  return { success: true }
}

