import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '~/lib/prisma';
import { auth } from '~/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await auth.getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: currentUser.userId },
      select: {
        id: true,
        title: true,
        keyPreview: true,
        description: true,
        expiresAt: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await auth.getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, expiresAt } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const apiKey = `atp_${crypto.randomBytes(32).toString('hex')}`;
    const keyHash = await hash(apiKey, 12);
    const keyPreview = apiKey.substring(0, 12) + '...';

    let parsedExpiresAt = null;
    if (expiresAt) {
      parsedExpiresAt = new Date(expiresAt);
      if (parsedExpiresAt <= new Date()) {
        return NextResponse.json({ error: 'Expiration date must be in the future' }, { status: 400 });
      }
    }

    const newApiKey = await prisma.apiKey.create({
      data: {
        title: title.trim(),
        keyHash,
        keyPreview,
        description: description?.trim() || null,
        expiresAt: parsedExpiresAt,
        userId: currentUser.userId,
      },
      select: {
        id: true,
        title: true,
        keyPreview: true,
        description: true,
        expiresAt: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ 
      apiKey: newApiKey,
      fullKey: apiKey
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
