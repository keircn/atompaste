import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
}

export interface UpdateUserSettingsData {
  displayName?: string;
  bio?: string;
  theme?: string;
  defaultPastePublic?: boolean;
  emailNotifications?: boolean;
  showEmail?: boolean;
  allowPublicProfile?: boolean;
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

  async updateSettings(userId: string, settings: UpdateUserSettingsData) {
    return await prisma.user.update({
      where: { id: userId },
      data: settings,
    });
  },

  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    return await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },
};
