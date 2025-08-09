import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

type Page = 'overview' | 'snippets' | 'contributors' | 'languages' | 'snippet-detail' | 'add-snippet' | 'edit-snippet';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AddSnippetPageProps {
  onNavigate: (page: Page, snippetId?: string) => void;
  user: User | null;
}

const languages = [
  'JavaScript', 'Python', 'C++', 'Java', 'CSS', 'HTML', 'TypeScript', 
  'PHP', 'SQL', 'Go', 'Rust', 'C#', 'Ruby', 'Swift', 'Kotlin'
];

export function AddSnippetPage({ onNavigate, user }: AddSnippetPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    language: '',
    description: '',
    code: '',
    tags: ''
  });

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto text-center">
          <span className="text-4xl mb-4 block">🔒</span>
          <h1 className="text-xl sm:text-2xl font-mono mb-4">Authentication Required</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            You need to be logged in to create snippets.
          </p>
          <Button onClick={() => onNavigate('overview')}>
            ← Back to Home
          </Button>
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
      const mockSnippetId = Date.now().toString();
      
      toast.success('Snippet created successfully!');
      setIsSubmitting(false);
      
      // Navigate to the new snippet detail page
      onNavigate('snippet-detail', mockSnippetId);
    }, 1000);
  };

  const handleCancel = () => {
    onNavigate('overview');
  };

  const parsedTags = form.tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

  return (
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
            <span>➕</span>
            Add New Snippet
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Share your code knowledge with the community
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
                Fill in the details for your code snippet
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
                        Creating...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">✅</span>
                        Create Snippet
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

        {/* Preview/Tips */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <span>💡</span>
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <span className="mr-1">📝</span>
                  Writing Great Titles
                </h4>
                <p className="text-xs text-muted-foreground">
                  Be specific and descriptive. Good: "Binary Search Algorithm". 
                  Avoid: "My Code".
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <span className="mr-1">🏷️</span>
                  Using Tags
                </h4>
                <p className="text-xs text-muted-foreground">
                  Add relevant tags like "algorithm", "api", "frontend" to help others find your snippet.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <span className="mr-1">📚</span>
                  Code Quality
                </h4>
                <p className="text-xs text-muted-foreground">
                  Include comments, use proper formatting, and add example usage when possible.
                </p>
              </div>

              <div className="pt-4 border-t text-center">
                <p className="text-xs text-muted-foreground">
                  <span className="mr-1">👤</span>
                  Publishing as: <strong className="truncate">{user.name}</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



