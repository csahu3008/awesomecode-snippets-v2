import dayjs from 'dayjs';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { SnippetsSearchFilterWrapper } from './SnippetsSearchFilterWrapper';

import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
import type { Snippet, LanguageOption } from '../types/api';

type SnippetsPageProps = {
  snippets: Snippet[];
  paginationConfig: { totalSnippets: number; currentPage?: number; itemsPerPage: number };
  languageChoices: { languages: LanguageOption[] };
  searchParams: {
    query?: string;
    language?: string;
    page?: string;
  };
};

export function SnippetsPage({ 
  snippets, 
  paginationConfig, 
  languageChoices,
  searchParams 
}: SnippetsPageProps) {
  const { totalSnippets, currentPage = 1, itemsPerPage } = paginationConfig;
  const totalPages = Math.ceil(totalSnippets / itemsPerPage);
  
  // Build pagination params without page
  const paginatedParams = new URLSearchParams();
  if (searchParams?.query) paginatedParams.set('query', searchParams.query);
  if (searchParams?.language) paginatedParams.set('language', searchParams.language);
  const paginatedParamsString = paginatedParams.toString();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href={'/'}>
          <Button variant="ghost" size="sm" className="mr-4">
            ← Back
          </Button>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-mono mb-1 flex items-center gap-2">
            <span>📄</span>
            Code Snippets
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Browse {totalSnippets} amazing code snippets from our community
          </p>
        </div>
      </div>

      {/* Filters - Now wrapped in Suspense */}
      <SnippetsSearchFilterWrapper
        languageChoices={languageChoices}
        initialQuery={searchParams.query}
        initialLanguage={searchParams.language}
      />

      {/* Snippets Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {snippets.map((snippet: Snippet) => (
          <Link key={snippet.id} href={`/snippet-detail/${snippet.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg mb-2 break-words">
                      {snippet.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {snippet.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {snippet.language}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {Array.isArray(snippet.tags) &&
                    snippet.tags?.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="flex items-center">
                      <span className="mr-1">👤</span>
                      <span className="truncate">{snippet.coder?.username || 'Unknown'}</span>
                    </span>
                    <div className="flex items-center whitespace-nowrap">
                      <span className="mr-1">📅</span>
                      {dayjs(snippet.updated_date).format('DD MMM YYYY')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {snippet.stars && (
                      <div className="flex items-center">
                        <span className="mr-1">⭐</span>
                        {snippet.stars}
                      </div>
                    )}
                    {snippet.views && (
                      <div className="flex items-center">
                        <span className="mr-1">👁️</span>
                        {snippet.views}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* No Results */}
      {snippets.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">📄</span>
          <h3 className="text-base sm:text-lg font-medium mb-2">No snippets found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`/snippets?page=${Math.max(1, currentPage - 1)}${paginatedParamsString.length > 0 ? `&${paginatedParamsString}` : ''}`}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={`/snippets?page=${page}${paginatedParamsString.length > 0 ? `&${paginatedParamsString}` : ''}`}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href={`/snippets?page=${Math.min(totalPages, currentPage + 1)}${paginatedParamsString.length > 0 ? `&${paginatedParamsString}` : ''}`}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
