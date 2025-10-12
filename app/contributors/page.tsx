'use client';
import React from "react";
import { ContributorsPage } from "../components/ContributorsPage";
import { useGlobalContext } from "../context";

export default function Page() {
  const { handleNavigate } = useGlobalContext();
  return (
    <>
      <ContributorsPage handleNavigate={handleNavigate} />
    </>
  );
}
