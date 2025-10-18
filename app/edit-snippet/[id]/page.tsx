import React from "react";
import { EditSnippetPage } from "@/app/components/EditSnippetPage";
import { axiosClient } from "@/app/api-client";

export default async function Page({params}) {
  const { id } = await params;
   const response = await axiosClient({
      method: "get",
      url: `snippets/${id}/`,
    });
    const detailedArticle = response.data;
    const resp = await axiosClient({
      method: "get",
      url: "language-options",
    });
    const languageChoices = resp.data;
    console.log({detailedArticle})
  return (
    <>
      <EditSnippetPage
        snippetId={id}
        detailedArticle={detailedArticle}
        languageChoices={languageChoices}
      />
    </>
  );
}
