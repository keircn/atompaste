'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '~/components/Header';
import { PasteViewer } from '~/components/paste/PasteViewer';
import { PasteEditor } from '~/components/paste/PasteEditor';
import { pageVariants, spinnerVariants } from '~/lib/animations';

interface Paste {
  id: string;
  title?: string;
  content: string;
  language?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  user?: {
    id: string;
    username: string;
    displayName?: string;
  };
}

export default function PastePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [paste, setPaste] = useState<Paste | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [pasteId, setPasteId] = useState<string>('');

  useEffect(() => {
    const initializeComponent = async () => {
      const { id } = await params;
      setPasteId(id);
    };
    initializeComponent();
  }, [params]);

  useEffect(() => {
    if (pasteId) {
      fetchPaste();
    }
  }, [pasteId]);

  const fetchPaste = async () => {
    if (!pasteId) return;
    
    try {
      const response = await fetch(`/api/pastes/${pasteId}`);
      const data = await response.json();

      if (response.ok) {
        setPaste(data.paste);
      } else {
        setError(data.error || 'Paste not found');
      }
    } catch (err) {
      setError('Failed to load paste');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = (updatedPaste: any) => {
    setPaste(updatedPaste);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleDelete = () => {
    router.push('/dashboard');
  };

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
          <p className="mt-4 text-muted-foreground">Loading paste...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
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
            <h1 className="text-2xl font-bold mb-4">Paste Not Found</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button 
              onClick={() => router.push('/')}
              className="text-primary hover:underline"
            >
              Go back home
            </button>
          </div>
        </main>
      </motion.div>
    );
  }

  if (!paste) {
    return null;
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Header 
        title={paste.title || 'Untitled Paste'}
        subtitle={paste.user ? `by ${paste.user.displayName || paste.user.username}` : 'Anonymous paste'}
      />
      <main className="container mx-auto px-4 py-8">
        {editing ? (
          <PasteEditor
            paste={paste}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <PasteViewer
            paste={paste}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </motion.div>
  );
}
