import { NextRequest, NextResponse } from 'next/server';
import { auth } from '~/lib/auth';
import { userService } from '~/lib/users';
import { z } from 'zod';

const updateSettingsSchema = z.object({
  displayName: z.string().max(50).optional(),
  bio: z.string().max(500).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  defaultPastePublic: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  showEmail: z.boolean().optional(),
  allowPublicProfile: z.boolean().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await auth.getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const result = updateSettingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.errors },
        { status: 400 }
      );
    }

    const updatedUser = await userService.updateSettings(
      currentUser.userId,
      result.data
    );

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        displayName: updatedUser.displayName,
        bio: updatedUser.bio,
        theme: updatedUser.theme,
        defaultPastePublic: updatedUser.defaultPastePublic,
        emailNotifications: updatedUser.emailNotifications,
        showEmail: updatedUser.showEmail,
        allowPublicProfile: updatedUser.allowPublicProfile,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
