'use client';

import { motion } from 'framer-motion';
import { Header } from '~/components/Header';
import { PasteEditor } from '~/components/paste/PasteEditor';
import { pageVariants } from '~/lib/animations';

export default function CreatePastePage() {
  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Header 
        title="Create Paste"
        subtitle="Share your code with the world"
      />
      <main className="container mx-auto px-4 py-8">
        <PasteEditor />
      </main>
    </motion.div>
  );
}
