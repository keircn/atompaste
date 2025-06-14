import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
}

export const userService = {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },
  
  async findByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
    });
  },
  
  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },
  
  async create(userData: CreateUserData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    return await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
      },
    });
  },
  
  async verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  },
};
