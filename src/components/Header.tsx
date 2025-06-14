'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '~/lib/auth-context';
import { UserMenu } from '~/components/auth/user-menu';
import { Button } from '~/components/ui/button';
import { headerVariants, buttonVariants, textRevealVariants } from '~/lib/animations';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = "atompaste", subtitle = "Free and open-source pastebin for developers" }: HeaderProps) {
  const { user } = useAuth();

  return (
    <motion.header 
      className="border-b border-border bg-card"
      initial="initial"
      animate="animate"
      variants={headerVariants}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial="initial"
            animate="animate"
            variants={textRevealVariants}
          >
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </Link>
          </motion.div>
            <motion.div
              initial="initial"
              animate="animate"
              variants={textRevealVariants}
            >
              {user ? (
                <UserMenu />
              ) : (
                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button asChild variant="outline">
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button asChild>
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </motion.div>
                </div>
              )}
            </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
