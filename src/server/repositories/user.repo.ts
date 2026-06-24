import { hashPassword } from "../auth/password";
import { prisma } from "../db/prisma";
import crypto from 'crypto';

export const userRepo = {
  findUserByEmail(email: string) {
    return prisma.user.findUnique({ 
      where: { email } 
    });
  },

  findUserById(id: number) {
    return prisma.user.findUnique({ 
      where: { id } 
    });
  },

  async createUser(data: { email: string; name: string }) {
    const hashedPassword = await hashPassword("password123");
    
    return prisma.user.create({ 
      data: {
        email: data.email,
        name: data.name,
        role: 'school',
        password: hashedPassword
      }
    });
  },

  async updatePassword(userId: number, hashedPassword: string) {
    return prisma.user.update({
      where: { id: Number(userId) }, // Convert userId to a number
      data: { password: hashedPassword }
    });
  },

  async updateResetPasswordToken(userId: number) {
    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return prisma.user.update({
      where: { id: Number(userId) }, // Convert userId to a number
      data: { resetPasswordToken, resetPasswordExpires, hasResetPasswordToken: true }
    });
  },
};