export interface Coder {
  id: number;
  username: string;
}

export interface Snippet {
  id: number;
  title: string;
  description?: string;
  code?: string;
  highlighted_code?: string;
  language?: string;
  coder?: Coder | null;
  publication_date?: string;
  updated_date?: string;
  tags?: string[];
  style?: string;
  bookmarked?: boolean;
  // UI fields
  stars?: number;
  views?: number;
  author?: string;
  date?: string;
  comments?: CommentApi[];
}

export interface CommentUser {
  id: number;
  username: string;
}

export interface CommentApi {
  id: number;
  snippet: number;
  user: CommentUser;
  detail: string;
  date_commented: string;
  parent?: number | null;
  replies?: any[];
}

export interface PagedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

export interface Contributor {
  id: number;
  username: string;
  last_login?: string;
  date_joined?: string;
  total_snippets?: number;
  top_languages?: string[];
}

export interface LanguageSummary {
  language: string;
  total_snippets: number;
  total_contributors: number;
  percentage: number;
  recent_snippets?: {
    id: number;
    title: string;
    coder__username?: string;
    updated_date?: string;
  }[];
}

export interface LanguageOption {
  key: string;
  value: string;
}
