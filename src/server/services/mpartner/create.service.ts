import { userRepo } from "../../repositories/user.repo";

export async function createService(data: { email: string; name: string }) {
  const existingUser = await userRepo.findUserByEmail(data.email);

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const newUser = await userRepo.createUser(data);
  
  return {
    status: 'success',
    message: 'User created successfully',
    data: newUser
  };
}