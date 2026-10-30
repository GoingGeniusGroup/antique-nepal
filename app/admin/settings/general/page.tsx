"use client";

import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { GeneralSettingsCard } from "@/components/admin/settings/general-settings-card";
import { useState } from "react";

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState<{ siteName?: string; logo?: string }>({});

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <PageHeader title="General Settings" />
          <p className="text-sm text-muted-foreground mt-2">
            Manage your website's basic information and branding.
          </p>
        </div>

        <GeneralSettingsCard 
          general={settings} 
          onChange={setSettings} 
        />
      </div>
    </PageTransition>
  );
}
