'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { LanguageOption } from '../types/api';

type SnippetsSearchFilterProps = {
  languageChoices: { languages: LanguageOption[] };
  initialQuery?: string;
  initialLanguage?: string;
};

export function SnippetsSearchFilter({ 
  languageChoices, 
  initialQuery = '',
  initialLanguage 
}: SnippetsSearchFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const safeLanguageChoices = languageChoices && languageChoices.languages ? languageChoices : { languages: [] };
  const languages = [{ key: 'all', value: 'All Languages' }, ...safeLanguageChoices.languages];
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const initialRef = useRef(true);

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
  }, [selectedLanguage, searchQuery, pathname, replace, searchParams]);

  return (
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
  );
}
