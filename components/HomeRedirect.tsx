"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFinancialData } from "@/hooks/useFinancialData";

export function HomeRedirect() {
  const { hasCompletedCheckup, hydrated } = useFinancialData();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && hasCompletedCheckup) {
      router.replace("/home");
    }
  }, [hydrated, hasCompletedCheckup, router]);

  return null;
}
