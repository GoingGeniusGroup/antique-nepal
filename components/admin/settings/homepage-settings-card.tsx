"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Star, Package, Save } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";

type HomepageData = {
  featuredTitle?: string;
  featuredSubtitle?: string;
  featuredDescription?: string;
  productHighlights?: {
    title?: string;
    subtitle?: string;
    featuredProductIds?: string[];
  };
};

type Props = {
  homepage: HomepageData;
  onChange: (homepage: HomepageData) => void;
};

export function HomepageSettingsCard({ homepage, onChange }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/site-settings", { cache: "no-store" });
        const data = await res.json();
        if (data.homepage) {
          onChange(data.homepage);
        }
      } catch (error) {
        console.error("Error fetching homepage settings:", error);
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
        body: JSON.stringify({ homepage }),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Homepage settings saved successfully!", {
        duration: 3000,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error saving homepage settings:", error);
      toast.error("Failed to save homepage settings", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 border-l-4 border-l-amber-500 dark:border-l-amber-400 dark:!bg-slate-800 dark:!border-slate-600">
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
      <Card className="p-6 border-l-4 border-l-amber-500 dark:border-l-amber-400 dark:!bg-slate-800 dark:!border-slate-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-600" />
            <div className="text-lg font-semibold text-foreground">Homepage Settings</div>
          </div>
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={saving || loading}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-amber-500 rounded"></span>
          Featured Section
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="featuredTitle" className="text-sm font-medium text-muted-foreground">Featured Title</Label>
            <Input
              id="featuredTitle"
              placeholder="Featured Collections"
              className="mt-2"
              value={homepage.featuredTitle || ""}
              onChange={(e) => onChange({ ...homepage, featuredTitle: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="featuredSubtitle" className="text-sm font-medium text-muted-foreground">Featured Subtitle</Label>
            <Input
              id="featuredSubtitle"
              placeholder="Discover Our Best Sellers"
              className="mt-2"
              value={homepage.featuredSubtitle || ""}
              onChange={(e) => onChange({ ...homepage, featuredSubtitle: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="featuredDescription" className="text-sm font-medium text-muted-foreground">Featured Description</Label>
            <Input
              id="featuredDescription"
              placeholder="Explore our handpicked selection of premium hemp bags..."
              className="mt-2"
              value={homepage.featuredDescription || ""}
              onChange={(e) => onChange({ ...homepage, featuredDescription: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-600" />
            Product Highlights
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="highlightsTitle" className="text-sm font-medium text-muted-foreground">Highlights Title</Label>
              <Input
                id="highlightsTitle"
                placeholder="Why Choose Our Products"
                className="mt-2"
                value={homepage.productHighlights?.title || ""}
                onChange={(e) => onChange({ 
                  ...homepage, 
                  productHighlights: { 
                    ...homepage.productHighlights, 
                    title: e.target.value 
                  } 
                })}
              />
            </div>
            <div>
              <Label htmlFor="highlightsSubtitle" className="text-sm font-medium text-muted-foreground">Highlights Subtitle</Label>
              <Input
                id="highlightsSubtitle"
                placeholder="Premium Quality & Sustainable"
                className="mt-2"
                value={homepage.productHighlights?.subtitle || ""}
                onChange={(e) => onChange({ 
                  ...homepage, 
                  productHighlights: { 
                    ...homepage.productHighlights, 
                    subtitle: e.target.value 
                  } 
                })}
              />
            </div>
          </div>
        </div>
      </Card>

      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleSave}
        title="Save Homepage Settings?"
        description="This will update the featured section and product highlights on your homepage."
        confirmText="Save Changes"
      />
    </>
  );
}
