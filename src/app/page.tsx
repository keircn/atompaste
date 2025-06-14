"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "~/lib/auth-context";
import { Header } from "~/components/Header";
import { Button } from "~/components/ui/button";
import {
  Code,
  Globe,
  ArrowRight,
  FileText,
} from "lucide-react";
import {
  pageVariants,
  buttonVariants,
  itemVariants,
  containerVariants,
  spinnerVariants,
} from "~/lib/animations";

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

      <main className="container mx-auto px-4 py-8 justify-center flex flex-col min-h-[calc(100vh-128px)]">
        <motion.div
          initial="initial"
          animate="animate"
          variants={containerVariants}
          className="space-y-16"
        >
          <motion.div
            variants={itemVariants}
            className="text-center space-y-8 py-12"
          >
            <div className="space-y-4">
              <motion.h1
                className="text-4xl md:text-6xl font-bold"
                variants={itemVariants}
              >
                atompaste
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
                variants={itemVariants}
              >
                The modern pastebin for developers
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
              variants={itemVariants}
            >
              {user ? (
                <>
                  <motion.div
                    className="flex-1"
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button asChild size="lg" className="w-full">
                      <Link href="/create">
                        <Code className="h-5 w-5 mr-2" />
                        Create Paste
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    className="flex-1"
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      <Link href="/dashboard">
                        <FileText className="h-5 w-5 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    className="flex-1"
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button asChild size="lg" className="w-full">
                      <Link href="/register">
                        Get Started
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    className="flex-1"
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      <Link href="/explore">
                        <Globe className="h-5 w-5 mr-2" />
                        Explore
                      </Link>
                    </Button>
                  </motion.div>
                </>
              )}
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto pt-8"
              variants={itemVariants}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">25+</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">
                  Free Forever
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">API</div>
                <div className="text-sm text-muted-foreground">Access</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">Ads</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
