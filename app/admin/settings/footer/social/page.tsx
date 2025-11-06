"use client";

import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Share2, Plus, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";

type Social = {
  id?: string;
  name: string;
  icon: string;
  href: string;
  displayOrder: number;
};

export default function FooterSocialPage() {
  const [socials, setSocials] = useState<Social[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setCollapsedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const collapseAll = () => {
    setCollapsedItems(new Set(socials.map((_, i) => i)));
  };

  const expandAll = () => {
    setCollapsedItems(new Set());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/footer", { cache: "no-store" });
        const data = await res.json();
        if (data.socials) {
          setSocials(data.socials);
        }
      } catch (error) {
        console.error("Error fetching social data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addSocial = () => {
    setSocials([
      ...socials,
      {
        name: "",
        icon: "",
        href: "",
        displayOrder: socials.length,
      },
    ]);
  };

  const updateSocial = (index: number, field: keyof Social, value: string | number) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], [field]: value };
    setSocials(updated);
  };

  const removeSocial = (index: number) => {
    const socialName = socials[index].name || "Social link";
    setSocials(socials.filter((_, i) => i !== index));
    setDeleteConfirm(null);
    toast.success(`${socialName} removed. Click "Save All" to apply changes.`, {
      duration: 3000,
      position: "bottom-right",
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/footer-social", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(socials),
      });

      if (!res.ok) {
        throw new Error("Failed to save social media links");
      }

      // Refetch to get updated data with IDs
      const refetchRes = await fetch("/api/footer", { cache: "no-store" });
      const data = await refetchRes.json();
      if (data.socials) {
        setSocials(data.socials);
      }

      toast.success("Social media links saved successfully!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error saving socials:", error);
      toast.error("Failed to save social media links", {
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
          <PageHeader title="Footer Social Media Links" />
          <p className="text-sm text-muted-foreground mt-2">
            Manage social media links displayed in the footer section.
          </p>
        </div>

        <Card className="p-6 border-l-4 border-l-pink-500 dark:border-l-pink-400 dark:!bg-slate-800 dark:!border-slate-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              <div className="text-lg font-semibold text-foreground">Social Links</div>
              {socials.length > 0 && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {socials.length} {socials.length === 1 ? 'link' : 'links'}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {socials.length > 2 && (
                <>
                  <Button
                    onClick={expandAll}
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                  >
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Expand All
                  </Button>
                  <Button
                    onClick={collapseAll}
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                  >
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Collapse All
                  </Button>
                </>
              )}
              <Button
                onClick={addSocial}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
              <Button
                onClick={() => setShowConfirm(true)}
                disabled={saving}
                size="sm"
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save All"}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {socials.map((social, index) => {
              const isCollapsed = collapsedItems.has(index);
              
              return (
              <div
                key={index}
                className="border-2 border-border rounded-lg bg-muted/20 overflow-hidden"
              >
                {/* Collapsible Header */}
                <div className="flex items-center justify-between p-3 bg-muted/40 hover:bg-muted/60 transition-colors">
                  <button
                    onClick={() => toggleItem(index)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-pink-100 dark:bg-pink-900/30">
                      {isCollapsed ? (
                        <ChevronDown className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                      ) : (
                        <ChevronUp className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">
                        {social.name || `Social Link ${index + 1}`}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
                        {social.href || 'No URL set'} • Order: {social.displayOrder}
                      </div>
                    </div>
                  </button>
                  <Button
                    onClick={() => setDeleteConfirm(index)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Collapsible Content */}
                {!isCollapsed && (
                  <div className="p-4">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Platform Name</Label>
                        <Input
                          placeholder="Facebook"
                          className="mt-2"
                          value={social.name}
                          onChange={(e) => updateSocial(index, "name", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Icon Name</Label>
                        <Input
                          placeholder="Facebook"
                          className="mt-2"
                          value={social.icon}
                          onChange={(e) => updateSocial(index, "icon", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">URL</Label>
                        <Input
                          placeholder="https://facebook.com/..."
                          className="mt-2"
                          value={social.href}
                          onChange={(e) => updateSocial(index, "href", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Display Order</Label>
                        <Input
                          type="number"
                          className="mt-2"
                          value={social.displayOrder}
                          onChange={(e) => updateSocial(index, "displayOrder", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
            })}

            {socials.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  No social media links added yet.
                </p>
                <Button onClick={addSocial} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Link
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleSave}
        title="Save Social Media Links?"
        description="This will update all social media links displayed in your website footer."
        confirmText="Save Changes"
      />

      <ConfirmationDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm !== null && removeSocial(deleteConfirm)}
        title="Delete Social Link?"
        description="Are you sure you want to delete this social media link? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </PageTransition>
  );
}
