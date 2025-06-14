'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '~/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Check, X, Loader2 } from 'lucide-react';
import { 
  cardVariants, 
  buttonVariants, 
  inputVariants, 
  notificationVariants, 
  itemVariants, 
  containerVariants,
  spinnerVariants,
  fadeInVariants
} from '~/lib/animations';

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
    <motion.div
      initial="initial"
      animate="animate" 
      variants={cardVariants}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Sign up for a new account to start using atompaste
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            initial="initial"
            animate="animate"
            variants={containerVariants}
          >
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="email">Email</Label>
              <motion.div
                whileFocus="focus"
                variants={inputVariants}
              >
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </motion.div>
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <motion.div
                  whileFocus="focus"
                  variants={inputVariants}
                >
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
                </motion.div>
                <motion.div 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  initial="initial"
                  animate="animate"
                  variants={fadeInVariants}
                >
                  <AnimatePresence mode="wait">
                    {checkingUsername && (
                      <motion.div
                        key="loading"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={notificationVariants}
                      >
                        <motion.div
                          animate="animate"
                          variants={spinnerVariants}
                        >
                          <Loader2 className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
                      </motion.div>
                    )}
                    {!checkingUsername && usernameCheck && (
                      <motion.div
                        key="result"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={notificationVariants}
                      >
                        {usernameCheck.available ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-destructive" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              <AnimatePresence>
                {usernameCheck && (
                  <motion.p 
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={notificationVariants}
                    className={`text-xs ${usernameCheck.available ? 'text-green-600' : 'text-destructive'}`}
                  >
                    {usernameCheck.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="password">Password</Label>
              <motion.div
                whileFocus="focus"
                variants={inputVariants}
              >
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={5}
                />
              </motion.div>
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <motion.div
                whileFocus="focus"
                variants={inputVariants}
              >
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={5}
                />
              </motion.div>
            </motion.div>
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={notificationVariants}
                  className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
