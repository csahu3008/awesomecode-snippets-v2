import { Suspense } from 'react';
import { axiosClient } from './api-client';
import OverviewPage from './components/OverviewPage';
import { PagedResponse, Snippet, Contributor, LanguageSummary } from './types/api';
export const dynamic='force-dynamic'
async function page() {
  let latestArticles: Snippet[] = [];
  let topContributors: Contributor[] = [];
  let topLanguages: LanguageSummary[] = [];

  try {
    const response = await axiosClient({ method: 'get', url: 'snippets' });
    const data = response.data as PagedResponse<Snippet>;
    latestArticles = (data.results ?? []).slice(0, 5);
  } catch (error: any) {
    console.error('Failed to load snippets for homepage:', error);
  }

  try {
    const resp = await axiosClient({ method: 'get', url: 'top-contributors' });
    topContributors = (resp.data ?? []).slice(0, 5) as Contributor[];
  } catch (error: any) {
    console.error('Failed to load top contributors:', error);
  }

  try {
    const resp = await axiosClient({ method: 'get', url: 'languages' });
    topLanguages = (resp.data ?? []).slice(0, 5) as LanguageSummary[];
  } catch (error: any) {
    console.error('Failed to load top languages:', error);
  }

  return (
    <>
    <Suspense fallback={<h1>Loading...</h1>}>
      <OverviewPage
        topLanguages={topLanguages}
        topContributors={topContributors}
        latestSnippets={latestArticles}
        />
        </Suspense>
    </>
  );
}

export default page;
