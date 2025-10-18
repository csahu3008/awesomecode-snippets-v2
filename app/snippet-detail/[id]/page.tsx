import { axiosClient } from "@/app/api-client";
import { SnippetDetailPage } from "../../components/SnippetDetailPage";

export default async function Page({ params }) {
  const { id } = await params;

  // detailed article
  const detailResp = await axiosClient({
    method: "get",
    url: `snippets/${id}/`,
  });
  const detailedArticle = detailResp.data;
  // fetch comments as per per article
  const commentsResp = await axiosClient({
    method: "get",
    url: `comments?snippet_id=${id}`,
  });
  const comments = commentsResp.data.results;

  // fetch related articles
  const relatedResp = await axiosClient({
    method: "get",
    url: "snippets",
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
