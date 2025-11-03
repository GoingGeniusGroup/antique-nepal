"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { Save, Settings, Globe, Type, Image, FileText, Star, Package } from "lucide-react";

/**
 * Site Settings Management Page
 * 
 * Features:
 * - General site configuration (name, logo)
 * - Hero section content management
 * - Banner text configuration
 * - Footer content management
 * - Real-time preview and save functionality
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
  footer: { text?: string };
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
  const [saving, setSaving] = useState(false);

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

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <PageHeader title="Site Settings" />
        <Button 
          onClick={save} 
          disabled={saving || loading}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {loading ? (
        <div className="flex h-[30vh] items-center justify-center text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"/> Loading...</span>
        </div>
      ) : (
        <>
          <Card className="p-6 border-l-4 border-l-blue-500 dark:!bg-slate-800 dark:!border-slate-600">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-blue-600" />
              <div className="text-lg font-semibold text-foreground">General Settings</div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="siteName" className="text-sm font-medium text-muted-foreground">Site Name</Label>
                <Input
                  id="siteName"
                  placeholder="Antique Nepal"
                  className="mt-2"
                  value={settings.general.siteName || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, general: { ...s.general, siteName: e.target.value } }))}
                />
              </div>
              <div>
                <Label htmlFor="logo" className="text-sm font-medium text-muted-foreground">Logo URL</Label>
                <Input
                  id="logo"
                  placeholder="https://example.com/logo.png"
                  className="mt-2"
                  value={settings.general.logo || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, general: { ...s.general, logo: e.target.value } }))}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-500 dark:!bg-slate-800 dark:!border-slate-600">
            <div className="flex items-center gap-2 mb-4">
              <Type className="h-5 w-5 text-green-600" />
              <div className="text-lg font-semibold text-foreground">Hero Section</div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="heroTitle" className="text-sm font-medium text-muted-foreground">Hero Title</Label>
                <Input
                  id="heroTitle"
                  placeholder="ANTIQUE NEPAL"
                  className="mt-2"
                  value={settings.hero.title || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, hero: { ...s.hero, title: e.target.value } }))}
                />
              </div>
              <div>
                <Label htmlFor="heroSubtitle" className="text-sm font-medium text-muted-foreground">Hero Subtitle</Label>
                <Input
                  id="heroSubtitle"
                  placeholder="Welcome to best website"
                  className="mt-2"
                  value={settings.hero.subtitle || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, hero: { ...s.hero, subtitle: e.target.value } }))}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="heroDescription" className="text-sm font-medium text-muted-foreground">Hero Description</Label>
                <Input
                  id="heroDescription"
                  placeholder="Every bag tells a story. Crafted by master artisans using centuries-old techniques..."
                  className="mt-2"
                  value={settings.hero.description || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, hero: { ...s.hero, description: e.target.value } }))}
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
                    value={settings.hero.features?.feature1?.title || ""}
                    onChange={(e) => setSettings((s) => ({ 
                      ...s, 
                      hero: { 
                        ...s.hero, 
                        features: { 
                          ...s.hero.features, 
                          feature1: { ...s.hero.features?.feature1, title: e.target.value } 
                        } 
                      } 
                    }))}
                  />
                  <Input
                    placeholder="Sustainable hemp fiber"
                    className="mt-1"
                    value={settings.hero.features?.feature1?.description || ""}
                    onChange={(e) => setSettings((s) => ({ 
                      ...s, 
                      hero: { 
                        ...s.hero, 
                        features: { 
                          ...s.hero.features, 
                          feature1: { ...s.hero.features?.feature1, description: e.target.value } 
                        } 
                      } 
                    }))}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Feature 2 Title</Label>
                  <Input
                    placeholder="Fair Trade"
                    className="mt-2 mb-2"
                    value={settings.hero.features?.feature2?.title || ""}
                    onChange={(e) => setSettings((s) => ({ 
                      ...s, 
                      hero: { 
                        ...s.hero, 
                        features: { 
                          ...s.hero.features, 
                          feature2: { ...s.hero.features?.feature2, title: e.target.value } 
                        } 
                      } 
                    }))}
                  />
                  <Input
                    placeholder="Supporting local artisans"
                    className="mt-1"
                    value={settings.hero.features?.feature2?.description || ""}
                    onChange={(e) => setSettings((s) => ({ 
                      ...s, 
                      hero: { 
                        ...s.hero, 
                        features: { 
                          ...s.hero.features, 
                          feature2: { ...s.hero.features?.feature2, description: e.target.value } 
                        } 
                      } 
                    }))}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Feature 3 Title</Label>
                  <Input
                    placeholder="Quality Crafted"
                    className="mt-2 mb-2"
                    value={settings.hero.features?.feature3?.title || ""}
                    onChange={(e) => setSettings((s) => ({ 
                      ...s, 
                      hero: { 
                        ...s.hero, 
                        features: { 
                          ...s.hero.features, 
                          feature3: { ...s.hero.features?.feature3, title: e.target.value } 
                        } 
                      } 
                    }))}
                  />
                  <Input
                    placeholder="15+ years tradition"
                    className="mt-1"
                    value={settings.hero.features?.feature3?.description || ""}
                    onChange={(e) => setSettings((s) => ({ 
                      ...s, 
                      hero: { 
                        ...s.hero, 
                        features: { 
                          ...s.hero.features, 
                          feature3: { ...s.hero.features?.feature3, description: e.target.value } 
                        } 
                      } 
                    }))}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-primary dark:!bg-slate-800 dark:!border-slate-600">
            <div className="flex items-center gap-2 mb-4">
              <Image className="h-5 w-5 text-primary" />
              <div className="text-lg font-semibold text-foreground">Banner Configuration</div>
            </div>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="bannerText" className="text-sm font-medium text-muted-foreground">Banner Text</Label>
                <Input
                  id="bannerText"
                  placeholder="Limited-time offers on handcrafted items..."
                  className="mt-2"
                  value={settings.banner.text || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, banner: { ...s.banner, text: e.target.value } }))}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-amber-500 dark:!bg-slate-800 dark:!border-slate-600">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-amber-600" />
              <div className="text-lg font-semibold text-foreground">Featured Section</div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="featuredTitle" className="text-sm font-medium text-muted-foreground">Featured Title</Label>
                <Input
                  id="featuredTitle"
                  placeholder="Featured Collections"
                  className="mt-2"
                  value={settings.homepage.featuredTitle || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, homepage: { ...s.homepage, featuredTitle: e.target.value } }))}
                />
              </div>
              <div>
                <Label htmlFor="featuredSubtitle" className="text-sm font-medium text-muted-foreground">Featured Subtitle</Label>
                <Input
                  id="featuredSubtitle"
                  placeholder="Discover Our Best Sellers"
                  className="mt-2"
                  value={settings.homepage.featuredSubtitle || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, homepage: { ...s.homepage, featuredSubtitle: e.target.value } }))}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="featuredDescription" className="text-sm font-medium text-muted-foreground">Featured Description</Label>
                <Input
                  id="featuredDescription"
                  placeholder="Explore our handpicked selection of premium hemp bags..."
                  className="mt-2"
                  value={settings.homepage.featuredDescription || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, homepage: { ...s.homepage, featuredDescription: e.target.value } }))}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-purple-500 dark:!bg-slate-800 dark:!border-slate-600">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-purple-600" />
              <div className="text-lg font-semibold text-foreground">Product Highlights</div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="highlightsTitle" className="text-sm font-medium text-muted-foreground">Highlights Title</Label>
                <Input
                  id="highlightsTitle"
                  placeholder="Why Choose Our Products"
                  className="mt-2"
                  value={settings.homepage.productHighlights?.title || ""}
                  onChange={(e) => setSettings((s) => ({ 
                    ...s, 
                    homepage: { 
                      ...s.homepage, 
                      productHighlights: { 
                        ...s.homepage.productHighlights, 
                        title: e.target.value 
                      } 
                    } 
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="highlightsSubtitle" className="text-sm font-medium text-muted-foreground">Highlights Subtitle</Label>
                <Input
                  id="highlightsSubtitle"
                  placeholder="Premium Quality & Sustainable"
                  className="mt-2"
                  value={settings.homepage.productHighlights?.subtitle || ""}
                  onChange={(e) => setSettings((s) => ({ 
                    ...s, 
                    homepage: { 
                      ...s.homepage, 
                      productHighlights: { 
                        ...s.homepage.productHighlights, 
                        subtitle: e.target.value 
                      } 
                    } 
                  }))}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-primary dark:!bg-slate-800 dark:!border-slate-600">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <div className="text-lg font-semibold text-foreground">Footer Content</div>
            </div>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="footerText" className="text-sm font-medium text-muted-foreground">Footer Text</Label>
                <Input
                  id="footerText"
                  placeholder="© 2024 Antique Nepal. All rights reserved."
                  className="mt-2"
                  value={settings.footer.text || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, footer: { ...s.footer, text: e.target.value } }))}
                />
              </div>
            </div>
          </Card>
        </>
      )}
      </div>
    </PageTransition>
  );
}
