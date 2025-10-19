import React from 'react';
import { AddSnippetPage } from '../components/AddSnippetPage';
import { axiosClient } from '../api-client';
import type { LanguageOption } from '../types/api';

export default async function Page() {
  try {
    const languageChoicesResp = await axiosClient({ method: 'get', url: 'language-options' });
    const languageChoices: { languages: LanguageOption[]; style_choices?: any[] } =
      languageChoicesResp?.data || { languages: [], style_choices: [] };

    return (
      <>
        <AddSnippetPage languageChoices={languageChoices} />
      </>
    );
  } catch (error) {
    console.error('Failed to fetch language options for add-snippet page:', error);
    return (
      <>
        <AddSnippetPage languageChoices={{ languages: [], style_choices: [] }} />
      </>
    );
  }
}
