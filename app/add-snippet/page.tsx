import React from "react";
import { AddSnippetPage } from "../components/AddSnippetPage";
import { useGlobalContext } from "../context";
import { axiosClient } from "../api-client";

export default async function Page() {
  const languageChoicesResp = await axiosClient({
    method: "get",
    url: "language-options",
  });
  const languageChoices = languageChoicesResp.data;
  return (
    <>
      <AddSnippetPage languageChoices={languageChoices} />
    </>
  );
}
