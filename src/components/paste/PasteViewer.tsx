'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { 
  Copy, 
  Share, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  User,
  Calendar,
  Code,
  Download,
  Check,
  AlertCircle
} from 'lucide-react';
import { getLanguageDisplayName } from '~/lib/languages';
import { useAuth } from '~/lib/auth-context';
import { cardVariants } from '~/lib/animations';

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

interface PasteViewerProps {
  paste: Paste;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PasteViewer({ paste, onEdit, onDelete }: PasteViewerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isOwner = user && paste.userId === user.id;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/paste/${paste.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setSuccess('Share link copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to copy share link');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDownload = () => {
    const extension = getFileExtension(paste.language);
    const filename = paste.title 
      ? `${paste.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${extension}`
      : `paste_${paste.id}${extension}`;
    
    const blob = new Blob([paste.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/pastes/${paste.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete paste');
      }

      if (onDelete) {
        onDelete();
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete paste');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileExtension = (language?: string): string => {
    switch (language) {
      case 'javascript': return '.js';
      case 'typescript': return '.ts';
      case 'python': return '.py';
      case 'java': return '.java';
      case 'cpp': return '.cpp';
      case 'c': return '.c';
      case 'csharp': return '.cs';
      case 'php': return '.php';
      case 'ruby': return '.rb';
      case 'go': return '.go';
      case 'rust': return '.rs';
      case 'swift': return '.swift';
      case 'kotlin': return '.kt';
      case 'scala': return '.scala';
      case 'html': return '.html';
      case 'css': return '.css';
      case 'scss': return '.scss';
      case 'json': return '.json';
      case 'xml': return '.xml';
      case 'yaml': return '.yml';
      case 'markdown': return '.md';
      case 'sql': return '.sql';
      case 'bash': return '.sh';
      case 'powershell': return '.ps1';
      case 'dockerfile': return '.dockerfile';
      default: return '.txt';
    }
  };

  const getLineCount = () => {
    return paste.content.split('\n').length;
  };

  const getCharacterCount = () => {
    return paste.content.length;
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={cardVariants}
      className="w-full max-w-4xl mx-auto"
    >
      <Card>
        {/* Header */}
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                {paste.title || 'Untitled Paste'}
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
                {paste.user && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {paste.user.displayName || paste.user.username}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(paste.createdAt)}
                </span>
                {paste.language && (
                  <span className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    {getLanguageDisplayName(paste.language)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  {paste.isPublic ? (
                    <>
                      <Eye className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">Public</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 text-orange-600" />
                      <span className="text-orange-600">Private</span>
                    </>
                  )}
                </span>
              </CardDescription>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="hidden sm:inline ml-2">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Share</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Download</span>
              </Button>

              {isOwner && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">Edit</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline ml-2">
                      {deleting ? 'Deleting...' : 'Delete'}
                    </span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent>
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b">
            <span>{getLineCount()} lines</span>
            <span>{getCharacterCount().toLocaleString()} characters</span>
            {paste.updatedAt !== paste.createdAt && (
              <span>Updated {formatDate(paste.updatedAt)}</span>
            )}
          </div>

          {/* Code Content */}
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              <code className="font-mono whitespace-pre">
                {paste.content}
              </code>
            </pre>
          </div>

          {/* Messages */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 mt-4">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md border border-green-200 dark:border-green-800 mt-4">
              <Check className="h-4 w-4" />
              {success}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
