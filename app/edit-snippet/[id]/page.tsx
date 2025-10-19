import React from 'react';
import { EditSnippetPage } from '@/app/components/EditSnippetPage';
import { axiosClient } from '@/app/api-client';
import type { Snippet, LanguageOption } from '@/app/types/api';

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } =await params;
  try {
    const detaileResp = await axiosClient({ method: 'get', url: `snippets/${id}/` });
    const detailArticle: Snippet | null = detaileResp?.data || null;

    const resp = await axiosClient({ method: 'get', url: 'language-options' }).catch(e => {
      console.error('Failed to fetch language options', e);
      return { data: { languages: [] } } as any;
    });
    const languageChoices: { languages: LanguageOption[] } = resp?.data || { languages: [] };

    return (
      <>
        <EditSnippetPage
          snippetId={id}
          detailedArticle={detailArticle}
          languageChoices={languageChoices}
        />
      </>
    );
  } catch (error) {
    console.error('Failed to load edit snippet page data:', error);
    return (
      <>
        <EditSnippetPage snippetId={id} detailedArticle={null} languageChoices={{ languages: [] }} />
      </>
    );
  }
}
