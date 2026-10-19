"use client";

import React, { createContext, useContext, useState } from "react";

export type SiteTheme = "creative" | "classic" | "emerald";

interface LayoutContextType {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutLabProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<SiteTheme>("creative");

  return (
    <LayoutContext.Provider value={{ theme, setTheme }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutLab() {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    throw new Error("useLayoutLab must be used within a LayoutLabProvider");
  }
  return ctx;
}
