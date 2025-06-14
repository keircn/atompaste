import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '~/lib/prisma';
import { auth } from '~/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const language = searchParams.get('language');
        const search = searchParams.get('search');
        const userId = searchParams.get('userId');
        const visibility = searchParams.get('visibility');

        const currentUser = await auth.getCurrentUser(request);
        const skip = (page - 1) * limit;

        const where: any = {};

        if (language && language !== 'all') {
            where.language = language;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (userId) {
            where.userId = userId;
        }

        if (currentUser) {
            if (visibility === 'private') {
                where.userId = currentUser.userId;
                where.isPublic = false;
            } else if (visibility === 'public') {
                where.isPublic = true;
            } else if (visibility === 'all') {
                where.OR = [
                    { isPublic: true },
                    { userId: currentUser.userId },
                ];
            } else {
                where.OR = [
                    { isPublic: true },
                    { userId: currentUser.userId },
                ];
            }
        } else {
            where.isPublic = true;
        }

        const [pastes, total] = await Promise.all([
            prisma.paste.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
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
            }),
            prisma.paste.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            pastes,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        console.error('Error fetching pastes:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const currentUser = await auth.getCurrentUser(request);
        const body = await request.json();
        const { title, content, language, isPublic } = body;

        if (!content || content.trim().length === 0) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        if (content.length > 1000000) {
            return NextResponse.json({ error: 'Content is too large (max 1MB)' }, { status: 400 });
        }

        const pasteData: any = {
            content: content.trim(),
            language: language || null,
            isPublic: currentUser ? (isPublic ?? true) : true,
        };

        if (title && title.trim().length > 0) {
            if (title.length > 200) {
                return NextResponse.json({ error: 'Title is too long (max 200 characters)' }, { status: 400 });
            }
            pasteData.title = title.trim();
        }

        if (currentUser) {
            pasteData.userId = currentUser.userId;
        }

        const paste = await prisma.paste.create({
            data: pasteData,
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

        return NextResponse.json({ paste }, { status: 201 });
    } catch (error) {
        console.error('Error creating paste:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
