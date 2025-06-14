'use client';

import { motion } from 'framer-motion';
import { Header } from '~/components/Header';
import { PasteList } from '~/components/paste/PasteList';
import { pageVariants } from '~/lib/animations';

export default function PublicPastesPage() {
  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Header 
        title="Public Pastes"
        subtitle="Discover code snippets shared by the community"
      />
      <main className="container mx-auto px-4 py-8">
        <PasteList
          visibility="public"
          title="Public Pastes"
          subtitle="Browse public code snippets from the community"
        />
      </main>
    </motion.div>
  );
}
