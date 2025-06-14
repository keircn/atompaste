import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  userId: string;
  email: string;
}

export const auth = {
  signToken: (payload: JWTPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  },

  verifyToken: (token: string): JWTPayload | null => {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
      return null;
    }
  },

  async getCurrentUser(request?: NextRequest): Promise<JWTPayload | null> {
    try {
      if (request) {
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const apiKey = authHeader.substring(7);
          
          if (apiKey.startsWith('atp_')) {
            const user = await this.authenticateApiKey(apiKey);
            if (user) {
              return user;
            }
          }
        }
      }

      const cookieStore = await cookies();
      const token = cookieStore.get('auth-token')?.value;
      
      if (!token) return null;
      
      return this.verifyToken(token);
    } catch {
      return null;
    }
  },

  async authenticateApiKey(apiKey: string): Promise<JWTPayload | null> {
    try {
      const apiKeys = await prisma.apiKey.findMany({
        where: {
          isActive: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            }
          }
        }
      });

      for (const keyRecord of apiKeys) {
        const isValid = await bcrypt.compare(apiKey, keyRecord.keyHash);
        if (isValid) {
          await prisma.apiKey.update({
            where: { id: keyRecord.id },
            data: { lastUsedAt: new Date() }
          });

          return {
            userId: keyRecord.user.id,
            email: keyRecord.user.email,
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error authenticating API key:', error);
      return null;
    }
  }
};
