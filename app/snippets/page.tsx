import { axiosClient } from "../api-client";
import { SnippetsPage } from "../components/SnippetsPage";

export default async function Page({ searchParams}) {
  let {page,language,query}=(await searchParams)
  page=page?parseInt(page):1
  let queryUrl=''
  if(language && language!=='all'){
    queryUrl+=`&language=${language}`
  }
  if(query){
    queryUrl+=`&search=${encodeURI(query)}`
  }
  if(page && page>1){
    queryUrl+=`&page=${page}`
  }

  let finalQueryUrl=`?${queryUrl.slice(1)}`
  const response=await axiosClient({
      method: "get",
      url:`snippets${finalQueryUrl}`,
    })
    const latestSnippets=(response).data.results
    const totalSnippets=(response).data.count
    const paginationConfig={
      totalSnippets,
      currentPage:page,
      itemsPerPage:4
    }

      const langResp = await axiosClient({
      method: "get",
      url: "language-options",
    });
    const languageChoices = langResp.data;
  return (
    <>
      <SnippetsPage languageChoices={languageChoices} paginationConfig={paginationConfig} snippets={latestSnippets} />
    </>
  );
}
