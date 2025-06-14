'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { 
  Save, 
  Copy, 
  Share, 
  FileText, 
  Eye, 
  EyeOff, 
  Code,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';
import { PROGRAMMING_LANGUAGES, detectLanguage } from '~/lib/languages';
import { useAuth } from '~/lib/auth-context';
import { cardVariants } from '~/lib/animations';

interface Paste {
  id?: string;
  title?: string;
  content: string;
  language?: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    username: string;
    displayName?: string;
  };
}

interface PasteEditorProps {
  paste?: Paste;
  onSave?: (paste: Paste) => void;
  onCancel?: () => void;
}

export function PasteEditor({ paste, onSave, onCancel }: PasteEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    title: paste?.title || '',
    content: paste?.content || '',
    language: paste?.language || 'auto',
    isPublic: paste?.isPublic ?? true,
  });

  useEffect(() => {
    if (formData.content && (formData.language === 'auto' || !formData.language)) {
      const detected = detectLanguage(formData.content);
      if (detected && detected !== 'plaintext') {
        setFormData(prev => ({ ...prev, language: detected }));
      }
    }
  }, [formData.content, formData.language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.content.trim()) {
        setError('Content cannot be empty');
        return;
      }

      const url = paste?.id ? `/api/pastes/${paste.id}` : '/api/pastes';
      const method = paste?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim() || null,
          content: formData.content,
          language: formData.language === 'auto' ? null : formData.language || null,
          isPublic: formData.isPublic,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save paste');
      }

      setSuccess(paste?.id ? 'Paste updated successfully!' : 'Paste created successfully!');
      
      if (onSave) {
        onSave(data.paste);
      } else {
        setTimeout(() => {
          router.push(`/paste/${data.paste.id}`);
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save paste');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleShare = async () => {
    if (paste?.id) {
      const url = `${window.location.origin}/paste/${paste.id}`;
      try {
        await navigator.clipboard.writeText(url);
        setSuccess('Share link copied to clipboard!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to copy share link');
      }
    }
  };

  const getCharacterCount = () => {
    return formData.content.length;
  };

  const getLineCount = () => {
    return formData.content.split('\n').length;
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={cardVariants}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            {paste?.id ? 'Edit Paste' : 'Create New Paste'}
          </CardTitle>
          <CardDescription>
            {paste?.id 
              ? 'Make changes to your paste'
              : 'Share your code with the world'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Language Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a title for your paste..."
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAMMING_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content *</Label>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{getLineCount()} lines</span>
                  <span>{getCharacterCount().toLocaleString()} characters</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-auto p-1"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Paste your code here..."
                className="font-mono min-h-[400px] resize-y"
                required
              />
              <p className="text-xs text-muted-foreground">
                Maximum size: 1MB
              </p>
            </div>

            {/* Visibility Settings */}
            {user && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {formData.isPublic ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-orange-600" />
                      )}
                      <Label className="font-medium">
                        {formData.isPublic ? 'Public Paste' : 'Private Paste'}
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formData.isPublic 
                        ? 'Anyone with the link can view this paste'
                        : 'Only you can view this paste'
                      }
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                  />
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md border border-green-200 dark:border-green-800">
                <Check className="h-4 w-4" />
                {success}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={loading || !formData.content.trim()}
                className="flex-1 sm:flex-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {paste?.id ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {paste?.id ? 'Update Paste' : 'Create Paste'}
                  </>
                )}
              </Button>

              {paste?.id && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1 sm:flex-none"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}

              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
