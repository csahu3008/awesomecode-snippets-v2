'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ConfirmationModal } from './ConfirmationModal';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useSession } from "next-auth/react";
import { axiosClient } from '../api-client';

type Page = 'overview' | 'snippets' | 'contributors' | 'languages' | 'snippet-detail' | 'add-snippet' | 'edit-snippet';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface EditSnippetPageProps {
  snippetId: string;
  detailedArticle?: any;
}

const languages = [
  'JavaScript', 'Python', 'C++', 'Java', 'CSS', 'HTML', 'TypeScript', 
  'PHP', 'SQL', 'Go', 'Rust', 'C#', 'Ruby', 'Swift', 'Kotlin'
];

export function EditSnippetPage({ snippetId, detailedArticle ,languageChoices}: EditSnippetPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    language: '',
    description: '',
    code: '',
    tags: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Load snippet data from detailedArticle prop if provided, otherwise fetch
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        if (detailedArticle) {
          const data = detailedArticle;
          if (!mounted) return;
          setForm({
            title: data.title || data.name || '',
            language: data.language || data.lang || '',
            description: data.description || data.body || '',
            code: data.code || data.highlightedCode || '',
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
          });
          // store author id for permission checks
          setCoderUsername(data?.coder?.username || null);
          setIsLoading(false);
          return;
        }
      } catch (error: any) {
        console.error('Failed to load snippet:', error);
        toast.error(error?.response?.data?.message || error.message || 'Failed to load snippet');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, [snippetId, detailedArticle]);

  const [coderUsername, setCoderUsername] = useState<string | null>(null);

  // derive current user id from session (best-effort)
  const currentUserId = (session as any)?.user?.username || null;

  // Check if user can edit this snippet
  const canEdit = currentUserId && coderUsername && String(currentUserId) === String(coderUsername);

  // Require authentication
  if (status !== 'authenticated') {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto text-center">
          <span className="text-4xl mb-4 block">🔒</span>
          <h1 className="text-xl sm:text-2xl font-mono mb-4">Authentication Required</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            You need to be logged in to edit snippets.
          </p>
          <Button onClick={() => router.push('/')}>
            ← Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto text-center">
          <span className="text-4xl mb-4 block">🚫</span>
          <h1 className="text-xl sm:text-2xl font-mono mb-4">Access Denied</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            You can only edit snippets that you created.
          </p>
          <Button onClick={() => router.push(`/snippet-detail/${snippetId}`)}>
            ← Back to Snippet
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto text-center">
          <span className="text-4xl mb-4 block">⏳</span>
          <h1 className="text-xl sm:text-2xl font-mono mb-4">Loading...</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Loading snippet data...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.language || !form.code.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const snippetData = {
        title: form.title.trim(),
        language: form.language,
        description: form.description.trim(),
        code: form.code.trim(),
        tags: parsedTags,
      };

      const resp = await axiosClient.patch(`snippets/${snippetId}/`, snippetData, {
        headers: { Authorization: 'Bearer ' + ((session as any)?.accessToken || (session as any)?.access_token || '') }
      });

      if (resp.data) {
  toast.success('Snippet updated successfully!');
  router.push(`/snippet-detail/${snippetId}`);
      } else {
        throw new Error('No response from server');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      const msg = error?.response?.data?.message || error.message || 'Failed to update snippet';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const resp = await axiosClient.delete(`snippets/${snippetId}/`, {
        headers: { Authorization: 'Bearer ' + ((session as any)?.accessToken || (session as any)?.access_token || '') }
      });
  toast.success('Snippet deleted successfully!');
  setShowDeleteModal(false);
  router.push('/snippets');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error?.response?.data?.message || error.message || 'Failed to delete snippet');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/snippet-detail/${snippetId}`);
  };

  const parsedTags = form.tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCancel}
            className="mr-4"
          >
            ← Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-mono mb-1 flex items-center gap-2">
              <span>✏️</span>
              Edit Snippet
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Update your code snippet
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <span>📝</span>
                  Snippet Details
                </CardTitle>
                <CardDescription className="text-sm">
                  Update the details for your code snippet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Binary Search Implementation"
                      value={form.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                      className="text-sm"
                    />
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm">
                      Programming Language <span className="text-destructive">*</span>
                    </Label>
                    <Select value={form.language} onValueChange={(value) => handleInputChange('language', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageChoices.languages.map((lang) => (
                          <SelectItem key={lang.key} value={lang.key}>
                            {lang.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm">Tags (optional)</Label>
                    <Input
                      id="tags"
                      placeholder="e.g., algorithm, search, recursion (comma-separated)"
                      value={form.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="text-sm"
                    />
                    {parsedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {parsedTags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm">Description/Explanation</Label>
                    <Textarea
                      id="description"
                      placeholder="Explain what your code does, how to use it, and any important notes..."
                      className="min-h-[120px] text-sm"
                      value={form.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </div>

                  {/* Code */}
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-sm">
                      Code <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="code"
                      placeholder="Paste your code here..."
                      className="min-h-[300px] font-mono text-sm"
                      value={form.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      required
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1 text-sm">
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">⏳</span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">💾</span>
                          Update Snippet
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 text-sm">
                      <span className="mr-2">❌</span>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <span>⚙️</span>
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="destructive"
                  className="w-full text-sm"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <span className="mr-2">🗑️</span>
                  Delete Snippet
                </Button>

                <div className="pt-4 border-t text-center">
                  <p className="text-xs text-muted-foreground">
                    <span className="mr-1">⚠️</span>
                    Deleting a snippet cannot be undone
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Snippet"
        description={`Are you sure you want to delete "${form.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={isDeleting}
      />
    </>
  );
}



