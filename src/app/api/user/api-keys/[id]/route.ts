import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { auth } from '~/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await auth.getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeyId = params.id;
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        userId: currentUser.userId,
      },
    });

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    await prisma.apiKey.delete({
      where: { id: apiKeyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await auth.getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeyId = params.id;
    const body = await request.json();
    const { isActive } = body;

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        userId: currentUser.userId,
      },
    });

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    const updatedApiKey = await prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { isActive },
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

    return NextResponse.json({ apiKey: updatedApiKey });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
