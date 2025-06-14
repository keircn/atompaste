'use client';

import Link from 'next/link';
import { useAuth } from '~/lib/auth-context';
import { UserMenu } from '~/components/auth/user-menu';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">atompaste</h1>
            <p className="text-sm text-muted-foreground">
              Free and open-source pastebin for developers
            </p>
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

      <main className="container mx-auto px-4 py-8">
        {user ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Welcome back, @{user.username}!</CardTitle>
              <CardDescription>
                Ready to create some pastes? Your pastebin dashboard will be here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  This is where you'll be able to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Create new code pastes</li>
                  <li>View your paste history</li>
                  <li>Manage your pastes</li>
                  <li>Share code snippets with others</li>
                </ul>
                <Button className="w-full">
                  Create New Paste (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Welcome to atompaste</CardTitle>
              <CardDescription>
                A free and open-source pastebin for developers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Sign up or sign in to start using atompaste:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Create and share code snippets</li>
                  <li>Syntax highlighting for multiple languages</li>
                  <li>Private and public pastes</li>
                  <li>No ads, completely free</li>
                </ul>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href="/register">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
