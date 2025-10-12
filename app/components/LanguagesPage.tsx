import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

type Page = 'overview' | 'snippets' | 'contributors' | 'languages' | 'snippet-detail';

interface LanguagesPageProps {
  handleNavigate: (page: Page) => void;
}

// Mock languages data
const allLanguages = [
  {
    id: '1',
    name: 'JavaScript',
    snippets: 234,
    contributors: 89,
    color: 'bg-yellow-500',
    trending: '+12%',
    description: 'The most popular programming language for web development',
    recentSnippets: ['React Custom Hook', 'Async/Await Helper', 'DOM Manipulation Utils'],
    topContributors: ['प्रिया शर्मा', 'अनिल कुमार', 'नेहा पटेल']
  },
  {
    id: '2',
    name: 'Python',
    snippets: 189,
    contributors: 76,
    color: 'bg-blue-500',
    trending: '+8%',
    description: 'Versatile language perfect for data science and automation',
    recentSnippets: ['Data Validation', 'File Processing', 'API Integration'],
    topContributors: ['राहुल गुप्ता', 'विकास अग्रवाल', 'अनिल कुमार']
  },
  {
    id: '3',
    name: 'C++',
    snippets: 156,
    contributors: 54,
    color: 'bg-purple-500',
    trending: '+5%',
    description: 'High-performance language for system programming and algorithms',
    recentSnippets: ['Binary Search', 'Sorting Algorithms', 'Data Structures'],
    topContributors: ['अनिल कुमार', 'अमित जैन', 'राहुल गुप्ता']
  },
  {
    id: '4',
    name: 'Java',
    snippets: 134,
    contributors: 48,
    color: 'bg-red-500',
    trending: '+3%',
    description: 'Enterprise-grade language for large-scale applications',
    recentSnippets: ['Spring Configuration', 'Design Patterns', 'JUnit Tests'],
    topContributors: ['अमित जैन', 'विकास अग्रवाल', 'राहुल गुप्ता']
  },
  {
    id: '5',
    name: 'CSS',
    snippets: 98,
    contributors: 42,
    color: 'bg-green-500',
    trending: '+15%',
    description: 'Styling language for beautiful and responsive web interfaces',
    recentSnippets: ['Grid Layouts', 'Animations', 'Responsive Design'],
    topContributors: ['सुनीता सिंह', 'प्रिया शर्मा', 'पूजा मेहता']
  },
  {
    id: '6',
    name: 'TypeScript',
    snippets: 87,
    contributors: 39,
    color: 'bg-indigo-500',
    trending: '+20%',
    description: 'JavaScript with type safety for better development experience',
    recentSnippets: ['Interface Generator', 'Type Guards', 'Generic Utilities'],
    topContributors: ['नेहा पटेल', 'प्रिया शर्मा', 'अमित जैन']
  },
  {
    id: '7',
    name: 'SQL',
    snippets: 76,
    contributors: 31,
    color: 'bg-teal-500',
    trending: '+7%',
    description: 'Database query language for data management and analysis',
    recentSnippets: ['Query Optimization', 'Stored Procedures', 'Data Migration'],
    topContributors: ['विकास अग्रवाल', 'राहुल गुप्ता', 'अमित जैन']
  },
  {
    id: '8',
    name: 'PHP',
    snippets: 65,
    contributors: 28,
    color: 'bg-violet-500',
    trending: '+2%',
    description: 'Server-side scripting language for web development',
    recentSnippets: ['Laravel Helpers', 'API Endpoints', 'Database Connections'],
    topContributors: ['पूजा मेहता', 'अमित जैन', 'विकास अग्रवाल']
  }
];

export function LanguagesPage({ handleNavigate }: LanguagesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter languages based on search
  const filteredLanguages = allLanguages.filter(language =>
    language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    language.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const maxSnippets = Math.max(...allLanguages.map(lang => lang.snippets));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleNavigate('overview')}
          className="mr-4"
        >
          ← Back
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-mono mb-1 flex items-center gap-2">
            <span>🧠</span>
            Programming Languages
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Explore the most popular languages in our community
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <span className="absolute left-3 top-3 text-muted-foreground text-sm">🔍</span>
          <Input
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Languages Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredLanguages.map((language, index) => (
          <Card key={language.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className={`w-4 h-4 rounded-full ${language.color} flex-shrink-0`}></div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2 mb-1">
                      <span className="truncate">{language.name}</span>
                      <span className="text-xs sm:text-sm font-normal text-green-600 flex items-center flex-shrink-0">
                        <span className="mr-1">📈</span>
                        {language.trending}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {language.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-base sm:text-lg font-mono">#{index + 1}</div>
                  <div className="text-xs text-muted-foreground">Rank</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <span className="mr-1 text-sm">📄</span>
                    <span className="font-medium text-base sm:text-lg">{language.snippets}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Code Snippets</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <span className="mr-1 text-sm">👥</span>
                    <span className="font-medium text-base sm:text-lg">{language.contributors}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Contributors</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Popularity</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((language.snippets / maxSnippets) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(language.snippets / maxSnippets) * 100} 
                  className="h-2"
                />
              </div>

              {/* Recent Snippets */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <span className="mr-1">📅</span>
                  Recent Snippets
                </h4>
                <div className="space-y-2">
                  {language.recentSnippets.map((snippet, i) => (
                    <div key={i} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mr-2 flex-shrink-0"></div>
                      <span className="truncate">{snippet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <span className="mr-1">⭐</span>
                  Top Contributors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {language.topContributors.map((contributor, i) => (
                    <span key={i} className="text-xs bg-muted px-2 py-1 rounded flex items-center max-w-full">
                      <span className="mr-1 flex-shrink-0">👤</span>
                      <span className="truncate">{contributor}</span>
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredLanguages.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🧠</span>
          <h3 className="text-base sm:text-lg font-medium mb-2">No languages found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <span>📊</span>
            Language Statistics
          </CardTitle>
          <CardDescription className="text-sm">Overview of programming languages in our community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl mb-1">🧠</div>
              <div className="text-lg sm:text-2xl font-mono font-medium">{allLanguages.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Languages</div>
            </div>
            <div className="text-center">
              <div className="text-xl mb-1">📄</div>
              <div className="text-lg sm:text-2xl font-mono font-medium">
                {allLanguages.reduce((sum, lang) => sum + lang.snippets, 0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Snippets</div>
            </div>
            <div className="text-center">
              <div className="text-xl mb-1">👥</div>
              <div className="text-lg sm:text-2xl font-mono font-medium">
                {allLanguages.reduce((sum, lang) => sum + lang.contributors, 0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-xl mb-1">📈</div>
              <div className="text-lg sm:text-2xl font-mono font-medium text-green-600">+9.2%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Average Growth</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



