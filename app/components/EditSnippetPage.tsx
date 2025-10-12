import { useEffect, useState } from "react";
import { toast } from 'sonner';
import { ConfirmationModal } from './ConfirmationModal';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

type Page = 'overview' | 'snippets' | 'contributors' | 'languages' | 'snippet-detail' | 'add-snippet' | 'edit-snippet';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface EditSnippetPageProps {
  snippetId: string;
  handleNavigate: (page: Page, snippetId?: string) => void;
  user: User | null;
}

const languages = [
  'JavaScript', 'Python', 'C++', 'Java', 'CSS', 'HTML', 'TypeScript', 
  'PHP', 'SQL', 'Go', 'Rust', 'C#', 'Ruby', 'Swift', 'Kotlin'
];

// Mock snippet data (in real app, this would be fetched from API)
const mockSnippet = {
  id: '1',
  title: 'Binary Search Implementation',
  language: 'C++',
  description: 'An efficient binary search algorithm implementation with both recursive and iterative approaches. This is perfect for searching in sorted arrays with O(log n) time complexity.',
  code: `#include <iostream>
#include <vector>
using namespace std;

// Recursive Binary Search
int binarySearchRecursive(vector<int>& arr, int target, int left, int right) {
    if (left > right) {
        return -1; // Element not found
    }
    
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target) {
        return mid;
    } else if (arr[mid] > target) {
        return binarySearchRecursive(arr, target, left, mid - 1);
    } else {
        return binarySearchRecursive(arr, target, mid + 1, right);
    }
}`,
  tags: ['algorithm', 'search', 'recursion', 'data-structures'],
  author: 'अनिल कुमार',
  authorId: '1'
};

export function EditSnippetPage({ snippetId, handleNavigate, user }: EditSnippetPageProps) {
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

  // Load snippet data
  useEffect(() => {
    // Simulate API call to load snippet
    setTimeout(() => {
      setForm({
        title: mockSnippet.title,
        language: mockSnippet.language,
        description: mockSnippet.description,
        code: mockSnippet.code,
        tags: mockSnippet.tags.join(', ')
      });
      setIsLoading(false);
    }, 500);
  }, [snippetId]);

  // Check if user can edit this snippet
  const canEdit = user && user.id === mockSnippet.authorId;

  if (!user) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto text-center">
          <span className="text-4xl mb-4 block">🔒</span>
          <h1 className="text-xl sm:text-2xl font-mono mb-4">Authentication Required</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            You need to be logged in to edit snippets.
          </p>
          <Button onClick={() => handleNavigate('overview')}>
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
          <Button onClick={() => handleNavigate('snippet-detail', snippetId)}>
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

    // Simulate API call
    setTimeout(() => {
      toast.success('Snippet updated successfully!');
      setIsSubmitting(false);
      
      // Navigate back to snippet detail page
      handleNavigate('snippet-detail', snippetId);
    }, 1000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Snippet deleted successfully!');
      setIsDeleting(false);
      setShowDeleteModal(false);
      
      // Navigate back to snippets page
      handleNavigate('snippets');
    }, 1000);
  };

  const handleCancel = () => {
    handleNavigate('snippet-detail', snippetId);
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
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
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



