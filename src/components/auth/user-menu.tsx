'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '~/lib/auth-context';
import { Button } from '~/components/ui/button';
import { Settings, User, Plus, LayoutDashboard, Book } from 'lucide-react';
import { slideInRightVariants, buttonVariants } from '~/lib/animations';

export function UserMenu() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <motion.div 
      className="flex items-center gap-2"
      initial="initial"
      animate="animate"
      variants={slideInRightVariants}
    >
      <div className="flex items-center gap-2">
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
            <Link href="/create">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Link>
          </Button>
        </motion.div>

        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
        </motion.div>

        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <Link href="/settings">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </Button>
        </motion.div>
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <Link href="/docs">
              <Book className="h-4 w-4" />
              <span className="hidden sm:inline">Docs</span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
