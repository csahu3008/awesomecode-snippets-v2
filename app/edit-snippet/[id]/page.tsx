import React from 'react';
import { EditSnippetPage } from '@/app/components/EditSnippetPage';
import { axiosClient } from '@/app/api-client';

export default async function Page({ params }) {
  const { id } = await params;
  const detaileResp = await axiosClient({
    method: 'get',
    url: `snippets/${id}/`,
  });
  const detailArticle = detaileResp.data;

  const resp = await axiosClient({
    method: 'get',
    url: 'language-options',
  });
  const languageChoices = resp.data;
  return (
    <>
      <EditSnippetPage
        snippetId={id}
        detailedArticle={detailArticle}
        languageChoices={languageChoices}
      />
    </>
  );
}
