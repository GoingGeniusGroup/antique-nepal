"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Globe, Save } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";
import { SettingsPreview } from "@/components/admin/settings/preview-section";

type Props = {
  general: { siteName?: string; logo?: string };
  onChange: (general: { siteName?: string; logo?: string }) => void;
};

export function GeneralSettingsCard({ general, onChange }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/site-settings", { cache: "no-store" });
        const data = await res.json();
        if (data.general) {
          onChange(data.general);
        }
      } catch (error) {
        console.error("Error fetching general settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      let updatedGeneral = { ...general };

      if (logoFile) {
        const formData = new FormData();
        formData.append("logo", logoFile);

        const uploadRes = await fetch("/api/admin/site-logo", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload logo");
        }

        const uploadData = await uploadRes.json();
        if (uploadData.logo) {
          updatedGeneral = { ...updatedGeneral, logo: uploadData.logo };
          onChange(updatedGeneral);
        }
      }

      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ general: updatedGeneral }),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("General settings saved successfully!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error saving general settings:", error);
      toast.error("Failed to save general settings", {
        duration: 3000,
        position: "bottom-right",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 border-l-4 border-l-blue-500 dark:border-l-blue-400 dark:!bg-slate-800 dark:!border-slate-600">
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
      <Card className="p-6 border-l-4 border-l-blue-500 dark:border-l-blue-400 dark:!bg-slate-800 dark:!border-slate-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <div className="text-lg font-semibold text-foreground">General Settings</div>
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
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="siteName" className="text-sm font-medium text-muted-foreground">Site Name</Label>
            <Input
              id="siteName"
              placeholder="Antique Nepal"
              className="mt-2"
              value={general.siteName || ""}
              onChange={(e) => onChange({ ...general, siteName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="logo" className="text-sm font-medium text-muted-foreground">Logo URL</Label>
            <Input
              id="logo"
              placeholder="https://example.com/logo.png"
              className="mt-2"
              value={general.logo || ""}
              onChange={(e) => onChange({ ...general, logo: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="logoUpload" className="text-sm font-medium text-muted-foreground">Upload Logo File</Label>
            <Input
              id="logoUpload"
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setLogoFile(file);
                setLogoPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
          </div>
        </div>

        <SettingsPreview title="Navbar & Admin Logo Preview">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-muted border border-border flex items-center justify-center overflow-hidden">
              {(logoPreview || general.logo) ? (
                <img
                  src={logoPreview || general.logo || ""}
                  alt={general.siteName || "Site logo preview"}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xs text-muted-foreground">Logo</span>
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                {general.siteName || "Antique Nepal"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This is how your logo will appear in the navbar and admin panel.
              </p>
            </div>
          </div>
        </SettingsPreview>
      </Card>

      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleSave}
        title="Save General Settings?"
        description="This will update the site name and logo across your website."
        confirmText="Save Changes"
      />
    </>
  );
}
