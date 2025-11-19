"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Type, Save } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";
import { SettingsPreview } from "@/components/admin/settings/preview-section";

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

type Props = {
  hero: HeroData;
  onChange: (hero: HeroData) => void;
};

export function HeroSettingsCard({ hero, onChange }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/site-settings", { cache: "no-store" });
        const data = await res.json();
        if (data.hero) {
          onChange(data.hero);
        }
      } catch (error) {
        console.error("Error fetching hero settings:", error);
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
        body: JSON.stringify({ hero }),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Hero section saved successfully!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error saving hero settings:", error);
      toast.error("Failed to save hero settings", {
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
            <Type className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div className="text-lg font-semibold text-foreground">Hero Section</div>
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
          <Label htmlFor="heroTitle" className="text-sm font-medium text-muted-foreground">Hero Title</Label>
          <Input
            id="heroTitle"
            placeholder="ANTIQUE NEPAL"
            className="mt-2"
            value={hero.title || ""}
            onChange={(e) => onChange({ ...hero, title: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="heroSubtitle" className="text-sm font-medium text-muted-foreground">Hero Subtitle</Label>
          <Input
            id="heroSubtitle"
            placeholder="Welcome to best website"
            className="mt-2"
            value={hero.subtitle || ""}
            onChange={(e) => onChange({ ...hero, subtitle: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="heroDescription" className="text-sm font-medium text-muted-foreground">Hero Description</Label>
          <Input
            id="heroDescription"
            placeholder="Every bag tells a story. Crafted by master artisans using centuries-old techniques..."
            className="mt-2"
            value={hero.description || ""}
            onChange={(e) => onChange({ ...hero, description: e.target.value })}
          />
        </div>
      </div>
      
      {/* Hero Features */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-md font-semibold text-foreground mb-4">Feature Cards</h4>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Feature 1 Title</Label>
            <Input
              placeholder="100% Eco-Friendly"
              className="mt-2 mb-2"
              value={hero.features?.feature1?.title || ""}
              onChange={(e) => onChange({ 
                ...hero, 
                features: { 
                  ...hero.features, 
                  feature1: { ...hero.features?.feature1, title: e.target.value } 
                } 
              })}
            />
            <Input
              placeholder="Sustainable hemp fiber"
              className="mt-1"
              value={hero.features?.feature1?.description || ""}
              onChange={(e) => onChange({ 
                ...hero, 
                features: { 
                  ...hero.features, 
                  feature1: { ...hero.features?.feature1, description: e.target.value } 
                } 
              })}
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Feature 2 Title</Label>
            <Input
              placeholder="Fair Trade"
              className="mt-2 mb-2"
              value={hero.features?.feature2?.title || ""}
              onChange={(e) => onChange({ 
                ...hero, 
                features: { 
                  ...hero.features, 
                  feature2: { ...hero.features?.feature2, title: e.target.value } 
                } 
              })}
            />
            <Input
              placeholder="Supporting local artisans"
              className="mt-1"
              value={hero.features?.feature2?.description || ""}
              onChange={(e) => onChange({ 
                ...hero, 
                features: { 
                  ...hero.features, 
                  feature2: { ...hero.features?.feature2, description: e.target.value } 
                } 
              })}
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Feature 3 Title</Label>
            <Input
              placeholder="Quality Crafted"
              className="mt-2 mb-2"
              value={hero.features?.feature3?.title || ""}
              onChange={(e) => onChange({ 
                ...hero, 
                features: { 
                  ...hero.features, 
                  feature3: { ...hero.features?.feature3, title: e.target.value } 
                } 
              })}
            />
            <Input
              placeholder="15+ years tradition"
              className="mt-1"
              value={hero.features?.feature3?.description || ""}
              onChange={(e) => onChange({ 
                ...hero, 
                features: { 
                  ...hero.features, 
                  feature3: { ...hero.features?.feature3, description: e.target.value } 
                } 
              })}
            />
          </div>
        </div>
      </div>
      <SettingsPreview title="Hero Section Preview">
        <div className="rounded-xl bg-gradient-to-b from-slate-900 to-slate-800 px-5 py-6 text-white shadow-sm">
          <div className="text-center space-y-3">
            <p className="text-[10px] tracking-[0.18em] uppercase text-white/60">
              Hero Heading
            </p>
            <p
              className="text-2xl md:text-3xl font-bold tracking-[0.18em]"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {hero.title || "ANTIQUE NEPAL"}
            </p>
            <p className="text-base md:text-lg font-light">
              {hero.subtitle ||
                "Handcrafted Hemp Bags Woven with Himalayan Heritage"}
            </p>
            <p className="text-sm text-white/80 max-w-2xl mx-auto">
              {hero.description ||
                "Every bag tells a story. Crafted by master artisans using centuries-old techniques, sustainable hemp, and adorned with traditional Nepali paper art."}
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3 text-left text-xs">
            <div className="rounded-lg bg-white/5 border border-white/15 px-3 py-3">
              <div className="text-sm font-semibold text-white">
                {hero.features?.feature1?.title || "100% Eco-Friendly"}
              </div>
              <div className="text-xs text-white/80">
                {hero.features?.feature1?.description || "Sustainable hemp fiber"}
              </div>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/15 px-3 py-3">
              <div className="text-sm font-semibold text-white">
                {hero.features?.feature2?.title || "Fair Trade"}
              </div>
              <div className="text-xs text-white/80">
                {hero.features?.feature2?.description || "Supporting local artisans"}
              </div>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/15 px-3 py-3">
              <div className="text-sm font-semibold text-white">
                {hero.features?.feature3?.title || "Quality Crafted"}
              </div>
              <div className="text-xs text-white/80">
                {hero.features?.feature3?.description || "15+ years tradition"}
              </div>
            </div>
          </div>
        </div>
      </SettingsPreview>
    </Card>

    <ConfirmationDialog
      open={showConfirm}
      onOpenChange={setShowConfirm}
      onConfirm={handleSave}
      title="Save Hero Section?"
      description="This will update the hero title, subtitle, description, and feature highlights on your homepage."
      confirmText="Save Changes"
    />
  </>
  );
}
