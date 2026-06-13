"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserInputs } from "@/lib/types";

const STORAGE_KEY = "freedomly_inputs";
const UPDATED_KEY = "freedomly_numbers_updated_at";

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
  localStorage.removeItem(UPDATED_KEY);
}

function readUpdatedAt(): Date | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(UPDATED_KEY);
    return raw ? new Date(raw) : null;
  } catch {
    return null;
  }
}

export function useFinancialData() {
  const [inputs, setInputsState] = useState<UserInputs | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [lastUpdated, setLastUpdatedState] = useState<Date | null>(null);

  useEffect(() => {
    setInputsState(readFromStorage());
    setLastUpdatedState(readUpdatedAt());
    setHydrated(true);
  }, []);

  const setInputs = useCallback((data: UserInputs) => {
    writeToStorage(data);
    setInputsState(data);
    const now = new Date();
    try { localStorage.setItem(UPDATED_KEY, now.toISOString()); } catch { /* ignore */ }
    setLastUpdatedState(now);
  }, []);

  const clearInputs = useCallback(() => {
    clearStorage();
    setInputsState(null);
    setLastUpdatedState(null);
  }, []);

  const hasCompletedCheckup = hydrated && inputs !== null;

  return { inputs, setInputs, clearInputs, hasCompletedCheckup, hydrated, lastUpdated };
}

