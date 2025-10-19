'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { axiosClient } from '../api-client';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

type Page =
  | 'overview'
  | 'snippets'
  | 'contributors'
  | 'languages'
  | 'snippet-detail'
  | 'add-snippet'
  | 'edit-snippet';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AddSnippetPageProps {
  handleNavigate: (page: Page, snippetId?: string) => void;
  user: User | null;
}

const languages = [
  'JavaScript',
  'Python',
  'C++',
  'Java',
  'CSS',
  'HTML',
  'TypeScript',
  'PHP',
  'SQL',
  'Go',
  'Rust',
  'C#',
  'Ruby',
  'Swift',
  'Kotlin',
];

interface LanguageChoice {
  key: string;
  value: string;
}

interface AddSnippetPagePropsInternal {
  languageChoices: { languages: LanguageChoice[] };
}

export function AddSnippetPage({ languageChoices }: AddSnippetPagePropsInternal) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [langFilter, setLangFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    language: '',
    description: '',
    highlightedCode: ``,
    tags: '',
    style: languageChoices.style_choices[0].key || 'abap',
  });

  // Redirect to login if not authenticated
  if (status !== 'authenticated') {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto text-center">
          <span className="text-4xl mb-4 block">🔒</span>
          <h1 className="text-xl sm:text-2xl font-mono mb-4">Authentication Required</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            You need to be logged in to create snippets.
          </p>
          <Button onClick={() => router.push('')}>← Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.language || !form.highlightedCode.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const snippetData = {
        title: form.title.trim(),
        language: form.language.toLowerCase(),
        description: form.description.trim(),
        code: form.highlightedCode.trim(),
        tags: form.tags,
        style: form.style,
      };

      const response = await axiosClient.post(
        '/snippets/',
        snippetData,
        // session token property name may vary depending on NextAuth setup.
        // Cast session to any when reading token to avoid TS errors in this component.
        {
          headers: {
            Authorization:
              'Bearer ' + ((session as any)?.accessToken || (session as any)?.access_token || ''),
          },
        },
      );

      if (response.data?.id) {
        toast.success('Snippet created successfully!');
        router.push(`/snippet-detail/${response.data.id}`);
      } else {
        throw new Error('No snippet ID returned from server');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to create snippet';
      toast.error(errorMessage);
      console.error('Snippet creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('');
  };

  const parsedTags = form.tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="mr-4">
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
                    onChange={e => handleInputChange('title', e.target.value)}
                    required
                    className="text-sm"
                  />
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm">
                    Programming Language <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.language}
                    onValueChange={value => handleInputChange('language', value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    {/* Add a small search box and make the dropdown scrollable */}
                    <SelectContent className="max-h-60 w-[min(28rem,100%)]">
                      <div className="px-2 pb-1">
                        <input
                          type="text"
                          aria-label="Filter languages"
                          placeholder="Search languages..."
                          value={langFilter}
                          onChange={e => setLangFilter(e.target.value)}
                          onPointerDown={e => e.stopPropagation()}
                          onMouseDown={e => e.stopPropagation()}
                          className="w-full rounded border px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                      <div className="px-1">
                        {languageChoices.languages
                          .filter(
                            (lang: any) =>
                              lang.value.toLowerCase().includes(langFilter.toLowerCase()) ||
                              lang.key.toLowerCase().includes(langFilter.toLowerCase()),
                          )
                          .map((lang: any) => (
                            <SelectItem key={lang.key} value={lang.key}>
                              {lang.value}
                            </SelectItem>
                          ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm">
                    Tags (optional)
                  </Label>
                  <Input
                    id="tags"
                    placeholder="e.g., algorithm, search, recursion (comma-separated)"
                    value={form.tags}
                    onChange={e => handleInputChange('tags', e.target.value)}
                    className="text-sm"
                  />
                  {parsedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {parsedTags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">
                    Description/Explanation
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Explain what your code does, how to use it, and any important notes..."
                    className="min-h-[120px] text-sm"
                    value={form.description}
                    onChange={e => handleInputChange('description', e.target.value)}
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
                    value={form.highlightedCode}
                    onChange={e => handleInputChange('highlightedCode', e.target.value)}
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 text-sm"
                  >
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
                  Be specific and descriptive. Good: "Binary Search Algorithm". Avoid: "My Code".
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <span className="mr-1">🏷️</span>
                  Using Tags
                </h4>
                <p className="text-xs text-muted-foreground">
                  Add relevant tags like "algorithm", "api", "frontend" to help others find your
                  snippet.
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
                  Publishing as: <strong className="truncate">{session?.user?.name}</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
