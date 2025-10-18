import { axiosClient } from "@/app/api-client";
import { SnippetDetailPage } from "../../components/SnippetDetailPage";

export default async function Page({ params }) {
  const { id } = await params;
  const response = await axiosClient({
    method: "get",
    url: `snippets/${id}/`,
  });
  console.log("response",response)
  const detailedArticle = response.data;
  const related = await axiosClient({
    method: "get",
    url: "snippets",
  });
  const relatedArticles = related.data.results.slice(0, 3);

  const commentsResp=await axiosClient({
    method:'get',
    url:`comments/?snippet_id=${id}`
  })
  const comments=commentsResp.data.results
  console.log("All Comments",comments)
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
