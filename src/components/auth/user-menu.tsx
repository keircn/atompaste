'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '~/lib/auth-context';
import { Button } from '~/components/ui/button';
import { Settings, User } from 'lucide-react';
import { slideInRightVariants, buttonVariants } from '~/lib/animations';

export function UserMenu() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <motion.div 
      className="flex items-center gap-4"
      initial="initial"
      animate="animate"
      variants={slideInRightVariants}
    >
      <motion.div 
        className="flex items-center gap-2 text-sm"
        variants={slideInRightVariants}
      >
        <User className="h-4 w-4" />
        <span className="text-muted-foreground">@{user.username}</span>
      </motion.div>
      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
      >
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
      </motion.div>
    </motion.div>
  );
}
