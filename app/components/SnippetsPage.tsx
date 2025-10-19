'use client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type Page = 'overview' | 'snippets' | 'contributors' | 'languages' | 'snippet-detail';

import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
export function SnippetsPage({ snippets, paginationConfig, languageChoices }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const languages = [{ key: 'all', value: 'All Languages' }, ...languageChoices.languages];
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query')?.toString() || '');
  const [selectedLanguage, setSelectedLanguage] = useState(
    searchParams.get('language')?.toString(),
  );
  const initialRef = useRef(true);
  // delete page before appending it to paginated pages
  const paginatedParams = new URLSearchParams(searchParams);
  paginatedParams.delete('page');
  useEffect(() => {
    if (initialRef.current) {
      initialRef.current = false;
      return;
    }
    const params = new URLSearchParams(searchParams);
    if (selectedLanguage) {
      params.set('language', selectedLanguage);
    } else {
      params.delete('language');
    }
    if (searchQuery) {
      params.set('query', searchQuery);
    } else {
      params.delete('query');
    }
    if (searchQuery || selectedLanguage) {
      params.delete('page');
    }
    replace(`${pathname}?${params.toString()}`);
  }, [selectedLanguage, searchQuery]);
  const { totalSnippets, currentPage = 1, itemsPerPage } = paginationConfig;
  const totalPages = Math.ceil(totalSnippets / itemsPerPage);
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <span className="absolute left-3 top-3 text-muted-foreground text-sm">🔍</span>
          <Input
            placeholder="Search snippets, tags, or descriptions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full sm:w-48 text-sm">
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang.key} value={lang.key}>
                {lang.key === 'all' ? 'All Languages' : lang.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Snippets Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {snippets.map(snippet => (
          <Link key={snippet.id} href={`/snippet-detail/${snippet.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg mb-2 break-words">
                      {snippet.title}
                    </CardTitle>
                    {/* excerpt needs to be added later */}
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
                    snippet.tags?.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="flex items-center">
                      <span className="mr-1">👤</span>
                      <span className="truncate">{snippet.coder.username}</span>
                    </span>
                    <div className="flex items-center whitespace-nowrap">
                      <span className="mr-1">📅</span>
                      {dayjs(snippet.updated_date).format('DD MMM YYYY')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    {snippet.starts && (
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
                  href={`/snippets?page=${Math.max(1, currentPage - 1)}${paginatedParams.toString().length > 0 ? `&${paginatedParams.toString()}` : ''}`}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={`/snippets?page=${page}${paginatedParams.toString().length > 0 ? `&${paginatedParams.toString()}` : ''}`}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href={`/snippets?page=${Math.min(totalPages, currentPage + 1)}${paginatedParams.toString().length > 0 ? `&${paginatedParams.toString()}` : ''}`}
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
