"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserInputs } from "@/lib/types";

const STORAGE_KEY = "freedomly_inputs";

function readFromStorage(): UserInputs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserInputs;
  } catch {
    return null;
  }
}

function writeToStorage(inputs: UserInputs): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
}

function clearStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function useFinancialData() {
  const [inputs, setInputsState] = useState<UserInputs | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setInputsState(readFromStorage());
    setHydrated(true);
  }, []);

  const setInputs = useCallback((data: UserInputs) => {
    writeToStorage(data);
    setInputsState(data);
  }, []);

  const clearInputs = useCallback(() => {
    clearStorage();
    setInputsState(null);
  }, []);

  const hasCompletedCheckup = hydrated && inputs !== null;

  return { inputs, setInputs, clearInputs, hasCompletedCheckup, hydrated };
}
