"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { GeneralSettingsCard } from "@/components/admin/settings/general-settings-card";
import { HeroSettingsCard } from "@/components/admin/settings/hero-settings-card";
import { BannerSettingsCard } from "@/components/admin/settings/banner-settings-card";
import { HomepageSettingsCard } from "@/components/admin/settings/homepage-settings-card";
import { FooterSettingsCardNew } from "@/components/admin/settings/footer-settings-card-new";

/**
 * Site Settings Management Page
 * 
 * Features:
 * - General site configuration (name, logo)
 * - Hero section content management
 * - Banner text configuration
 * - Footer content management
 * - Individual save buttons for each section
 * - Confirmation dialogs before saving
 * - Toast notifications for feedback
 */

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

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    general: {},
    hero: {},
    banner: {},
    footer: {},
    homepage: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        const res = await fetch("/api/admin/site-settings", { cache: "no-store" });
        const json = await res.json();
        if (!alive) return;
        setSettings(json as Settings);
      } finally {
        if (alive) setLoading(false);
      }
    };
    run();
    return () => { alive = false; };
  }, []);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <PageHeader title="Site Settings" />
          <p className="text-sm text-muted-foreground mt-2">
            Manage your website content and appearance. Each section can be saved independently.
          </p>
        </div>

      {loading ? (
        <div className="flex h-[30vh] items-center justify-center text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"/> Loading...</span>
        </div>
      ) : (
        <>
          <GeneralSettingsCard 
            general={settings.general} 
            onChange={(general) => setSettings(s => ({ ...s, general }))} 
          />
          <HeroSettingsCard 
            hero={settings.hero} 
            onChange={(hero) => setSettings(s => ({ ...s, hero }))} 
          />
          <BannerSettingsCard 
            banner={settings.banner} 
            onChange={(banner) => setSettings(s => ({ ...s, banner }))} 
          />
          <HomepageSettingsCard 
            homepage={settings.homepage} 
            onChange={(homepage) => setSettings(s => ({ ...s, homepage }))} 
          />
          <FooterSettingsCardNew 
            footer={settings.footer} 
            onChange={(footer) => setSettings(s => ({ ...s, footer }))} 
          />
        </>
      )}
      </div>
    </PageTransition>
  );
}
