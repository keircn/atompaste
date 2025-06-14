'use client';

import { useAuth } from '~/lib/auth-context';
import { Button } from '~/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm">
        <User className="h-4 w-4" />
        <span className="text-muted-foreground">@{user.username}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={logout}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
}
