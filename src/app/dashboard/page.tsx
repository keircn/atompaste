'use client';

import { motion } from 'framer-motion';
import { Header } from '~/components/Header';
import { PasteList } from '~/components/paste/PasteList';
import { useAuth } from '~/lib/auth-context';
import { pageVariants, spinnerVariants } from '~/lib/animations';

export default function DashboardPage() {
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
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div 
        className="min-h-screen bg-background"
        initial="initial"
        animate="animate"
        variants={pageVariants}
      >
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your dashboard and manage your pastes.
            </p>
          </div>
        </main>
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
      <Header 
        title="Dashboard"
        subtitle={`Welcome back, ${user.displayName || user.username}!`}
      />
      <main className="container mx-auto px-4 py-8">
        <PasteList
          showUserFilter={true}
          userId={user.id}
          title="Your Pastes"
          subtitle="Manage your code snippets and share with the world"
        />
      </main>
    </motion.div>
  );
}
