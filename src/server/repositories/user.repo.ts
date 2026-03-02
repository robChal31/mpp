import { prisma } from "../db/prisma"

export const userRepo = {
  findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  }
}
