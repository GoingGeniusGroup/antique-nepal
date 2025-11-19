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
  footer: {
    brand?: {
      id?: string;
      name: string;
      logo: string;
      tagline: string;
      description: string;
    } | null;
    socials?: Array<{
      id?: string;
      name: string;
      icon: string;
      href: string;
      displayOrder: number;
    }>;
    contact?: {
      id?: string;
      email: string;
      phone: string;
      address: string;
    } | null;
    newsletter?: {
      id?: string;
      title: string;
      description: string;
    } | null;
    sections?: Array<{
      id?: string;
      title: string;
      displayOrder: number;
      links: Array<{
        id?: string;
        name: string;
        href: string;
        displayOrder: number;
      }>;
    }>;
  };
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
      
      // Fetch site settings (hero, banner, homepage, general)
      const [siteSettingsRes, footerRes] = await Promise.all([
        fetch("/api/admin/site-settings", { cache: "no-store" }),
        fetch("/api/footer", { cache: "no-store" }),
      ]);
      
      if (!siteSettingsRes.ok || !footerRes.ok) {
        throw new Error("Failed to fetch settings");
      }
      
      const siteSettings = await siteSettingsRes.json();
      const footerData = await footerRes.json();
      
      setSettings({
        ...siteSettings,
        footer: footerData,
      });
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

export function useGeneralSettings() {
  const { settings, loading, error } = useSettings();
  return {
    general: settings.general,
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

export function useFooterSettings() {
  const { settings, loading, error } = useSettings();
  return {
    footer: settings.footer,
    loading,
    error,
  };
}
