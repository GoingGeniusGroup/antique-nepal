"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Site Settings Root Page
 * 
 * Redirects to the general settings page by default.
 * All settings are now organized into subsections accessible via the sidebar.
 */

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/settings/general");
  }, [router]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"/> 
          Redirecting to settings...
        </div>
      </div>
    </div>
  );
}
