'use client';
import React from "react";
import { EditSnippetPage } from "@/app/components/EditSnippetPage";
import { useGlobalContext } from "@/app/context";

export default function Page({ params }: { params: { id: string } }) {
  const { handleNavigate, user } = useGlobalContext();
  return (
    <>
      <EditSnippetPage
        snippetId={params.id}
        handleNavigate={handleNavigate}
        user={user}
      />
    </>
  );
}
