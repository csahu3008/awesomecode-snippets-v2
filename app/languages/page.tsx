'use client';
import React from "react";
import { LanguagesPage } from "../components/LanguagesPage";
import { useGlobalContext } from "../context";

export default function Page() {
  const { handleNavigate } = useGlobalContext();
  return (
    <>
      <LanguagesPage handleNavigate={handleNavigate} />
    </>
  );
}
