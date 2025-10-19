'use client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { useState } from 'react';
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

type Page = 'overview' | 'snippets' | 'contributors' | 'languages' | 'snippet-detail';

dayjs.extend(relativeTime);

export function ContributorsPage({ allContributors }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setcurrentPage] = useState(1);

  const itemsPerPage = 6;

  // Filter contributors based on search
  const filteredContributors = allContributors.filter(
    contributor =>
      contributor.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contributor.top_languages.some(lang =>
        lang.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const totalPages = Math.ceil(filteredContributors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContributors = filteredContributors.slice(startIndex, startIndex + itemsPerPage);
  // need to take care with when searching
  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mr-4">
            ← Back
          </Button>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-mono mb-1 flex items-center gap-2">
            <span>🌟</span>
            Top Contributors
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Meet the amazing developers who make our community thrive
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <span className="absolute left-3 top-3 text-muted-foreground text-sm">🔍</span>
          <Input
            placeholder="Search contributors or languages..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Contributors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedContributors.map((contributor, index) => {
          const globalIndex = startIndex + index;
          return (
            <Card key={contributor.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-12 h-12 capitalize bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-medium flex-shrink-0">
                      {contributor.username?.charAt(0) || 'NA'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="uppercase text-base sm:text-lg flex items-center gap-2 truncate">
                        {contributor.username}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Member since {dayjs(contributor.date_joined).format('MMM YYYY')}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {getRankEmoji(globalIndex)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <span className="mr-1 text-sm">📄</span>
                      <span className="font-medium text-sm">{contributor.total_snippets}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Snippets</p>
                  </div>
                  {false && (
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <span className="mr-1 text-sm">⭐</span>
                        <span className="font-medium text-sm">{contributor.stars}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Stars</p>
                    </div>
                  )}
                </div>

                {/* Top Languages */}
                {contributor.top_languages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2 flex items-center">
                      <span className="mr-1">🧠</span>
                      Top Languages:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {contributor.top_languages.map(language => (
                        <Badge key={language} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="mr-1">📈</span>
                  <span className="truncate">
                    Last active {dayjs(contributor.last_login).fromNow()}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredContributors.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🌟</span>
          <h3 className="text-base sm:text-lg font-medium mb-2">No contributors found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setcurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setcurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setcurrentPage(Math.min(totalPages, currentPage + 1))}
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
