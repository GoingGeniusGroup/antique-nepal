"use client";

import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";

export default function FooterBrandPage() {
  const [brand, setBrand] = useState<{
    id?: string;
    name: string;
    logo: string;
    tagline: string;
    description: string;
  }>({ name: "", logo: "", tagline: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/footer", { cache: "no-store" });
        const data = await res.json();
        if (data.brand) {
          setBrand(data.brand);
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/footer-brand", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brand),
      });

      if (!res.ok) {
        throw new Error("Failed to save brand information");
      }

      toast.success("Brand information saved successfully!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error saving brand:", error);
      toast.error("Failed to save brand information", {
        duration: 3000,
        position: "bottom-right",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex h-[50vh] items-center justify-center">
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"/> 
            Loading...
          </span>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <PageHeader title="Footer Brand Information" />
          <p className="text-sm text-muted-foreground mt-2">
            Configure your brand identity displayed in the footer section.
          </p>
        </div>

        <Card className="p-6 border-l-4 border-l-blue-500 dark:border-l-blue-500 dark:!bg-slate-800 dark:!border-slate-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div className="text-lg font-semibold text-foreground">Brand Details</div>
            </div>
            <Button
              onClick={() => setShowConfirm(true)}
              disabled={saving}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="brandName" className="text-sm font-medium text-muted-foreground">
                Brand Name
              </Label>
              <Input
                id="brandName"
                placeholder="Antique Nepal"
                className="mt-2"
                value={brand.name}
                onChange={(e) => setBrand({ ...brand, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="brandLogo" className="text-sm font-medium text-muted-foreground">
                Logo URL
              </Label>
              <Input
                id="brandLogo"
                placeholder="/logo/logo.png"
                className="mt-2"
                value={brand.logo}
                onChange={(e) => setBrand({ ...brand, logo: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="brandTagline" className="text-sm font-medium text-muted-foreground">
                Tagline
              </Label>
              <Input
                id="brandTagline"
                placeholder="Handcrafted Heritage"
                className="mt-2"
                value={brand.tagline}
                onChange={(e) => setBrand({ ...brand, tagline: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="brandDescription" className="text-sm font-medium text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="brandDescription"
                placeholder="Preserving centuries of Nepalese craftsmanship..."
                className="mt-2 min-h-[100px]"
                value={brand.description}
                onChange={(e) => setBrand({ ...brand, description: e.target.value })}
              />
            </div>
          </div>
        </Card>
      </div>

      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleSave}
        title="Save Brand Information?"
        description="This will update the brand information displayed in your website footer."
        confirmText="Save Changes"
      />
    </PageTransition>
  );
}
