import React from "react";
import { AddSnippetPage } from "../components/AddSnippetPage";
import { useGlobalContext } from "../context";
import { axiosClient } from "../api-client";

export default async function Page() {
  const resp = await axiosClient({
      method: "get",
      url: "language-options",
    });
    const languageChoices = resp.data;
  return (
    <>
      <AddSnippetPage languageChoices={languageChoices}/>
    </>
  );
}
