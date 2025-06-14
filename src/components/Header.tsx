'use client';

import Link from 'next/link';
import { useAuth } from '~/lib/auth-context';
import { UserMenu } from '~/components/auth/user-menu';
import { Button } from '~/components/ui/button';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = "atompaste", subtitle = "Free and open-source pastebin for developers" }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </Link>
        </div>
        
        <div>
          {user ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
