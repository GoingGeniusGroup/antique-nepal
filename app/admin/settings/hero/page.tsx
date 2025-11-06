"use client";

import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { HeroSettingsCard } from "@/components/admin/settings/hero-settings-card";
import { useState } from "react";

type HeroData = { 
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

export default function HeroSettingsPage() {
  const [settings, setSettings] = useState<HeroData>({});

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <PageHeader title="Hero Section Settings" />
          <p className="text-sm text-muted-foreground mt-2">
            Customize your homepage hero section content and feature highlights.
          </p>
        </div>

        <HeroSettingsCard 
          hero={settings} 
          onChange={setSettings} 
        />
      </div>
    </PageTransition>
  );
}
