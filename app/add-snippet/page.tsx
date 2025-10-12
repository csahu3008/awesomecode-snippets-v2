'use client';
import React from "react";
import { AddSnippetPage } from "../components/AddSnippetPage";
import { useGlobalContext } from "../context";

export default function Page() {
  const { handleNavigate, user } = useGlobalContext();
  return (
    <>
      <AddSnippetPage handleNavigate={handleNavigate} user={user} />
    </>
  );
}
