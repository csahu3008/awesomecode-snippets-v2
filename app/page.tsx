import { axiosClient } from './api-client';
import OverviewPage from './components/OverviewPage';

async function page() {
  const response = await axiosClient({
    method: 'get',
    url: 'snippets',
  });
  const latestArticles = response.data.results.slice(0, 5);

  let topContributors = await axiosClient({
    method: 'get',
    url: 'top-contributors',
  });
  topContributors = topContributors.data?.slice(0, 5);

  let topLanguages = await axiosClient({
    method: 'get',
    url: 'languages',
  });
  topLanguages = topLanguages.data?.slice(0, 5);
  return (
    <>
    <OverviewPage
      topLanguages={topLanguages}
      topContributors={topContributors}
      latestSnippets={latestArticles}
      />
      </>
  );
}
export default page;
