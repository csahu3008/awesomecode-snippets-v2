import React from 'react';
import { ContributorsPage } from '../components/ContributorsPage';
import { axiosClient } from '../api-client';
import type { Contributor } from '../types/api';

export default async function Page() {
  try {
    const contributersResp = await axiosClient({ method: 'get', url: 'top-contributors' });
    const data: Contributor[] = contributersResp?.data || [];
    return (
      <>
        <ContributorsPage allContributors={data} />
      </>
    );
  } catch (error) {
    console.error('Failed to fetch contributors:', error);
    return (
      <>
        <ContributorsPage allContributors={[]} />
      </>
    );
  }
}
