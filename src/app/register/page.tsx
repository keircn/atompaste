'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { RegisterForm } from '~/components/auth/RegisterForm';
import { pageVariants, cardVariants, textRevealVariants, buttonVariants } from '~/lib/animations';

export default function RegisterPage() {
  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <motion.div 
        className="w-full max-w-md space-y-8"
        initial="initial"
        animate="animate"
        variants={cardVariants}
      >
        <motion.div 
          className="text-center"
          initial="initial"
          animate="animate"
          variants={textRevealVariants}
        >
          <h1 className="text-3xl font-bold text-foreground">atompaste</h1>
          <p className="mt-2 text-muted-foreground">
            Free and open-source pastebin for developers
          </p>
        </motion.div>
        
        <RegisterForm />
        
        <motion.div 
          className="text-center"
          initial="initial"
          animate="animate"
          variants={textRevealVariants}
        >
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <motion.span
              whileHover="hover"
              variants={buttonVariants}
            >
              <Link 
                href="/login" 
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </motion.span>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
