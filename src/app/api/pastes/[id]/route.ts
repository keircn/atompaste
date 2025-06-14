import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { auth } from '~/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: pasteId } = await params;
        const currentUser = await auth.getCurrentUser(request);

        const paste = await prisma.paste.findUnique({
            where: { id: pasteId },
            select: {
                id: true,
                title: true,
                content: true,
                language: true,
                isPublic: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                    },
                },
            },
        });

        if (!paste) {
            return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
        }

        if (!paste.isPublic && (!currentUser || paste.userId !== currentUser.userId)) {
            return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
        }

        return NextResponse.json({ paste });
    } catch (error) {
        console.error('Error fetching paste:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await auth.getCurrentUser(request);
        
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: pasteId } = await params;
        const body = await request.json();
        const { title, content, language, isPublic } = body;

        if (!content || content.trim().length === 0) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        if (content.length > 1000000) {
            return NextResponse.json({ error: 'Content is too large (max 1MB)' }, { status: 400 });
        }

        const existingPaste = await prisma.paste.findFirst({
            where: {
                id: pasteId,
                userId: currentUser.userId,
            },
        });

        if (!existingPaste) {
            return NextResponse.json({ error: 'Paste not found or unauthorized' }, { status: 404 });
        }

        const updateData: any = {
            content: content.trim(),
            language: language || null,
            isPublic: isPublic ?? true,
        };

        if (title !== undefined) {
            if (title && title.trim().length > 0) {
                if (title.length > 200) {
                    return NextResponse.json({ error: 'Title is too long (max 200 characters)' }, { status: 400 });
                }
                updateData.title = title.trim();
            } else {
                updateData.title = null;
            }
        }

        const paste = await prisma.paste.update({
            where: { id: pasteId },
            data: updateData,
            select: {
                id: true,
                title: true,
                content: true,
                language: true,
                isPublic: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                    },
                },
            },
        });

        return NextResponse.json({ paste });
    } catch (error) {
        console.error('Error updating paste:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await auth.getCurrentUser(request);
        
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: pasteId } = await params;

        const paste = await prisma.paste.findFirst({
            where: {
                id: pasteId,
                userId: currentUser.userId,
            },
        });

        if (!paste) {
            return NextResponse.json({ error: 'Paste not found or unauthorized' }, { status: 404 });
        }

        await prisma.paste.delete({
            where: { id: pasteId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting paste:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
