import { axiosClient } from '@/app/api-client';
import { SnippetDetailPage } from '../../components/SnippetDetailPage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAuthHeadersFromSession } from '@/app/auth-helper';
import { Snippet, CommentApi } from '@/app/types/api';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } =await params;
  const serverSession = await getServerSession(authOptions);

  const authHeaders = getAuthHeadersFromSession(serverSession);

  let detailedArticle: Snippet | null = null;
  let comments: CommentApi[] = [];
  let relatedArticles: Snippet[] = [];

  try {
    const detailResp = await axiosClient({ method: 'get', url: `snippets/${id}/`, ...(authHeaders ? { headers: authHeaders } : {}) });
    detailedArticle = detailResp.data as Snippet;
  } catch (error: any) {
    console.error('Failed to load snippet detail:', error);
    detailedArticle = null;
  }

  try {
    const commentsResp = await axiosClient({ method: 'get', url: `comments?snippet=${id}` });
    comments = commentsResp.data?.results ?? [];
  } catch (error: any) {
    console.error('Failed to load comments', error);
    comments = [];
  }

  try {
    const relatedResp = await axiosClient({ method: 'get', url: 'snippets' });
    relatedArticles = (relatedResp.data?.results ?? []).slice(0, 3) as Snippet[];
  } catch (error: any) {
    console.error('Failed to load related snippets', error);
    relatedArticles = [];
  }

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
