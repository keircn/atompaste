import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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

  async getCurrentUser(): Promise<JWTPayload | null> {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('auth-token')?.value;
      
      if (!token) return null;
      
      return this.verifyToken(token);
    } catch {
      return null;
    }
  }
};
