import React from "react";
import { ContributorsPage } from "../components/ContributorsPage";
import { axiosClient } from "../api-client";

export default async function Page() {
  let allContributors = await axiosClient({
    method: "get",
    url: "top-contributors",
  });
  allContributors = allContributors.data;
  return (
    <>
      <ContributorsPage allContributors={allContributors}/>
    </>
  );
}
