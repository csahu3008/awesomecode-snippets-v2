'use client';
import Link from 'next/link';
import { useState } from 'react';
import { getColorByIndex } from '../utils';
import type { LanguageSummary } from '../types/api';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Progress } from './ui/progress';

type Page = 'overview' | 'snippets' | 'contributors' | 'languages' | 'snippet-detail';

const topLanguages = {
  python:
    'Python is the leading language for AI, data science, and general-purpose programming due to its simplicity and rich libraries.',
  java: 'Java remains a staple for enterprise applications and Android development with its stability and cross-platform capabilities.',
  javascript:
    'JavaScript dominates web development, enabling interactive front-end and increasingly back-end solutions with Node.js.',
  cpp: 'C++ is a high-performance language extensively used in systems programming, games, and performance-critical applications.',
  c: 'C is a foundational language known for low-level programming and system software, valued for its speed and control.',
  csharp:
    'C# is popular for Windows applications and game development, especially with the Unity engine, focusing on productivity.',
  typescript:
    'TypeScript builds on JavaScript by adding static typing, improving developer tooling and code robustness.',
  sql: 'SQL is the core language for managing and querying relational databases, critical for data-driven applications.',
  go: 'Go, or Golang, is valued for simplicity, concurrency support, and efficiency mainly in cloud services and backend systems.',
  php: 'PHP remains widely used for server-side web development powering many websites despite mixed opinions about its design.',
  rust: 'Rust is growing rapidly for its memory safety and performance, ideal for system programming and secure software.',
  swift:
    "Swift is Apple's modern language for iOS and macOS applications, known for safety and developer friendliness.",
  ruby: 'Ruby focuses on simplicity and productivity, well-known for web development with the Ruby on Rails framework.',
  kotlin:
    'Kotlin is increasingly favored for Android development as a concise, modern alternative to Java.',
  r: 'R is specialized for statistical computing and data analysis with a vast ecosystem of packages.',
  matlab:
    'MATLAB is used in academic and engineering communities for numerical computing and simulations.',
  dart: 'Dart powers Flutter apps for cross-platform mobile and web development with fast UI rendering.',
  scala:
    'Scala blends object-oriented and functional programming and is used in big data and backend systems.',
  perl: 'Perl is a versatile scripting language used for text processing, system administration, and legacy applications.',
  fortran:
    'Fortran is a longtime favorite in scientific computing, known for numerical precision and performance.',
  lua: 'Lua is a lightweight scripting language embedded in games and applications for easy extensibility.',
  groovy:
    'Groovy is a dynamic JVM language used for scripting, testing, and building tools with concise syntax.',
  shell:
    'Shell scripting automates tasks in Unix/Linux environments, integral for system administration.',
  objectivec:
    'Objective-C is Apple’s older language for iOS/macOS before Swift, still maintained for legacy apps.',
  powershell:
    'PowerShell is a powerful task automation framework commonly used in Windows environments.',
  elixir:
    'Elixir is a functional language targeting highly concurrent and fault-tolerant systems with the Erlang VM.',
  clojure:
    'Clojure is a modern Lisp dialect for the JVM emphasizing immutability and functional programming.',
  julia:
    'Julia is designed for high-performance numerical analysis and computational science with easy syntax.',
  scratch:
    'Scratch is a visual programming language aimed at teaching coding fundamentals to beginners and kids.',
  ada: 'Ada is known for its reliability and safety, used primarily in critical systems like aviation and defense.',
  html: 'HTML is the foundational markup language for creating and structuring content on the web.',
  css: 'CSS is the stylesheet language used to design and visually style web pages and user interfaces.',
};

export function LanguagesPage({ languageStats = [] }: { languageStats?: LanguageSummary[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter languages based on search
  const filteredLanguages = (languageStats || []).filter((language: LanguageSummary) =>
    (language.language || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    (topLanguages[language.language as keyof typeof topLanguages] || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

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
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Languages Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredLanguages.map((language: LanguageSummary, index: number) => (
          <Card key={language.language} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div
                    style={{ background: getColorByIndex(index) }}
                    className={`w-4 h-4 rounded-full flex-shrink-0`}
                  ></div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2 mb-1">
                      <span className="truncate">{language.language}</span>
                      {false && (
                        <span className="text-xs sm:text-sm font-normal text-green-600 flex items-center flex-shrink-0">
                          <span className="mr-1">📈</span>
                          {(language as any).trending}
                        </span>
                      )}
                    </CardTitle>
                      <CardDescription className="text-sm">
                        {topLanguages[language?.language as keyof typeof topLanguages] || ''}
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
                    <span className="font-medium text-base sm:text-lg">
                      {language.total_snippets}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Code Snippets</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <span className="mr-1 text-sm">👥</span>
                    <span className="font-medium text-base sm:text-lg">
                      {language.total_contributors}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Contributors</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Popularity</span>
                  <span className="text-sm text-muted-foreground">{language.percentage}%</span>
                </div>
                <Progress value={language.percentage} className="h-2" />
              </div>

              {/* Recent Snippets */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <span className="mr-1">📅</span>
                  Recent Snippets
                </h4>
                <div className="space-y-2">
                  {Array.isArray(language?.recent_snippets) &&
                    (language.recent_snippets || []).map((snippet: any, i: number) => (
                      <Link key={snippet.id} href={`/snippet-detail/${snippet.id}`}>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mr-2 flex-shrink-0"></div>
                          <span className="truncate">{snippet.title}</span>
                        </div>
                      </Link>
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
                  {(((language as any).top_contributors) || []).map((contributor: any, i: number) => (
                    <span
                      key={i}
                      className="text-xs bg-muted px-2 py-1 rounded flex items-center max-w-full"
                    >
                      <span className="mr-1 flex-shrink-0">👤</span>
                      <span className="truncate">{contributor.coder__username}</span>
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
          <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Summary Stats */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <span>📊</span>
            Language Statistics
          </CardTitle>
          <CardDescription className="text-sm">
            Overview of programming languages in our community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl mb-1">🧠</div>
              <div className="text-lg sm:text-2xl font-mono font-medium">
                {languageStats.length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Languages</div>
            </div>
            <div className="text-center">
              <div className="text-xl mb-1">📄</div>
              <div className="text-lg sm:text-2xl font-mono font-medium">
                {languageStats.reduce((sum, lang) => sum + lang.total_snippets, 0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Snippets</div>
            </div>
            <div className="text-center">
              <div className="text-xl mb-1">👥</div>
              <div className="text-lg sm:text-2xl font-mono font-medium">
                {/* todo: calculation logic can be improved since, a contributer can contribute in multiple languages */}
                {languageStats.reduce((sum, lang) => sum + lang.total_contributors, 0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Contributors</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
