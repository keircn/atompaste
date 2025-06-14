'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { 
  Search,
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Calendar,
  User,
  Code,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { PROGRAMMING_LANGUAGES, getLanguageDisplayName } from '~/lib/languages';
import { useAuth } from '~/lib/auth-context';
import { cardVariants, itemVariants, containerVariants } from '~/lib/animations';

interface Paste {
  id: string;
  title?: string;
  content: string;
  language?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    displayName?: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PasteListProps {
  showUserFilter?: boolean;
  userId?: string;
  visibility?: 'public' | 'private' | 'all';
  title?: string;
  subtitle?: string;
}

export function PasteList({ 
  showUserFilter = false, 
  userId, 
  visibility = 'all',
  title = 'Pastes',
  subtitle = 'Manage your code snippets'
}: PasteListProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const [filters, setFilters] = useState({
    search: '',
    language: 'all',
    visibility: visibility,
    page: 1,
  });

  const fetchPastes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.language && filters.language !== 'all' && { language: filters.language }),
        ...(filters.visibility !== 'all' && { visibility: filters.visibility }),
        ...(userId && { userId }),
      });

      const response = await fetch(`/api/pastes?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPastes(data.pastes);
        setPagination(data.pagination);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch pastes');
      }
    } catch (err) {
      setError('Failed to fetch pastes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastes();
  }, [filters, userId]);

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleLanguageFilter = (language: string) => {
    setFilters(prev => ({ ...prev, language, page: 1 }));
  };

  const handleVisibilityFilter = (visibility: string) => {
    setFilters(prev => ({ ...prev, visibility: visibility as any, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDelete = async (pasteId: string) => {
    try {
      const response = await fetch(`/api/pastes/${pasteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPastes(prev => prev.filter(p => p.id !== pasteId));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete paste');
      }
    } catch (err) {
      setError('Failed to delete paste');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPreview = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const isOwner = (paste: Paste) => {
    return user && paste.user?.id === user.id;
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={cardVariants}
      className="w-full max-w-6xl mx-auto p-4"
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {title}
              </CardTitle>
              <CardDescription>{subtitle}</CardDescription>
            </div>
            {user && (
              <Button onClick={() => router.push('/create')}>
                <Plus className="h-4 w-4 mr-2" />
                New Paste
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pastes..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filters.language} onValueChange={handleLanguageFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All languages</SelectItem>
                {PROGRAMMING_LANGUAGES.filter(l => l.value).map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showUserFilter && user && (
              <Select value={filters.visibility} onValueChange={handleVisibilityFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 mb-4">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              {/* Paste List */}
              <motion.div
                initial="initial"
                animate="animate"
                variants={containerVariants}
                className="space-y-4"
              >
                <AnimatePresence>
                  {pastes.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No pastes found</p>
                      <p className="text-sm">
                        {filters.search || filters.language 
                          ? 'Try adjusting your filters'
                          : 'Create your first paste to get started'
                        }
                      </p>
                    </motion.div>
                  ) : (
                    pastes.map((paste) => (
                      <motion.div
                        key={paste.id}
                        variants={itemVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 
                                className="font-medium truncate cursor-pointer hover:text-primary"
                                onClick={() => router.push(`/paste/${paste.id}`)}
                              >
                                {paste.title || 'Untitled Paste'}
                              </h3>
                              
                              <div className="flex items-center gap-2 text-xs">
                                {paste.isPublic ? (
                                  <span className="flex items-center gap-1 text-green-600">
                                    <Eye className="h-3 w-3" />
                                    Public
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-orange-600">
                                    <EyeOff className="h-3 w-3" />
                                    Private
                                  </span>
                                )}
                                
                                {paste.language && (
                                  <span className="flex items-center gap-1 text-muted-foreground">
                                    <Code className="h-3 w-3" />
                                    {getLanguageDisplayName(paste.language)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-2 font-mono">
                              {getPreview(paste.content)}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
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
                              <span>{paste.content.split('\n').length} lines</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/paste/${paste.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {isOwner(paste) && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/paste/${paste.id}/edit`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(paste.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} pastes
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <span className="text-sm px-3 py-1">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
