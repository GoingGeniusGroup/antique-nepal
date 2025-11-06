"use client";

import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";

export default function FooterNewsletterPage() {
  const [newsletter, setNewsletter] = useState<{
    id?: string;
    title: string;
    description: string;
  }>({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/footer", { cache: "no-store" });
        const data = await res.json();
        if (data.newsletter) {
          setNewsletter(data.newsletter);
        }
      } catch (error) {
        console.error("Error fetching newsletter data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/footer-newsletter", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsletter),
      });

      if (!res.ok) {
        throw new Error("Failed to save newsletter settings");
      }

      toast.success("Newsletter settings saved successfully!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error saving newsletter:", error);
      toast.error("Failed to save newsletter settings", {
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
          <PageHeader title="Footer Newsletter Section" />
          <p className="text-sm text-muted-foreground mt-2">
            Configure the newsletter subscription section in your footer.
          </p>
        </div>

        <Card className="p-6 border-l-4 border-l-amber-500 dark:border-l-amber-400 dark:!bg-slate-800 dark:!border-slate-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div className="text-lg font-semibold text-foreground">Newsletter Settings</div>
            </div>
            <Button
              onClick={() => setShowConfirm(true)}
              disabled={saving}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="newsletterTitle" className="text-sm font-medium text-muted-foreground">
                Section Title
              </Label>
              <Input
                id="newsletterTitle"
                placeholder="Join Our Community"
                className="mt-2"
                value={newsletter.title}
                onChange={(e) => setNewsletter({ ...newsletter, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="newsletterDescription" className="text-sm font-medium text-muted-foreground">
                Description
              </Label>
              <Input
                id="newsletterDescription"
                placeholder="Subscribe to receive updates..."
                className="mt-2"
                value={newsletter.description}
                onChange={(e) => setNewsletter({ ...newsletter, description: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <h4 className="text-sm font-medium text-foreground mb-2">Preview</h4>
            <div className="space-y-2">
              <p className="text-base font-semibold text-foreground">
                {newsletter.title || "Join Our Community"}
              </p>
              <p className="text-sm text-muted-foreground">
                {newsletter.description || "Subscribe to receive updates..."}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleSave}
        title="Save Newsletter Settings?"
        description="This will update the newsletter section displayed in your website footer."
        confirmText="Save Changes"
      />
    </PageTransition>
  );
}
