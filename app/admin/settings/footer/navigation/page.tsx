"use client";

import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { List, Plus, Trash2, Link as LinkIcon, Save, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";

type FooterSection = {
  id?: string;
  title: string;
  displayOrder: number;
  links: Array<{
    id?: string;
    name: string;
    href: string;
    displayOrder: number;
  }>;
};

export default function FooterNavigationPage() {
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'section' | 'link';
    sectionIndex: number;
    linkIndex?: number;
  } | null>(null);

  const toggleSection = (index: number) => {
    setCollapsedSections(prev => {
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
    setCollapsedSections(new Set(sections.map((_, i) => i)));
  };

  const expandAll = () => {
    setCollapsedSections(new Set());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/footer", { cache: "no-store" });
        const data = await res.json();
        if (data.sections) {
          setSections(data.sections);
        }
      } catch (error) {
        console.error("Error fetching sections data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: "",
        displayOrder: sections.length,
        links: [],
      },
    ]);
  };

  const updateSection = (index: number, field: string, value: string | number) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const removeSection = (index: number) => {
    const sectionName = sections[index].title || `Section ${index + 1}`;
    setSections(sections.filter((_, i) => i !== index));
    setDeleteConfirm(null);
    toast.success(`${sectionName} removed. Click "Save All" to apply changes.`, {
      duration: 3000,
      position: "bottom-right",
    });
  };

  const addLink = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].links.push({
      name: "",
      href: "",
      displayOrder: updated[sectionIndex].links.length,
    });
    setSections(updated);
  };

  const updateLink = (sectionIndex: number, linkIndex: number, field: string, value: string | number) => {
    const updated = [...sections];
    updated[sectionIndex].links[linkIndex] = {
      ...updated[sectionIndex].links[linkIndex],
      [field]: value,
    };
    setSections(updated);
  };

  const removeLink = (sectionIndex: number, linkIndex: number) => {
    const updated = [...sections];
    const linkName = updated[sectionIndex].links[linkIndex].name || "Link";
    updated[sectionIndex].links = updated[sectionIndex].links.filter((_, i) => i !== linkIndex);
    setSections(updated);
    setDeleteConfirm(null);
    toast.success(`${linkName} removed. Click "Save All" to apply changes.`, {
      duration: 3000,
      position: "bottom-right",
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/footer-sections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections),
      });

      if (!res.ok) {
        throw new Error("Failed to save navigation sections");
      }

      // Refetch to get updated data with IDs
      const refetchRes = await fetch("/api/footer", { cache: "no-store" });
      const data = await refetchRes.json();
      if (data.sections) {
        setSections(data.sections);
      }

      toast.success("Navigation sections saved successfully!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error saving sections:", error);
      toast.error("Failed to save navigation sections", {
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
          <PageHeader title="Footer Navigation Sections" />
          <p className="text-sm text-muted-foreground mt-2">
            Manage navigation sections and links displayed in your footer (e.g., Shop, Company, Legal).
          </p>
        </div>

        <Card className="p-6 border-l-4 border-l-blue-500 dark:border-l-blue-500 dark:!bg-slate-800 dark:!border-slate-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <List className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div className="text-lg font-semibold text-foreground">Navigation Sections</div>
              {sections.length > 0 && (
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {sections.length} {sections.length === 1 ? 'section' : 'sections'}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {sections.length > 1 && (
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
                onClick={addSection}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
              <Button
                onClick={() => setShowConfirm(true)}
                disabled={saving}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save All"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {sections.map((section, sectionIndex) => {
              const isCollapsed = collapsedSections.has(sectionIndex);
              const linkCount = section.links.length;
              
              return (
              <div
                key={sectionIndex}
                className="border-2 border-border rounded-lg bg-muted/20 overflow-hidden"
              >
                {/* Collapsible Header */}
                <div className="flex items-center justify-between p-4 bg-muted/40 hover:bg-muted/60 transition-colors">
                  <button
                    onClick={() => toggleSection(sectionIndex)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30">
                      {isCollapsed ? (
                        <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <ChevronUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">
                        {section.title || `Section ${sectionIndex + 1}`}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {linkCount} {linkCount === 1 ? 'link' : 'links'} • Order: {section.displayOrder}
                      </div>
                    </div>
                  </button>
                  <Button
                    onClick={() => setDeleteConfirm({ type: 'section', sectionIndex })}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Collapsible Content */}
                {!isCollapsed && (
                  <div className="p-5">
                    {/* Section Details */}
                    <div className="grid gap-4 md:grid-cols-3 mb-6">
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-muted-foreground">Section Title</Label>
                        <Input
                          placeholder="e.g., Shop, Company, Legal"
                          className="mt-2"
                          value={section.title}
                          onChange={(e) => updateSection(sectionIndex, "title", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Display Order</Label>
                        <Input
                          type="number"
                          className="mt-2"
                          value={section.displayOrder}
                          onChange={(e) => updateSection(sectionIndex, "displayOrder", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <LinkIcon className="h-3 w-3" />
                      Links in {section.title || "this section"}
                    </Label>
                    <Button
                      onClick={() => addLink(sectionIndex)}
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Link
                    </Button>
                  </div>

                  {section.links.map((link, linkIndex) => (
                    <div
                      key={linkIndex}
                      className="grid gap-3 md:grid-cols-4 items-end p-3 bg-background border border-border rounded"
                    >
                      <div>
                        <Label className="text-xs text-muted-foreground">Link Name</Label>
                        <Input
                          placeholder="e.g., All Products"
                          className="mt-1 h-9 text-sm"
                          value={link.name}
                          onChange={(e) => updateLink(sectionIndex, linkIndex, "name", e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-xs text-muted-foreground">Link URL</Label>
                        <Input
                          placeholder="e.g., /products"
                          className="mt-1 h-9 text-sm"
                          value={link.href}
                          onChange={(e) => updateLink(sectionIndex, linkIndex, "href", e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label className="text-xs text-muted-foreground">Order</Label>
                          <Input
                            type="number"
                            className="mt-1 h-9 text-sm"
                            value={link.displayOrder}
                            onChange={(e) => updateLink(sectionIndex, linkIndex, "displayOrder", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <Button
                          onClick={() => setDeleteConfirm({ type: 'link', sectionIndex, linkIndex })}
                          size="sm"
                          variant="ghost"
                          className="h-9 w-9 p-0 mt-5"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {section.links.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4 bg-muted/30 border border-dashed border-border rounded">
                      No links yet. Click "Add Link" to create one.
                    </p>
                  )}
                </div>
                  </div>
                )}
              </div>
            );
            })}

            {sections.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <List className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  No navigation sections added yet.
                </p>
                <Button onClick={addSection} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Section
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
        title="Save Navigation Sections?"
        description="This will update all navigation sections and links displayed in your website footer."
        confirmText="Save Changes"
      />

      <ConfirmationDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            if (deleteConfirm.type === 'section') {
              removeSection(deleteConfirm.sectionIndex);
            } else if (deleteConfirm.linkIndex !== undefined) {
              removeLink(deleteConfirm.sectionIndex, deleteConfirm.linkIndex);
            }
          }
        }}
        title={`Delete ${deleteConfirm?.type === 'section' ? 'Section' : 'Link'}?`}
        description={`Are you sure you want to delete this ${deleteConfirm?.type === 'section' ? 'section and all its links' : 'link'}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />
    </PageTransition>
  );
}
