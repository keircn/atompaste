'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '~/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { 
  cardVariants, 
  buttonVariants, 
  inputVariants, 
  notificationVariants, 
  itemVariants, 
  containerVariants 
} from '~/lib/animations';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
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
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
