'use client';
import { useRouter } from 'next/navigation';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { ConfirmationModal } from './ConfirmationModal';
import { toast } from 'sonner';
import Link from 'next/link';
import dayjs from 'dayjs';

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
  article?: any; // API response for the snippet (provided by parent)
  relatedArticles?: any[]; // list of related articles from parent
}

// Note: `article` and `relatedArticles` are provided by the parent route — this component only consumes them.
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSession } from 'next-auth/react';
import { axiosClient } from '../api-client';

// Enable the plugin => provides fromNow() functionality
dayjs.extend(relativeTime);
export function SnippetDetailPage({
  snippetId,
  article,
  relatedArticles,
  allComments,
}: SnippetDetailPageProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = (session as any)?.user ?? null;
  const sessionUsername: string | null =
    (session as any)?.user?.username || null;
  const articleData = article ?? {};
  // Check if current session owns this snippet
  const isOwner =
    status === "authenticated" &&
    sessionUsername === (articleData?.coder?.username || null)
      ? true
      : false;
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(
    (allComments as Comment[]) ?? []
  );
  const [isBookmarked, setIsBookmarked] = useState(articleData?.bookmarked);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(articleData.code ?? '');
    toast.success('Code copied to clipboard!');
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([articleData.code ?? ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const ext = (articleData?.language || 'txt').toLowerCase();
    element.download = `${(articleData?.title ?? 'snippet')
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')}.${
      ext === 'c++' || ext === 'cpp' ? 'cpp' : ext === 'python' ? 'py' : 'txt'
    }`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Code downloaded!');
  };

   const handleBookmarkToggle =async () => {
    
    try {
      const resp = await axiosClient.post(
        `snippets/${snippetId}/bookmark/`,
        {},
        {
          headers: {
            Authorization:
              "Bearer " +
              ((session as any)?.accessToken ||
                (session as any)?.access_token ||
                ""),
          },
        }
      );
      if (resp.data.status == "bookmark added") {
        // bookmark added
        setIsBookmarked(true);
        toast.success("Added into your bookmarks !");
      } else {
        // bookmark removed
        setIsBookmarked(false);
        toast.success("Removed from your bookmarks !");
      }
      // success
    } catch (error: any) {
      console.error("Error while Bookmark action:", error);
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to delete snippet";
      toast.error(msg);
    } 
  };


  const handleShareWhatsApp = () => {
    const url = window.location.href;
    const text = `Check out this code snippet: ${articleData?.title ?? ''}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareTwitter = () => {
    const url = window.location.href;
    const text = `Check out this ${articleData?.language ?? ''} code snippet: ${
      articleData?.title ?? ''
    }`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text,
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status !== "authenticated") {
      toast.error("Please login to comment");
      return;
    }

    if (!newComment.trim()) return;

    const comment = {
      snippet: snippetId,
      detail: newComment.trim(),
    };
    try {
      const resp = await axiosClient.post(`comments/`, comment, {
        headers: {
          Authorization:
            "Bearer " +
            ((session as any)?.accessToken ||
              (session as any)?.access_token ||
              ""),
        },
      });
      if (resp.status === 201) {
        setComments([{ ...comment, user: session.user }, ...comments]);
        setNewComment("");
        toast.success("Comment added successfully!");
      } else {
        throw new Error("something went wrong");
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to add comments";
      console.error(msg, "Error");
      toast.error("Can't add new comments kindly try it later");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const resp = await axiosClient.delete(`snippets/${snippetId}/`, {
        headers: {
          Authorization:
            "Bearer " +
            ((session as any)?.accessToken ||
              (session as any)?.access_token ||
              ""),
        },
      });

      // success
      toast.success("Snippet deleted successfully!");
      setShowDeleteModal(false);
      router.push("/snippets");
    } catch (error: any) {
      console.error("Delete snippet error:", error);
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to delete snippet";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };
  const relatedArticlesList =
    relatedArticles?.filter((item) => item.id !== articleData.id) || [];
  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href={`/snippets`}>
            <Button variant="ghost" size="sm" className="mr-4">
              ← Back to Snippets
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 xl:gap-8 xl:grid-cols-4">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Snippet Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl sm:text-2xl break-words">
                      {article.title}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-sm px-3 py-1 flex-shrink-0">
                    {article.language}
                  </Badge>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {(articleData?.tags ?? []).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <span className="mr-1">👤</span>
                    <span className="truncate">
                      {articleData?.coder?.username ??
                        articleData?.coder ??
                        articleData?.author ??
                        'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">📅</span>
                    <span className="whitespace-nowrap">
                      Last updated{' '}
                      {articleData?.updated_date
                        ? dayjs(articleData.updated_date).fromNow()
                        : articleData?.date
                          ? dayjs(articleData.date).fromNow()
                          : 'Unknown'}
                    </span>
                  </div>
                  {articleData?.stars && (
                    <div className="flex items-center">
                      <span className="mr-1">⭐</span>
                      <span className="whitespace-nowrap">{articleData.stars} stars</span>
                    </div>
                  )}
                  {articleData?.views && (
                    <div className="flex items-center">
                      <span className="mr-1">👁️</span>
                      <span className="whitespace-nowrap">{articleData.views} views</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* content section might need to upgrade styling later */}
                <div dangerouslySetInnerHTML={{ __html: articleData?.description ?? '' }}></div>
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
                  <Button variant="outline" size="sm" onClick={handleCopyCode}>
                    <span className="mr-1">📋</span>
                    <span className="hidden sm:inline">Copy</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadCode}>
                    <span className="mr-1">⬇️</span>
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed border">
                    <code>{articleData?.code ?? ''}</code>
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
                {relatedArticlesList.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {relatedArticlesList.map(related => (
                      <Link key={related.id} href={`/snippet-detail/${related.id}`}>
                        <Card className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1 border-border">
                          <CardContent className="p-4">
                            <h3 className="font-medium text-sm mb-3 line-clamp-2 leading-tight">
                              {related.title}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {related.language}
                              </Badge>
                              <div className="flex items-center space-x-3">
                                {related.stars && (
                                  <div className="flex items-center">
                                    <span className="mr-1">⭐</span>
                                    {related.stars}
                                  </div>
                                )}
                                {related.views && (
                                  <div className="flex items-center">
                                    <span className="mr-1">👁️</span>
                                    {related.views}
                                  </div>
                                )}
                                {related.updated_date && (
                                  <div className="flex items-center">
                                    <span className="mr-1">📅</span>
                                    Last updated {dayjs(related.updated_date).fromNow()}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className="mr-1">👤</span>
                              <span className="truncate">
                                {related.coder?.username || "NA"}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
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
                {status === "authenticated" ? (
                  <form onSubmit={handleCommentSubmit} className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts about this snippet..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
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
                  {comments &&
                    comments.length > 0 &&
                    comments.map((comment, index) => (
                      <div key={index} className="flex space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                          {comment.user?.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm truncate">
                              {comment.user?.username}
                            </span>
                          <span className="text-xs text-muted-foreground flex items-center whitespace-nowrap">
                            <span className="mr-1">⏰</span>
                              posted {dayjs(comment.date_commented).fromNow()}
                          </span>
                        </div>
                          <p className="text-sm leading-relaxed break-words">
                            {comment.detail}
                          </p>
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
                {status === "authenticated" && (
                <Button
                  className="w-full mb-3"
                  variant={isBookmarked ? 'default' : 'outline'}
                  onClick={handleBookmarkToggle}
                  size="sm"
                >
                    <span className="mr-2">{isBookmarked ? "🔖" : "📌"}</span>
                    {isBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
                )}

                {/* Owner Actions */}
                {isOwner && (
                  <>
                    <Link href={`/edit-snippet/${snippetId}`}>
                      <Button className="w-full" variant="outline" size="sm">
                        <span className="mr-2">✏️</span>
                        Edit Snippet
                      </Button>
                    </Link>
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
                    {(
                      articleData?.coder?.username ??
                      articleData?.author ??
                      "U"
                    )
                      .toString()
                      .charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {articleData?.coder?.username ??
                        articleData?.author ??
                        "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isOwner ? "You" : "Active contributor"}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  {/* todo: logic for below items to be added later */}
                  {false && (
                    <p className="flex items-center">
                      <span className="mr-1">📄</span>
                      42 snippets shared
                    </p>
                  )}
                  {false && (
                    <p className="flex items-center">
                      <span className="mr-1">⭐</span>
                      156 total stars received
                    </p>
                  )}
                  {false && (
                    <p className="flex items-center">
                      <span className="mr-1">📅</span>
                      Member since Dec 2023
                    </p>
                  )}
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
        description={`Are you sure you want to delete "${
          articleData?.title ?? ''
        }"? This action cannot be undone and all comments will be lost.`}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={isDeleting}
      />
    </>
  );
}
