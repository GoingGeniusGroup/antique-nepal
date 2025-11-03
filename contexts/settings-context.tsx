"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Settings = {
  general: { siteName?: string; logo?: string };
  hero: { 
    title?: string; 
    subtitle?: string; 
    description?: string;
    backgroundImage?: string;
    features?: {
      feature1?: { title?: string; description?: string; };
      feature2?: { title?: string; description?: string; };
      feature3?: { title?: string; description?: string; };
    };
  };
  banner: { text?: string; isVisible?: boolean };
  footer: { text?: string };
  homepage: {
    featuredTitle?: string;
    featuredSubtitle?: string;
    featuredDescription?: string;
    productHighlights?: {
      title?: string;
      subtitle?: string;
      featuredProductIds?: string[];
    };
  };
};

type SettingsContextType = {
  settings: Settings;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    general: {},
    hero: {},
    banner: {},
    footer: {},
    homepage: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/site-settings", {
        cache: "no-store",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch settings");
      console.error("Settings fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const value = {
    settings,
    loading,
    error,
    refetch: fetchSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

// Hook for specific setting sections
export function useHomepageSettings() {
  const { settings, loading, error } = useSettings();
  return {
    homepage: settings.homepage,
    loading,
    error,
  };
}

export function useHeroSettings() {
  const { settings, loading, error } = useSettings();
  return {
    hero: settings.hero,
    loading,
    error,
  };
}

export function useBannerSettings() {
  const { settings, loading, error } = useSettings();
  return {
    banner: settings.banner,
    loading,
    error,
  };
}
