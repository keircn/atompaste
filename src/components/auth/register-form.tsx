'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useAuth } from '~/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Check, X, Loader2 } from 'lucide-react';

interface UsernameCheckResult {
  available: boolean;
  message: string;
}

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameCheck, setUsernameCheck] = useState<UsernameCheckResult | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const { register } = useAuth();
  const [debouncedUsername] = useDebounce(username, 500);

  useEffect(() => {
    if (debouncedUsername && debouncedUsername.length >= 3) {
      checkUsernameAvailability(debouncedUsername);
    } else {
      setUsernameCheck(null);
    }
  }, [debouncedUsername]);

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    setCheckingUsername(true);
    try {
      const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(usernameToCheck)}`);
      const data = await response.json();
      setUsernameCheck(data);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameCheck({
        available: false,
        message: 'Error checking username availability'
      });
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username) {
      setError('Username is required');
      return;
    }

    if (usernameCheck && !usernameCheck.available) {
      setError('Please choose a different username');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 5) {
      setError('Password must be at least 5 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Sign up for a new account to start using atompaste
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_-]+"
                className="pr-8"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                {checkingUsername && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {!checkingUsername && usernameCheck && (
                  <>
                    {usernameCheck.available ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </>
                )}
              </div>
            </div>
            {usernameCheck && (
              <p className={`text-xs ${usernameCheck.available ? 'text-green-600' : 'text-destructive'}`}>
                {usernameCheck.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={5}
            />
          </div>
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
