import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

type Page = 'overview' | 'snippets' | 'contributors' | 'languages' | 'snippet-detail';

interface SnippetsPageProps {
  onNavigate: (page: Page, snippetId?: string) => void;
}

// Mock data for snippets
const allSnippets = [
  {
    id: '1',
    title: 'Binary Search Implementation',
    description: 'Efficient binary search algorithm with recursive and iterative approaches.',
    language: 'C++',
    author: 'अनिल कुमार',
    date: '2024-08-05',
    stars: 24,
    views: 156,
    tags: ['algorithm', 'search', 'recursion']
  },
  {
    id: '2',
    title: 'React Custom Hook for API Calls',
    description: 'Reusable custom hook for handling API requests with loading states.',
    language: 'JavaScript',
    author: 'प्रिया शर्मा',
    date: '2024-08-05',
    stars: 18,
    views: 89,
    tags: ['react', 'hooks', 'api']
  },
  {
    id: '3',
    title: 'Python Data Validation Utils',
    description: 'Common utility functions for validating different types of data.',
    language: 'Python',
    author: 'राहुल गुप्ता',
    date: '2024-08-04',
    stars: 32,
    views: 203,
    tags: ['validation', 'utilities', 'data']
  },
  {
    id: '4',
    title: 'CSS Grid Layout Helper',
    description: 'Responsive grid layout component with customizable breakpoints.',
    language: 'CSS',
    author: 'सुनीता सिंह',
    date: '2024-08-04',
    stars: 15,
    views: 78,
    tags: ['css', 'grid', 'responsive']
  },
  {
    id: '5',
    title: 'MySQL Query Optimization',
    description: 'Best practices for optimizing complex MySQL queries.',
    language: 'SQL',
    author: 'विकास अग्रवाल',
    date: '2024-08-03',
    stars: 28,
    views: 134,
    tags: ['sql', 'optimization', 'database']
  },
  {
    id: '6',
    title: 'TypeScript Interface Generator',
    description: 'Automatically generate TypeScript interfaces from JSON data.',
    language: 'TypeScript',
    author: 'नेहा पटेल',
    date: '2024-08-03',
    stars: 21,
    views: 92,
    tags: ['typescript', 'generator', 'json']
  }
];

export function SnippetsPage({ onNavigate }: SnippetsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 4;
  const languages = ['all', 'JavaScript', 'Python', 'C++', 'CSS', 'SQL', 'TypeScript'];

  // Filter and sort snippets
  const filteredSnippets = allSnippets
    .filter(snippet => {
      const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLanguage = selectedLanguage === 'all' || snippet.language === selectedLanguage;
      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.stars - a.stars;
        case 'views':
          return b.views - a.views;
        case 'latest':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const totalPages = Math.ceil(filteredSnippets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSnippets = filteredSnippets.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onNavigate('overview')}
          className="mr-4"
        >
          ← Back
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-mono mb-1 flex items-center gap-2">
            <span>📄</span>
            Code Snippets
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Browse {filteredSnippets.length} amazing code snippets from our community
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full sm:w-48 text-sm">
            <SelectValue placeholder="Filter by language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang === 'all' ? 'All Languages' : lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="popular">Most Stars</SelectItem>
            <SelectItem value="views">Most Views</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Snippets Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {paginatedSnippets.map((snippet) => (
          <Card 
            key={snippet.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onNavigate('snippet-detail', snippet.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg mb-2 break-words">{snippet.title}</CardTitle>
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
                {snippet.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="flex items-center">
                    <span className="mr-1">👤</span>
                    <span className="truncate">{snippet.author}</span>
                  </span>
                  <div className="flex items-center whitespace-nowrap">
                    <span className="mr-1">📅</span>
                    {formatDate(snippet.date)}
                  </div>
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="flex items-center">
                    <span className="mr-1">⭐</span>
                    {snippet.stars}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">👁️</span>
                    {snippet.views}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredSnippets.length === 0 && (
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
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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



