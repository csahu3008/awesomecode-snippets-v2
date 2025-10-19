import { axiosClient } from '@/app/api-client';
import { SnippetDetailPage } from '../../components/SnippetDetailPage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAuthHeadersFromSession } from '@/app/auth-helper';
export default async function Page({ params }) {
  const { id } = await params;
  const serverSession = await getServerSession(authOptions);
  console.log('Server', serverSession);

  // detailed article
  const authHeaders = getAuthHeadersFromSession(serverSession);
  const detailResp = await axiosClient({
    method: 'get',
    url: `snippets/${id}/`,
    ...(authHeaders ? { headers: authHeaders } : {}),
  });
  const detailedArticle = detailResp.data;
  console.log(detailedArticle, 'detaileResp');
  // fetch comments as per per article
  const commentsResp = await axiosClient({
    method: 'get',
    url: `comments?snippet_id=${id}`,
  });
  const comments = commentsResp.data.results;

  // fetch related articles
  const relatedResp = await axiosClient({
    method: 'get',
    url: 'snippets',
  });
  const relatedArticles = relatedResp.data.results.slice(0, 3);
  return (
    <>
      <SnippetDetailPage
        snippetId={id}
        article={detailedArticle}
        relatedArticles={relatedArticles}
        allComments={comments}
      />
    </>
  );
}
