'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '~/lib/auth-context';
import { Header } from '~/components/Header';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { pageVariants, cardVariants, buttonVariants, itemVariants, containerVariants, spinnerVariants } from '~/lib/animations';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center"
        initial="initial"
        animate="animate"
        variants={pageVariants}
      >
        <div className="text-center">
          <motion.div 
            className="rounded-full h-8 w-8 border-b-2 border-primary mx-auto" 
            animate="animate"
            variants={spinnerVariants}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Header />

      <main className="container mx-auto px-4 py-8">
        {user ? (
          <motion.div
            initial="initial"
            animate="animate"
            variants={cardVariants}
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Welcome back, @{user.username}!</CardTitle>
                <CardDescription>
                  Ready to create some pastes? Your pastebin dashboard will be here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="space-y-4"
                  initial="initial"
                  animate="animate"
                  variants={containerVariants}
                >
                  <motion.p 
                    className="text-muted-foreground"
                    variants={itemVariants}
                  >
                    This is where you'll be able to:
                  </motion.p>
                  <motion.ul 
                    className="list-disc list-inside space-y-2 text-sm text-muted-foreground"
                    variants={itemVariants}
                  >
                    <li>Create new code pastes</li>
                    <li>View your paste history</li>
                    <li>Manage your pastes</li>
                    <li>Share code snippets with others</li>
                  </motion.ul>
                  <motion.div variants={itemVariants}>
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      <Button className="w-full">
                        Create New Paste (Coming Soon)
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial="initial"
            animate="animate"
            variants={cardVariants}
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Welcome to atompaste</CardTitle>
                <CardDescription>
                  A free and open-source pastebin for developers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="space-y-4"
                  initial="initial"
                  animate="animate"
                  variants={containerVariants}
                >
                  <motion.p 
                    className="text-muted-foreground"
                    variants={itemVariants}
                  >
                    Sign up or sign in to start using atompaste:
                  </motion.p>
                  <motion.ul 
                    className="list-disc list-inside space-y-2 text-sm text-muted-foreground"
                    variants={itemVariants}
                  >
                    <li>Create and share code snippets</li>
                    <li>Syntax highlighting for multiple languages</li>
                    <li>Private and public pastes</li>
                    <li>No ads, completely free</li>
                  </motion.ul>
                  <motion.div 
                    className="flex gap-2"
                    variants={itemVariants}
                  >
                    <motion.div
                      className="flex-1"
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      <Button asChild className="w-full">
                        <Link href="/register">Get Started</Link>
                      </Button>
                    </motion.div>
                    <motion.div
                      className="flex-1"
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                    >
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/login">Sign In</Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
}
