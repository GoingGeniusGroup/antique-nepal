import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Mail, Phone, MapPin, Bell, Plus, Trash2, Link as LinkIcon, List, Save, Building2, Share2, ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";

type FooterData = {
  brand?: {
    id?: string;
    name: string;
    logo: string;
    tagline: string;
    description: string;
  } | null;
  socials?: Array<{
    id?: string;
    name: string;
    icon: string;
    href: string;
    displayOrder: number;
  }>;
  contact?: {
    id?: string;
    email: string;
    phone: string;
    address: string;
  } | null;
  newsletter?: {
    id?: string;
    title: string;
    description: string;
  } | null;
  sections?: Array<{
    id?: string;
    title: string;
    displayOrder: number;
    links: Array<{
      id?: string;
      name: string;
      href: string;
      displayOrder: number;
    }>;
  }>;
};

type Props = {
  footer: FooterData;
  onChange: (footer: FooterData) => void;
};

export function FooterSettingsCardNew({ footer, onChange }: Props) {
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'social' | 'section' | 'link';
    index: number;
    linkIndex?: number;
  } | null>(null);
  const [originalData, setOriginalData] = useState<FooterData | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<{
    brand: boolean;
    contact: boolean;
    socials: boolean;
    newsletter: boolean;
    sections: boolean;
  }>({
    brand: false,
    contact: false,
    socials: false,
    newsletter: false,
    sections: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/footer", { cache: "no-store" });
        const data = await res.json();
        onChange(data);
        setOriginalData(JSON.parse(JSON.stringify(data))); // Deep clone
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateBrand = (field: string, value: string) => {
    onChange({
      ...footer,
      brand: {
        ...footer.brand,
        [field]: value,
      } as any,
    });
  };

  const updateContact = (field: string, value: string) => {
    onChange({
      ...footer,
      contact: {
        ...footer.contact,
        [field]: value,
      } as any,
    });
  };

  const updateNewsletter = (field: string, value: string) => {
    onChange({
      ...footer,
      newsletter: {
        ...footer.newsletter,
        [field]: value,
      } as any,
    });
  };

  const addSocial = () => {
    const newSocial = {
      name: "",
      icon: "",
      href: "",
      displayOrder: (footer.socials?.length || 0),
    };
    onChange({
      ...footer,
      socials: [...(footer.socials || []), newSocial],
    });
  };

  const updateSocial = (index: number, field: string, value: string | number) => {
    const updatedSocials = [...(footer.socials || [])];
    updatedSocials[index] = {
      ...updatedSocials[index],
      [field]: value,
    };
    onChange({
      ...footer,
      socials: updatedSocials,
    });
  };

  const removeSocial = (index: number) => {
    const updatedSocials = footer.socials?.filter((_, i) => i !== index) || [];
    onChange({
      ...footer,
      socials: updatedSocials,
    });
    setDeleteConfirm(null);
  };

  // Section management functions
  const addSection = () => {
    const newSection = {
      title: "",
      displayOrder: footer.sections?.length || 0,
      links: [],
    };
    onChange({
      ...footer,
      sections: [...(footer.sections || []), newSection],
    });
  };

  const updateSection = (index: number, field: string, value: string | number) => {
    const updatedSections = [...(footer.sections || [])];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    };
    onChange({
      ...footer,
      sections: updatedSections,
    });
  };

  const removeSection = (index: number) => {
    const updatedSections = footer.sections?.filter((_, i) => i !== index) || [];
    onChange({
      ...footer,
      sections: updatedSections,
    });
    setDeleteConfirm(null);
  };

  const addLink = (sectionIndex: number) => {
    const updatedSections = [...(footer.sections || [])];
    const section = updatedSections[sectionIndex];
    const newLink = {
      name: "",
      href: "",
      displayOrder: section.links.length,
    };
    section.links = [...section.links, newLink];
    onChange({
      ...footer,
      sections: updatedSections,
    });
  };

  const updateLink = (sectionIndex: number, linkIndex: number, field: string, value: string | number) => {
    const updatedSections = [...(footer.sections || [])];
    updatedSections[sectionIndex].links[linkIndex] = {
      ...updatedSections[sectionIndex].links[linkIndex],
      [field]: value,
    };
    onChange({
      ...footer,
      sections: updatedSections,
    });
  };

  const removeLink = (sectionIndex: number, linkIndex: number) => {
    const updatedSections = [...(footer.sections || [])];
    updatedSections[sectionIndex].links = updatedSections[sectionIndex].links.filter((_, i) => i !== linkIndex);
    onChange({
      ...footer,
      sections: updatedSections,
    });
    setDeleteConfirm(null);
  };

  const hasChanged = (section: string) => {
    if (!originalData) return true;
    return JSON.stringify(footer[section as keyof FooterData]) !== JSON.stringify(originalData[section as keyof FooterData]);
  };

  const saveFooter = async () => {
    setSaving(true);
    try {
      const results = [];

      // Save brand (only if changed)
      if (footer.brand && footer.brand.name && hasChanged('brand')) {
        const res = await fetch("/api/admin/footer-brand", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(footer.brand),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(`Brand save failed: ${error.error || res.statusText}`);
        }
        results.push("Brand");
      }

      // Save contact (only if changed)
      if (footer.contact && (footer.contact.email || footer.contact.phone || footer.contact.address) && hasChanged('contact')) {
        const res = await fetch("/api/admin/footer-contact", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(footer.contact),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(`Contact save failed: ${error.error || res.statusText}`);
        }
        results.push("Contact");
      }

      // Save newsletter (only if changed)
      if (footer.newsletter && (footer.newsletter.title || footer.newsletter.description) && hasChanged('newsletter')) {
        const res = await fetch("/api/admin/footer-newsletter", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(footer.newsletter),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(`Newsletter save failed: ${error.error || res.statusText}`);
        }
        results.push("Newsletter");
      }

      // Save socials (batch, only if changed)
      if (footer.socials && footer.socials.length > 0 && hasChanged('socials')) {
        const res = await fetch("/api/admin/footer-social", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(footer.socials),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(`Socials save failed: ${error.error || res.statusText}`);
        }
        results.push("Socials");
      }

      // Save sections (batch, only if changed)
      if (footer.sections && footer.sections.length > 0 && hasChanged('sections')) {
        const res = await fetch("/api/admin/footer-sections", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(footer.sections),
        });
        if (!res.ok) {
          const error = await res.json();
          throw new Error(`Sections save failed: ${error.error || res.statusText}`);
        }
        results.push("Sections");
      }

      if (results.length > 0) {
        let message = "";
        
        if (results.length === 1) {
          // Single section updated
          const sectionName = results[0];
          message = `${sectionName} information saved successfully!`;
        } else if (results.length === 2) {
          // Two sections updated
          message = `${results[0]} and ${results[1]} saved successfully!`;
        } else {
          // Multiple sections updated
          const lastItem = results.pop();
          message = `${results.join(", ")}, and ${lastItem} saved successfully!`;
        }
        
        toast.success(message, {
          duration: 4000,
          position: "bottom-right",
          style: {
            fontSize: '14px',
            fontWeight: '500',
          },
        });
        
        // Update original data to reflect saved changes
        const res = await fetch("/api/footer", { cache: "no-store" });
        const updatedData = await res.json();
        onChange(updatedData);
        setOriginalData(JSON.parse(JSON.stringify(updatedData)));
      } else {
        toast.error("⚠️ No changes detected. Please update at least one field before saving.", {
          duration: 3000,
          position: "bottom-right",
          style: {
            fontSize: '14px',
          },
        });
      }
    } catch (error) {
      console.error("Error saving footer:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`❌ Save failed: ${errorMessage}. Please try again.`, {
        duration: 5000,
        position: "bottom-right",
        style: {
          fontSize: '14px',
        },
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 border-l-4 border-l-purple-500 dark:border-l-purple-400 dark:!bg-slate-800 dark:!border-slate-600">
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
      <Card className="p-6 border-l-4 border-l-purple-500 dark:border-l-purple-400 dark:!bg-slate-800 dark:!border-slate-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <div className="text-lg font-semibold text-foreground">Footer Content</div>
          </div>
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={saving || loading}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      
      {/* Brand Section */}
      <div className="mb-6">
        <button
          onClick={() => setCollapsedSections(prev => ({ ...prev, brand: !prev.brand }))}
          className="w-full text-md font-semibold text-foreground mb-4 flex items-center justify-between gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Brand Information
          </div>
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-200 ${collapsedSections.brand ? 'rotate-180' : ''}`} 
          />
        </button>
        {!collapsedSections.brand && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="footerBrandName" className="text-sm font-medium text-muted-foreground">Brand Name</Label>
            <Input
              id="footerBrandName"
              placeholder="Antique Nepal"
              className="mt-2"
              value={footer.brand?.name || ""}
              onChange={(e) => updateBrand("name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="footerLogo" className="text-sm font-medium text-muted-foreground">Logo URL</Label>
            <Input
              id="footerLogo"
              placeholder="/logo/logo.png"
              className="mt-2"
              value={footer.brand?.logo || ""}
              onChange={(e) => updateBrand("logo", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="footerTagline" className="text-sm font-medium text-muted-foreground">Tagline</Label>
            <Input
              id="footerTagline"
              placeholder="Handcrafted Heritage"
              className="mt-2"
              value={footer.brand?.tagline || ""}
              onChange={(e) => updateBrand("tagline", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="footerDescription" className="text-sm font-medium text-muted-foreground">Description</Label>
            <Textarea
              id="footerDescription"
              placeholder="Preserving centuries of Nepalese craftsmanship..."
              className="mt-2 min-h-[80px]"
              value={footer.brand?.description || ""}
              onChange={(e) => updateBrand("description", e.target.value)}
            />
          </div>
        </div>
      )}
      </div>

      {/* Contact Section */}
      <div className="mb-6 pt-6 border-t border-border">
        <button
          onClick={() => setCollapsedSections(prev => ({ ...prev, contact: !prev.contact }))}
          className="w-full text-md font-semibold text-foreground mb-4 flex items-center justify-between gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Contact Information
          </div>
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-200 ${collapsedSections.contact ? 'rotate-180' : ''}`} 
          />
        </button>
        {!collapsedSections.contact && (
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="footerEmail" className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              Email
            </Label>
            <Input
              id="footerEmail"
              type="email"
              placeholder="hello@antiquenepal.com"
              className="mt-2"
              value={footer.contact?.email || ""}
              onChange={(e) => updateContact("email", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="footerPhone" className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3" />
              Phone
            </Label>
            <Input
              id="footerPhone"
              placeholder="+977 1 234 5678"
              className="mt-2"
              value={footer.contact?.phone || ""}
              onChange={(e) => updateContact("phone", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="footerAddress" className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Address
            </Label>
            <Input
              id="footerAddress"
              placeholder="Thamel, Kathmandu, Nepal"
              className="mt-2"
              value={footer.contact?.address || ""}
              onChange={(e) => updateContact("address", e.target.value)}
            />
          </div>
        </div>
      )}
      </div>

      {/* Social Media Links */}
      <div className="mb-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCollapsedSections(prev => ({ ...prev, socials: !prev.socials }))}
            className="flex-1 text-md font-semibold text-foreground flex items-center justify-between gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Social Media Links
            </div>
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${collapsedSections.socials ? 'rotate-180' : ''}`} 
            />
          </button>
          <Button
            onClick={addSocial}
            size="sm"
            variant="outline"
            className="flex items-center gap-2 ml-4"
          >
            <Plus className="h-4 w-4" />
            Add Social
          </Button>
        </div>
        {!collapsedSections.socials && (
        <div className="space-y-4">
          {footer.socials?.map((social, index) => (
            <div key={index} className="grid gap-4 md:grid-cols-4 items-end p-4 border border-border rounded-lg">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                <Input
                  placeholder="Facebook"
                  className="mt-2"
                  value={social.name}
                  onChange={(e) => updateSocial(index, "name", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Icon</Label>
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
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-muted-foreground">Order</Label>
                  <Input
                    type="number"
                    className="mt-2"
                    value={social.displayOrder}
                    onChange={(e) => updateSocial(index, "displayOrder", parseInt(e.target.value) || 0)}
                  />
                </div>
                <Button
                  onClick={() => setDeleteConfirm({ type: 'social', index })}
                  size="sm"
                  variant="destructive"
                  className="mt-7"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {(!footer.socials || footer.socials.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No social links added yet. Click "Add Social" to create one.
            </p>
          )}
        </div>
      )}
      </div>

      {/* Newsletter Section */}
      <div className="pt-6">
        <button
          onClick={() => setCollapsedSections(prev => ({ ...prev, newsletter: !prev.newsletter }))}
          className="w-full text-md font-semibold text-foreground mb-4 flex items-center justify-between gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Newsletter Section
          </div>
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-200 ${collapsedSections.newsletter ? 'rotate-180' : ''}`} 
          />
        </button>
        {!collapsedSections.newsletter && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="newsletterTitle" className="text-sm font-medium text-muted-foreground">Newsletter Title</Label>
            <Input
              id="newsletterTitle"
              placeholder="Join Our Community"
              className="mt-2"
              value={footer.newsletter?.title || ""}
              onChange={(e) => updateNewsletter("title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="newsletterDescription" className="text-sm font-medium text-muted-foreground">Newsletter Description</Label>
            <Input
              id="newsletterDescription"
              placeholder="Subscribe to receive updates..."
              className="mt-2"
              value={footer.newsletter?.description || ""}
              onChange={(e) => updateNewsletter("description", e.target.value)}
            />
          </div>
        </div>
      )}
      </div>

      {/* Footer Sections & Links */}
      <div className="pt-6 mt-6 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCollapsedSections(prev => ({ ...prev, sections: !prev.sections }))}
            className="flex-1 text-md font-semibold text-foreground flex items-center justify-between gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Navigation Sections & Links
            </div>
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${collapsedSections.sections ? 'rotate-180' : ''}`} 
            />
          </button>
          <Button
            onClick={addSection}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        </div>
        
        {!collapsedSections.sections && (
        <div className="space-y-6">
          {footer.sections?.map((section, sectionIndex) => (
            <div key={sectionIndex} className="p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 grid gap-4 md:grid-cols-3">
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
                <Button
                  onClick={() => setDeleteConfirm({ type: 'section', index: sectionIndex })}
                  size="sm"
                  variant="destructive"
                  className="mt-7"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Links for this section */}
              <div className="ml-4 space-y-3">
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
                  <div key={linkIndex} className="grid gap-3 md:grid-cols-4 items-end p-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded">
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
                        onClick={() => setDeleteConfirm({ type: 'link', index: sectionIndex, linkIndex })}
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-3 bg-slate-50 dark:bg-slate-900/20 border border-dashed border-slate-300 dark:border-slate-700 rounded">
                    No links yet. Click "Add Link" to create one.
                  </p>
                )}
              </div>
            </div>
          ))}

          {(!footer.sections || footer.sections.length === 0) && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8 bg-slate-50 dark:bg-slate-900/20 border border-dashed border-slate-300 dark:border-slate-700 rounded">
              No sections added yet. Click "Add Section" to create navigation sections like Shop, Company, Legal, etc.
            </p>
          )}
        </div>
      )}
      </div>
    </Card>

    <ConfirmationDialog
      open={showConfirm}
      onOpenChange={setShowConfirm}
      onConfirm={saveFooter}
      title="Save Footer Settings?"
      description="This will update all footer content including brand, contact, social links, and navigation sections."
      confirmText="Save Changes"
    />

    <ConfirmationDialog
      open={deleteConfirm !== null}
      onOpenChange={(open) => !open && setDeleteConfirm(null)}
      onConfirm={() => {
        if (deleteConfirm) {
          if (deleteConfirm.type === 'social') {
            removeSocial(deleteConfirm.index);
          } else if (deleteConfirm.type === 'section') {
            removeSection(deleteConfirm.index);
          } else if (deleteConfirm.type === 'link' && deleteConfirm.linkIndex !== undefined) {
            removeLink(deleteConfirm.index, deleteConfirm.linkIndex);
          }
        }
      }}
      title="Delete Item?"
      description={`Are you sure you want to delete this ${deleteConfirm?.type === 'social' ? 'social link' : deleteConfirm?.type === 'section' ? 'section and all its links' : 'link'}? This action cannot be undone.`}
      confirmText="Delete"
      variant="destructive"
    />
  </>
  );
}
