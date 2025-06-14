import { NextResponse } from 'next/server';
import { auth } from '~/lib/auth';
import { userService } from '~/lib/users';

export async function GET() {
  try {
    const currentUser = await auth.getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ user: null });
    }

    const user = await userService.findById(currentUser.userId);
    
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        theme: user.theme,
        defaultPastePublic: user.defaultPastePublic,
        emailNotifications: user.emailNotifications,
        showEmail: user.showEmail,
        allowPublicProfile: user.allowPublicProfile,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ user: null });
  }
}
