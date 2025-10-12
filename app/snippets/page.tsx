'use client';
import React, { use } from "react";
import { SnippetsPage } from "../components/SnippetsPage";
import { useGlobalContext } from "../context";

export default function Page() {
  const { handleNavigate } = useGlobalContext();
  return (
    <>
      <SnippetsPage handleNavigate={handleNavigate} />
    </>
  );
}
