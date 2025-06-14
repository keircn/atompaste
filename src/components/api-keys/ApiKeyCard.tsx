'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2,
  Calendar,
  AlertTriangle,
  Check
} from 'lucide-react';
import { 
  cardVariants,
} from '~/lib/animations';

interface ApiKey {
  id: string;
  title: string;
  keyPreview: string;
  description?: string;
  expiresAt?: string;
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
}

interface ApiKeyCardProps {
  onKeysChange: () => void;
}

export function ApiKeyCard({ onKeysChange }: ApiKeyCardProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newKeyVisible, setNewKeyVisible] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const [newKeyForm, setNewKeyForm] = useState({
    title: '',
    description: '',
    expiresAt: '',
  });

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/user/api-keys');
      const data = await response.json();
      
      if (response.ok) {
        setApiKeys(data.apiKeys || []);
      } else {
        setError(data.error || 'Failed to fetch API keys');
      }
    } catch (err) {
      setError('Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreating(true);

    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newKeyForm),
      });

      const data = await response.json();

      if (response.ok) {
        setApiKeys(prev => [data.apiKey, ...prev]);
        setNewKeyVisible(data.fullKey);
        setSuccess('API key created successfully!');
        setNewKeyForm({ title: '', description: '', expiresAt: '' });
        setShowCreateForm(false);
        onKeysChange();
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error || 'Failed to create API key');
      }
    } catch (err) {
      setError('Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

const handleDeleteKey = async (id: string) => {
    try {
        const response = await fetch(`/api/user/api-keys/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setApiKeys(prev => prev.filter(key => key.id !== id));
            setSuccess('API key deleted successfully!');
            onKeysChange();
            setTimeout(() => setSuccess(''), 3000);
        } else {
            const data = await response.json();
            setError(data.error || 'Failed to delete API key');
        }
    } catch (err) {
        setError('Failed to delete API key');
    }
};

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(keyId);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) <= new Date();
  };

  const isExpiringSoon = (expiresAt?: string) => {
    if (!expiresAt) return false;
    const expiryDate = new Date(expiresAt);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return expiryDate <= sevenDaysFromNow && expiryDate > new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={cardVariants}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
          <CardDescription>
            Manage your API keys for programmatic access to atompaste
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md border border-green-200 dark:border-green-800">
              {success}
            </div>
          )}

          {newKeyVisible && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  Save your API key now!
                </span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                This is the only time you'll see the full key. Copy it to a secure location.
              </p>
              <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded border font-mono text-sm">
                <code className="flex-1 break-all">{newKeyVisible}</code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(newKeyVisible, 'new-key')}
                >
                  {copySuccess === 'new-key' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setNewKeyVisible(null)}
                className="mt-2"
              >
                I've saved it safely
              </Button>
            </motion.div>
          )}

          <div className="flex justify-between items-center">
            <h3 className="font-medium">Active Keys ({apiKeys.length})</h3>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              size="sm"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </div>

          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border rounded-lg p-4 space-y-4"
              >
                <form onSubmit={handleCreateKey} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyTitle">Title *</Label>
                    <Input
                      id="keyTitle"
                      value={newKeyForm.title}
                      onChange={(e) => setNewKeyForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="My API Key"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keyDescription">Description</Label>
                    <Textarea
                      id="keyDescription"
                      value={newKeyForm.description}
                      onChange={(e) => setNewKeyForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What will this key be used for?"
                      maxLength={500}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keyExpiry">Expiration Date (Optional)</Label>
                    <Input
                      id="keyExpiry"
                      type="date"
                      value={newKeyForm.expiresAt}
                      onChange={(e) => setNewKeyForm(prev => ({ ...prev, expiresAt: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={creating} size="sm">
                      {creating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        'Create Key'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {apiKeys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No API keys created yet</p>
                <p className="text-sm">Create your first key to get started</p>
              </div>
            ) : (
              apiKeys.map((apiKey) => (
                <motion.div
                  key={apiKey.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-lg p-4 ${
                    !apiKey.isActive ? 'opacity-60' : ''
                  } ${
                    isExpired(apiKey.expiresAt) ? 'border-red-200 bg-red-50 dark:bg-red-950/50' : 
                    isExpiringSoon(apiKey.expiresAt) ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{apiKey.title}</h4>
                        {!apiKey.isActive && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            Inactive
                          </span>
                        )}
                        {isExpired(apiKey.expiresAt) && (
                          <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded">
                            Expired
                          </span>
                        )}
                        {isExpiringSoon(apiKey.expiresAt) && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded">
                            Expires Soon
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                          {apiKey.keyPreview}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(apiKey.keyPreview, apiKey.id)}
                          className="h-6 w-6 p-0"
                        >
                          {copySuccess === apiKey.id ? 
                            <Check className="h-3 w-3" /> : 
                            <Copy className="h-3 w-3" />
                          }
                        </Button>
                      </div>

                      {apiKey.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {apiKey.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>Created {formatDate(apiKey.createdAt)}</span>
                        {apiKey.expiresAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Expires {formatDate(apiKey.expiresAt)}
                          </span>
                        )}
                        {apiKey.lastUsedAt && (
                          <span>Last used {formatDate(apiKey.lastUsedAt)}</span>
                        )}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteKey(apiKey.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
