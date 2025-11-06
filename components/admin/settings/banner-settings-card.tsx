"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tag, Save } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";

type Props = {
  banner: { text?: string; isVisible?: boolean };
  onChange: (banner: { text?: string; isVisible?: boolean }) => void;
};

export function BannerSettingsCard({ banner, onChange }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/site-settings", { cache: "no-store" });
        const data = await res.json();
        if (data.banner) {
          onChange(data.banner);
        }
      } catch (error) {
        console.error("Error fetching banner settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner }),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Banner settings saved successfully!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error saving banner settings:", error);
      toast.error("Failed to save banner settings", {
        duration: 3000,
        position: "bottom-right",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 border-l-4 border-l-blue-500 dark:border-l-blue-500 dark:!bg-slate-800 dark:!border-slate-600">
        <div className="flex items-center justify-center h-32">
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"/> 
            Loading...
          </span>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 border-l-4 border-l-blue-500 dark:border-l-blue-500 dark:!bg-slate-800 dark:!border-slate-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div className="text-lg font-semibold text-foreground">Banner Settings</div>
          </div>
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={saving || loading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
        <div>
          <Label htmlFor="bannerText" className="text-sm font-medium text-muted-foreground">Banner Text</Label>
          <Input
            id="bannerText"
            placeholder="100% Sustainable • Handcrafted in Nepal"
            className="mt-2"
            value={banner.text || ""}
            onChange={(e) => onChange({ ...banner, text: e.target.value })}
          />
        </div>
      </Card>

      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleSave}
        title="Save Banner Settings?"
        description="This will update the banner text displayed at the top of your homepage."
        confirmText="Save Changes"
      />
    </>
  );
}
