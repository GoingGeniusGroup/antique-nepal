"use client";

import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { BannerSettingsCard } from "@/components/admin/settings/banner-settings-card";
import { useState } from "react";

export default function BannerSettingsPage() {
  const [settings, setSettings] = useState<{ text?: string; isVisible?: boolean }>({});

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <PageHeader title="Banner Settings" />
          <p className="text-sm text-muted-foreground mt-2">
            Configure the announcement banner displayed at the top of your website.
          </p>
        </div>

        <BannerSettingsCard 
          banner={settings} 
          onChange={setSettings} 
        />
      </div>
    </PageTransition>
  );
}
