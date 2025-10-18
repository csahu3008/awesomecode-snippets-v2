import { axiosClient } from "../api-client";
import { LanguagesPage } from "../components/LanguagesPage";

export default async function Page() {
  let languageChoicesResp = await axiosClient({
    method: "get",
    url: "languages",
  });
  languageChoicesResp = languageChoicesResp.data;
  return (
    <>
      <LanguagesPage languageStats={languageChoicesResp} />
    </>
  );
}
