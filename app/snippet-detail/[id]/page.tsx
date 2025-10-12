'use client';
import React from "react";
import { SnippetDetailPage } from "../../components/SnippetDetailPage";
import { useGlobalContext } from "../../context";

export default function Page({ params }: { params: { id: string } }) {
  const { handleNavigate, user } = useGlobalContext();
  return (
    <>
      <SnippetDetailPage 
        snippetId={params.id} 
        handleNavigate={handleNavigate}
        user={user}
      />
    </>
  );
}
