import { Suspense } from 'react';
import { SnippetsSearchFilter } from './SnippetsSearchFilter';
import type { LanguageOption } from '../types/api';

type SnippetsSearchFilterWrapperProps = {
  languageChoices: { languages: LanguageOption[] };
  initialQuery?: string;
  initialLanguage?: string;
};

export function SnippetsSearchFilterWrapper(props: SnippetsSearchFilterWrapperProps) {
  return (
    <Suspense fallback={
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 h-10 bg-muted animate-pulse rounded-md" />
        <div className="w-full sm:w-48 h-10 bg-muted animate-pulse rounded-md" />
      </div>
    }>
      <SnippetsSearchFilter {...props} />
    </Suspense>
  );
}
