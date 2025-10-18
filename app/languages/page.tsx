import { axiosClient } from "../api-client";
import { LanguagesPage } from "../components/LanguagesPage";

export default async function Page() {
     let languageStats = await axiosClient({
    method: "get",
    url: "languages",
  });
  languageStats = languageStats.data;
  return (
    <>
      <LanguagesPage languageStats={languageStats} />
    </>
  );
}
