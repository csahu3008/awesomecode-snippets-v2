'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useGlobalContext } from '../context';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { usePathname, useSearchParams } from 'next/navigation';
import { getColorByIndex } from '../utils';
// Enable the plugin
dayjs.extend(relativeTime);
function OverviewPage({ topLanguages, topContributors, latestSnippets }) {
  const { handleNavigate } = useGlobalContext();
  const { status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const clonedSearchParams = new URLSearchParams(searchParams.toString());
  clonedSearchParams.set('show_login_modal', 'true');
  const loginPath = `${pathname}${clonedSearchParams ? `?${clonedSearchParams.toString()}` : ''}`;
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
            एक ऐसी जगह जहाँ आप अपने पसंदीदा कोड अंश को प्रकाशित कर सकते हैं और दूसरे लोग आपके कोड से
            कुछ नया सीख सकते हैं।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={status === 'authenticated' ? '/add-snippet' : `${loginPath}`}>
              <Button size="lg" className="font-medium">
                <span className="mr-2">{status === 'authenticated' ? '➕' : '📝'}</span>
                {status === 'authenticated' ? 'Add Snippet' : 'Login to Add Snippet'}
              </Button>
            </Link>
            <Link href={'/snippets'}>
              <Button variant="outline" size="lg">
                <span className="mr-2">🔍</span>
                Explore Snippets
              </Button>
            </Link>
          </div>
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
            <Link href={'/snippets'}>
              <Button variant="ghost" size="sm" className="text-xs">
                View All →
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestSnippets.map(snippet => (
              <Link className="block" key={snippet.id} href={`snippet-detail/${snippet.id}`}>
                <div className="flex flex-col space-y-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm line-clamp-2 flex-1">{snippet.title}</h4>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {snippet.language}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="mr-1">👤</span>
                    <span className="truncate flex-1">{snippet.coder.username}</span>
                    <span className="mx-2 flex-shrink-0">•</span>
                    <span className="flex items-center flex-shrink-0">
                      <span className="mr-1">⏰</span>
                      updated {dayjs(snippet.updated_date).fromNow()}
                    </span>
                  </div>
                </div>
              </Link>
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
            <Link href={'/contributors'}>
              <Button variant="ghost" size="sm" className="text-xs">
                View All →
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {topContributors.map((contributor, index) => (
              <div
                key={contributor.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{contributor.username}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="mr-1">📄</span>
                    <span>{contributor.total_snippets}</span>
                    {/* <span className="mx-2">•</span> */}
                    {/* <span className="mr-1">⭐</span> */}
                    {/* <span>{contributor.stars}</span> */}
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
              <CardDescription className="text-sm">
                Most popular programming languages
              </CardDescription>
            </div>
            <Link href={'/languages'}>
              <Button variant="ghost" size="sm" className="text-xs">
                View All →
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {topLanguages.map((language, index) => (
              <div
                key={language.language}
                className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div
                  className={`flex-shrink-0 w-4 h-4 rounded-full ${language.color}`}
                  style={{ background: getColorByIndex(index) }}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{language.language}</p>
                    <span className="text-xs text-muted-foreground">{language.total_snippets}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full`}
                      style={{
                        width: `${language.percentage}%`,
                        background: getColorByIndex(index),
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      {/* <section className="mt-16 lg:mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <div className="text-center p-4 lg:p-6 bg-muted/30 rounded-lg">
            <div className="text-2xl mb-2">📄</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-mono font-medium">
              1,247
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Code Snippets
            </div>
          </div>
          <div className="text-center p-4 lg:p-6 bg-muted/30 rounded-lg">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-mono font-medium">
              342
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Contributors
            </div>
          </div>
          <div className="text-center p-4 lg:p-6 bg-muted/30 rounded-lg">
            <div className="text-2xl mb-2">🧠</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-mono font-medium">
              25
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Languages
            </div>
          </div>
          <div className="text-center p-4 lg:p-6 bg-muted/30 rounded-lg">
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-mono font-medium">
              5,632
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Total Stars
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}

export default OverviewPage;
