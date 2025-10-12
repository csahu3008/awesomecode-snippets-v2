import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { ConfirmationModal } from './ConfirmationModal';
import { toast } from 'sonner';

type Page = 'overview' | 'snippets' | 'contributors' | 'languages' | 'snippet-detail' | 'add-snippet' | 'edit-snippet';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
  avatar?: string;
}

interface RelatedSnippet {
  id: string;
  title: string;
  language: string;
  author: string;
  stars: number;
  views: number;
}

interface SnippetDetailPageProps {
  snippetId: string;
  handleNavigate: (page: Page, snippetId?: string) => void;
  user: User | null;
}

// Mock snippet data
const snippetData = {
  '1': {
    id: '1',
    title: 'Binary Search Implementation',
    description: 'An efficient binary search algorithm implementation with both recursive and iterative approaches. This is perfect for searching in sorted arrays with O(log n) time complexity.',
    language: 'C++',
    author: 'अनिल कुमार',
    authorId: '1', // Mock author ID for ownership check
    date: '2024-08-05',
    stars: 24,
    views: 156,
    tags: ['algorithm', 'search', 'recursion', 'data-structures'],
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
}

// Iterative Binary Search
int binarySearchIterative(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] > target) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    
    return -1; // Element not found
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};
    int target = 7;
    
    // Using recursive approach
    int result1 = binarySearchRecursive(arr, target, 0, arr.size() - 1);
    cout << "Recursive: Element found at index " << result1 << endl;
    
    // Using iterative approach
    int result2 = binarySearchIterative(arr, target);
    cout << "Iterative: Element found at index " << result2 << endl;
    
    return 0;
}`,
    steps: [
      'Create a sorted array to search in',
      'Initialize left and right pointers',
      'Calculate the middle index',
      'Compare middle element with target',
      'Adjust search range based on comparison',
      'Repeat until element is found or range is exhausted'
    ],
    comments: [
      {
        id: '1',
        user: 'प्रिया शर्मा',
        text: 'Great implementation! Very clear and well-commented code. The recursive approach is particularly elegant.',
        date: '2 hours ago'
      },
      {
        id: '2',
        user: 'राहुल गुप्ता',
        text: 'Thanks for sharing this. I was looking for a good binary search example. The iterative version is more memory efficient.',
        date: '5 hours ago'
      },
      {
        id: '3',
        user: 'सुनीता सिंह',
        text: 'Could you add an example with strings as well? It would be helpful to see how this works with different data types.',
        date: '1 day ago'
      }
    ]
  }
};

// Mock related snippets data
const relatedSnippets: RelatedSnippet[] = [
  {
    id: '2',
    title: 'Quick Sort Algorithm Implementation',
    language: 'C++',
    author: 'राहुल गुप्ता',
    stars: 18,
    views: 89
  },
  {
    id: '3',
    title: 'Merge Sort with Optimization',
    language: 'C++',
    author: 'सुनीता सिंह',
    stars: 32,
    views: 203
  },
  {
    id: '4',
    title: 'Array Data Structure Operations',
    language: 'C++',
    author: 'विकास अग्रवाल',
    stars: 15,
    views: 78
  },
  {
    id: '5',
    title: 'Linear Search vs Binary Search',
    language: 'Python',
    author: 'प्रिया शर्मा',
    stars: 21,
    views: 134
  }
];

export function SnippetDetailPage({ snippetId, handleNavigate, user }: SnippetDetailPageProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(snippetData['1'].comments);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const snippet = snippetData[snippetId as keyof typeof snippetData] || snippetData['1'];

  // Check if current user owns this snippet
  const isOwner = user && user.id === snippet.authorId;

  // Filter related snippets based on language and tags
  const getRelatedSnippets = () => {
    return relatedSnippets
      .filter(related => related.id !== snippet.id)
      .filter(related => 
        related.language === snippet.language || 
        snippet.tags.some(tag => related.title.toLowerCase().includes(tag))
      )
      .slice(0, 3);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippet.code);
    toast.success('Code copied to clipboard!');
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([snippet.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${snippet.title.toLowerCase().replace(/\s+/g, '-')}.cpp`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Code downloaded!');
  };

  const handleBookmarkToggle = () => {
    if (!user) {
      toast.error('Please login to bookmark snippets');
      return;
    }
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleShareWhatsApp = () => {
    const url = window.location.href;
    const text = `Check out this code snippet: ${snippet.title}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareTwitter = () => {
    const url = window.location.href;
    const text = `Check out this ${snippet.language} code snippet: ${snippet.title}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: user.name,
      text: newComment.trim(),
      date: 'just now'
    };

    setComments([comment, ...comments]);
    setNewComment('');
    toast.success('Comment added successfully!');
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Snippet deleted successfully!');
      setIsDeleting(false);
      setShowDeleteModal(false);
      handleNavigate('snippets');
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const relatedSnippetsList = getRelatedSnippets();

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleNavigate('snippets')}
            className="mr-4"
          >
            ← Back to Snippets
          </Button>
        </div>

        <div className="grid gap-6 xl:gap-8 xl:grid-cols-4">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Snippet Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl sm:text-2xl mb-3 break-words">{snippet.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base leading-relaxed">
                      {snippet.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm px-3 py-1 flex-shrink-0">
                    {snippet.language}
                  </Badge>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <span className="mr-1">👤</span>
                    <span className="truncate">{snippet.author}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">📅</span>
                    <span className="whitespace-nowrap">{formatDate(snippet.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">⭐</span>
                    <span className="whitespace-nowrap">{snippet.stars} stars</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">👁️</span>
                    <span className="whitespace-nowrap">{snippet.views} views</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Implementation Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>📋</span>
                  Implementation Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {snippet.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="pt-0.5 text-sm sm:text-base">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Code Block */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>💻</span>
                  Source Code
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                  >
                    <span className="mr-1">📋</span>
                    <span className="hidden sm:inline">Copy</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadCode}
                  >
                    <span className="mr-1">⬇️</span>
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed border">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Related Snippets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>🔗</span>
                  Related Snippets
                </CardTitle>
                <CardDescription className="text-sm">
                  Similar code snippets you might find interesting
                </CardDescription>
              </CardHeader>
              <CardContent>
                {relatedSnippetsList.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {relatedSnippetsList.map((related) => (
                      <Card 
                        key={related.id}
                        className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1 border-border"
                        onClick={() => handleNavigate('snippet-detail', related.id)}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-medium text-sm mb-3 line-clamp-2 leading-tight">
                            {related.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {related.language}
                            </Badge>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center">
                                <span className="mr-1">⭐</span>
                                {related.stars}
                              </div>
                              <div className="flex items-center">
                                <span className="mr-1">👁️</span>
                                {related.views}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="mr-1">👤</span>
                            <span className="truncate">{related.author}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <span className="text-2xl mb-2 block">🔗</span>
                    <p className="text-sm">No related snippets found</p>
                    <p className="text-xs mt-1">Check back later for more content!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>💬</span>
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Comment Form */}
                {user ? (
                  <form onSubmit={handleCommentSubmit} className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts about this snippet..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px] text-sm"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={!newComment.trim()} size="sm">
                        <span className="mr-1">💬</span>
                        Post Comment
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <p className="text-muted-foreground mb-3 text-sm">
                      <span className="mr-1">🔒</span>
                      Please login to post comments
                    </p>
                  </div>
                )}

                <Separator />

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {comment.user.charAt(0)}
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm truncate">{comment.user}</span>
                          <span className="text-xs text-muted-foreground flex items-center whitespace-nowrap">
                            <span className="mr-1">⏰</span>
                            {comment.date}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed break-words">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {comments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <span className="text-2xl mb-2 block">💬</span>
                    <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Actions Card */}
            <Card className="xl:sticky xl:top-24">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>⚡</span>
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Bookmark Button */}
                <Button 
                  className="w-full" 
                  variant={isBookmarked ? "default" : "outline"}
                  onClick={handleBookmarkToggle}
                  size="sm"
                >
                  <span className="mr-2">{isBookmarked ? '🔖' : '📌'}</span>
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>

                {/* Owner Actions */}
                {isOwner && (
                  <>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleNavigate('edit-snippet', snippetId)}
                      size="sm"
                    >
                      <span className="mr-2">✏️</span>
                      Edit Snippet
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="destructive"
                      onClick={() => setShowDeleteModal(true)}
                      size="sm"
                    >
                      <span className="mr-2">🗑️</span>
                      Delete Snippet
                    </Button>
                  </>
                )}

                <Separator />

                {/* Share Buttons */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Share this snippet:</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareWhatsApp}
                    className="w-full text-green-600 hover:text-green-700"
                  >
                    <span className="mr-2">📱</span>
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareTwitter}
                    className="w-full text-blue-600 hover:text-blue-700"
                  >
                    <span className="mr-2">🐦</span>
                    Twitter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>👤</span>
                  About the Author
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                    {snippet.author.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{snippet.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {isOwner ? 'You' : 'Active contributor'}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center">
                    <span className="mr-1">📄</span>
                    42 snippets shared
                  </p>
                  <p className="flex items-center">
                    <span className="mr-1">⭐</span>
                    156 total stars received
                  </p>
                  <p className="flex items-center">
                    <span className="mr-1">📅</span>
                    Member since Dec 2023
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
        description={`Are you sure you want to delete "${snippet.title}"? This action cannot be undone and all comments will be lost.`}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={isDeleting}
      />
    </>
  );
}



