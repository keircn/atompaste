'use client';

import Link from 'next/link';
import { useAuth } from '~/lib/auth-context';
import { Button } from '~/components/ui/button';
import { Settings, User } from 'lucide-react';

export function UserMenu() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <User className="h-4 w-4" />
        <span className="text-muted-foreground">@{user.username}</span>
      </div>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Link href="/settings">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </Button>
    </div>
  );
}
