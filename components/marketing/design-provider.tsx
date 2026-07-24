"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTheme } from "next-themes";
import {
  defaultMarketingDesignId,
  getMarketingDesignPreset,
  isMarketingDesignId,
  marketingDesignPresets,
  type MarketingDesignId,
  type MarketingDesignPreset,
  type MarketingTheme,
} from "@/config/marketing-designs";

const STORAGE_KEY = "kilatkoding-marketing-design";

type MarketingDesignContextValue = {
  activeDesign: MarketingDesignPreset;
  designId: MarketingDesignId;
  presets: readonly MarketingDesignPreset[];
  setDesignId: (designId: MarketingDesignId) => void;
};

const MarketingDesignContext =
  createContext<MarketingDesignContextValue | null>(null);

function readStoredDesign() {
  if (typeof window === "undefined") {
    return defaultMarketingDesignId;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (storedValue && isMarketingDesignId(storedValue)) {
    return storedValue;
  }

  return defaultMarketingDesignId;
}

export function MarketingDesignProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [designId, setDesignIdState] =
    useState<MarketingDesignId>(defaultMarketingDesignId);

  useEffect(() => {
    setDesignIdState(readStoredDesign());
  }, []);

  const setDesignId = useCallback((nextDesignId: MarketingDesignId) => {
    setDesignIdState(nextDesignId);
    window.localStorage.setItem(STORAGE_KEY, nextDesignId);
  }, []);

  const activeDesign = useMemo(
    () => getMarketingDesignPreset(designId),
    [designId],
  );
  const activeTheme: MarketingTheme =
    resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    document.body.dataset.marketingDesign = designId;
    document.body.dataset.marketingDesignFamily = activeDesign.family;
    document.body.dataset.marketingDesignDefaultTheme = activeDesign.defaultTheme;
    document.body.dataset.marketingTheme = activeTheme;
    document.body.style.colorScheme = activeTheme;

    return () => {
      delete document.body.dataset.marketingDesign;
      delete document.body.dataset.marketingDesignFamily;
      delete document.body.dataset.marketingDesignDefaultTheme;
      delete document.body.dataset.marketingTheme;
      document.body.style.removeProperty("color-scheme");
    };
  }, [activeDesign.defaultTheme, activeDesign.family, activeTheme, designId]);

  const value = useMemo(
    () => ({
      activeDesign,
      designId,
      presets: marketingDesignPresets,
      setDesignId,
    }),
    [activeDesign, designId, setDesignId],
  );

  return (
    <MarketingDesignContext.Provider value={value}>
      <div
        className="marketing-shell min-h-screen flex flex-col"
        data-design={designId}
        data-family={activeDesign.family}
        data-theme={activeTheme}
      >
        {children}
      </div>
    </MarketingDesignContext.Provider>
  );
}

export function useMarketingDesign() {
  const context = useContext(MarketingDesignContext);

  if (!context) {
    throw new Error(
      "useMarketingDesign must be used within a MarketingDesignProvider.",
    );
  }

  return context;
}
