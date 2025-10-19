import React from 'react';
import { ContributorsPage } from '../components/ContributorsPage';
import { axiosClient } from '../api-client';

export default async function Page() {
  let contributersResp = await axiosClient({
    method: 'get',
    url: 'top-contributors',
  });
  contributersResp = contributersResp.data;
  return (
    <>
      <ContributorsPage allContributors={contributersResp} />
    </>
  );
}
