import { axiosClient } from '../api-client';
import { LanguagesPage } from '../components/LanguagesPage';
import type { LanguageSummary } from '../types/api';
export const dynamic='force-dynamic'

export default async function Page() {
  try {
    const languageChoicesResp = await axiosClient({ method: 'get', url: 'languages' });
    const languageStats: LanguageSummary[] = languageChoicesResp?.data || [];
    return (
      <>
        <LanguagesPage languageStats={languageStats} />
      </>
    );
  } catch (error) {
    console.error('Failed to fetch languages:', error);
    return (
      <>
        <LanguagesPage languageStats={[]} />
      </>
    );
  }
}
