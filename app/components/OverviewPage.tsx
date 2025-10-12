import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useGlobalContext } from "../context";

type Page = 'overview' | 'snippets' | 'contributors' | 'languages' | 'snippet-detail' | 'add-snippet' | 'edit-snippet';

// Mock data
const latestSnippets = [
  { id: '1', title: 'Binary Search Implementation', language: 'C++', author: 'अनिल कुमार', date: '2 hours ago' },
  { id: '2', title: 'React Custom Hook for API', language: 'JavaScript', author: 'प्रिया शर्मा', date: '4 hours ago' },
  { id: '3', title: 'Python Data Validation', language: 'Python', author: 'राहुल गुप्ता', date: '6 hours ago' },
  { id: '4', title: 'CSS Grid Layout Helper', language: 'CSS', author: 'सुनीता सिंह', date: '1 day ago' },
  { id: '5', title: 'MySQL Query Optimization', language: 'SQL', author: 'विकास अग्रवाल', date: '1 day ago' },
];

const topContributors = [
  { id: '1', name: 'अनिल कुमार', snippets: 42, stars: 156 },
  { id: '2', name: 'प्रिया शर्मा', snippets: 38, stars: 142 },
  { id: '3', name: 'राहुल गुप्ता', snippets: 35, stars: 128 },
  { id: '4', name: 'सुनीता सिंह', snippets: 29, stars: 98 },
  { id: '5', name: 'विकास अग्रवाल', snippets: 24, stars: 87 },
];

const topLanguages = [
  { id: '1', name: 'JavaScript', snippets: 234, color: 'bg-yellow-500' },
  { id: '2', name: 'Python', snippets: 189, color: 'bg-blue-500' },
  { id: '3', name: 'C++', snippets: 156, color: 'bg-purple-500' },
  { id: '4', name: 'Java', snippets: 134, color: 'bg-red-500' },
  { id: '5', name: 'CSS', snippets: 98, color: 'bg-green-500' },
];

export function OverviewPage() {
  const { handleNavigate, user }=useGlobalContext()
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
      {/* Hero Section */}
      <section className="text-center mb-12 lg:mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-4xl lg:text-6xl mb-6">📄</div>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-mono mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            AwesomeCodeSnippets
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            एक ऐसी जगह जहाँ आप अपने पसंदीदा कोड अंश को प्रकाशित कर सकते हैं और दूसरे लोग आपके कोड से कुछ नया सीख सकते हैं।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="font-medium"
              onClick={() => handleNavigate(user ? 'add-snippet' : 'snippets')}
            >
              <span className="mr-2">{user ? '➕' : '📝'}</span>
              {user ? 'Add Snippet' : 'Submit Snippet'}
            </Button>
            <Button variant="outline" size="lg" onClick={() => handleNavigate('snippets')}>
              <span className="mr-2">🔍</span>
              Explore Snippets
            </Button>
          </div>
          {!user && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-4">
              <span className="mr-1">💡</span>
              Login to start sharing your own code snippets
            </p>
          )}
        </div>
      </section>

      {/* Main Content Grid - Mobile First, Desktop at 1200px */}
      <div className="grid gap-6 lg:gap-8 xl:grid-cols-3">
        {/* Latest Snippets */}
        <Card className="xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="text-xl">📄</span>
                Latest Snippets
              </CardTitle>
              <CardDescription className="text-sm">Most recently shared code</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleNavigate('snippets')}
              className="text-xs"
            >
              View All →
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestSnippets.map((snippet) => (
              <div 
                key={snippet.id}
                className="flex flex-col space-y-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                onClick={() => handleNavigate('snippet-detail', snippet.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm line-clamp-2 flex-1">{snippet.title}</h4>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {snippet.language}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="mr-1">👤</span>
                  <span className="truncate flex-1">{snippet.author}</span>
                  <span className="mx-2 flex-shrink-0">•</span>
                  <span className="flex items-center flex-shrink-0">
                    <span className="mr-1">⏰</span>
                    {snippet.date}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Contributors */}
        <Card className="xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="text-xl">🌟</span>
                Top Contributors
              </CardTitle>
              <CardDescription className="text-sm">Most active community members</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleNavigate('contributors')}
              className="text-xs"
            >
              View All →
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {topContributors.map((contributor, index) => (
              <div key={contributor.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{contributor.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="mr-1">📄</span>
                    <span>{contributor.snippets}</span>
                    <span className="mx-2">•</span>
                    <span className="mr-1">⭐</span>
                    <span>{contributor.stars}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Languages */}
        <Card className="xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="text-xl">🧠</span>
                Top Languages
              </CardTitle>
              <CardDescription className="text-sm">Most popular programming languages</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleNavigate('languages')}
              className="text-xs"
            >
              View All →
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {topLanguages.map((language, index) => (
              <div key={language.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                <div className={`flex-shrink-0 w-4 h-4 rounded-full ${language.color}`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{language.name}</p>
                    <span className="text-xs text-muted-foreground">{language.snippets}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div 
                      className={`h-1.5 rounded-full ${language.color}`}
                      style={{ width: `${(language.snippets / 234) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <section className="mt-16 lg:mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <div className="text-center p-4 lg:p-6 bg-muted/30 rounded-lg">
            <div className="text-2xl mb-2">📄</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-mono font-medium">1,247</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Code Snippets</div>
          </div>
          <div className="text-center p-4 lg:p-6 bg-muted/30 rounded-lg">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-mono font-medium">342</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Contributors</div>
          </div>
          <div className="text-center p-4 lg:p-6 bg-muted/30 rounded-lg">
            <div className="text-2xl mb-2">🧠</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-mono font-medium">25</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Languages</div>
          </div>
          <div className="text-center p-4 lg:p-6 bg-muted/30 rounded-lg">
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-mono font-medium">5,632</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total Stars</div>
          </div>
        </div>
      </section>
    </div>
  );
}



