import { axiosClient } from '../api-client';
import { SnippetsPage } from '../components/SnippetsPage';
import type { LanguageOption, Snippet } from '../types/api';

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams = {} }: Props) {
  try {
    let pageParam = (await searchParams as any).page;
    let language = (await searchParams as any).language;
    let query = (await searchParams as any).query;
    const page = pageParam ? parseInt(String(pageParam)) : 1;

    let queryUrl = '';
    if (language && language !== 'all') {
      queryUrl += `&language=${language}`;
    }
    if (query) {
      queryUrl += `&search=${encodeURI(String(query))}`;
    }
    if (page && page > 1) {
      queryUrl += `&page=${page}`;
    }

    const finalQueryUrl = `?${queryUrl.slice(1)}`;

    const response = await axiosClient({
      method: 'get',
      url: `snippets${finalQueryUrl}`,
    });

    const latestSnippets: Snippet[] = response?.data?.results || [];
    const totalSnippets: number = response?.data?.count || 0;
    const paginationConfig = {
      totalSnippets,
      currentPage: page,
      itemsPerPage: 4,
    };

    const langResp = await axiosClient({ method: 'get', url: 'language-options' }).catch(e => {
      console.error('Failed to fetch language options', e);
      return { data: { languages: [], style_choices: [] } } as any;
    });
    const languageChoices: { languages: LanguageOption[]; style_choices?: any[] } =
      langResp?.data || { languages: [], style_choices: [] };

    return (
      <>
        <SnippetsPage
          languageChoices={languageChoices}
          paginationConfig={paginationConfig}
          snippets={latestSnippets}
        />
      </>
    );
  } catch (error) {
    console.error('Error rendering snippets page:', error);
    // Provide safe fallbacks so the page still renders
    return (
      <>
        <SnippetsPage
          languageChoices={{ languages: [], style_choices: [] }}
          paginationConfig={{ totalSnippets: 0, currentPage: 1, itemsPerPage: 4 }}
          snippets={[]}
        />
      </>
    );
  }
}
