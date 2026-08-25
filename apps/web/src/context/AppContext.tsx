"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AppContextValue = {
  darkMode: boolean;
  savedPropertyIds: string[];
  toggleDarkMode: () => void;
  toggleSavedProperty: (propertyId: string) => void;
  isSaved: (propertyId: string) => boolean;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("masqani-theme");
    const storedSaved = window.localStorage.getItem("masqani-saved-properties");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    setDarkMode(storedTheme ? storedTheme === "dark" : prefersDark);
    setSavedPropertyIds(storedSaved ? JSON.parse(storedSaved) : ["kilimani-01", "westlands-01"]);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("masqani-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    window.localStorage.setItem("masqani-saved-properties", JSON.stringify(savedPropertyIds));
  }, [savedPropertyIds]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((value) => !value);
  }, []);

  const toggleSavedProperty = useCallback((propertyId: string) => {
    setSavedPropertyIds((current) =>
      current.includes(propertyId)
        ? current.filter((id) => id !== propertyId)
        : [...current, propertyId]
    );
  }, []);

  const isSaved = useCallback(
    (propertyId: string) => savedPropertyIds.includes(propertyId),
    [savedPropertyIds]
  );

  const value = useMemo(
    () => ({
      darkMode,
      savedPropertyIds,
      toggleDarkMode,
      toggleSavedProperty,
      isSaved
    }),
    [darkMode, isSaved, savedPropertyIds, toggleDarkMode, toggleSavedProperty]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
}
