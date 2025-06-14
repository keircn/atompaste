import { NextRequest, NextResponse } from 'next/server';
import { userService } from '~/lib/users';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username parameter is required' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json({
        available: false,
        message: 'Username must be at least 3 characters long'
      });
    }

    if (username.length > 20) {
      return NextResponse.json({
        available: false,
        message: 'Username must be 20 characters or less'
      });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return NextResponse.json({
        available: false,
        message: 'Username can only contain letters, numbers, underscores, and hyphens'
      });
    }

    const existingUser = await userService.findByUsername(username);
    
    if (existingUser) {
      return NextResponse.json({
        available: false,
        message: 'Username is already taken'
      });
    }

    return NextResponse.json({
      available: true,
      message: 'Username is available'
    });
  } catch (error) {
    console.error('Username check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
