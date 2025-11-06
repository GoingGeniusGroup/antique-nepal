"use client";

import { PageHeader } from "@/components/admin/page-header";
import { PageTransition } from "@/components/admin/page-transition";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";

export default function FooterContactPage() {
  const [contact, setContact] = useState<{
    id?: string;
    email: string;
    phone: string;
    address: string;
  }>({ email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/footer", { cache: "no-store" });
        const data = await res.json();
        if (data.contact) {
          setContact(data.contact);
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/footer-contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      if (!res.ok) {
        throw new Error("Failed to save contact information");
      }

      toast.success("Contact information saved successfully!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Failed to save contact information", {
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
          <PageHeader title="Footer Contact Information" />
          <p className="text-sm text-muted-foreground mt-2">
            Manage contact details displayed in the footer section.
          </p>
        </div>

        <Card className="p-6 border-l-4 border-l-blue-500 dark:border-l-blue-500 dark:!bg-slate-800 dark:!border-slate-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div className="text-lg font-semibold text-foreground">Contact Details</div>
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
              <Label htmlFor="contactEmail" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="hello@antiquenepal.com"
                className="mt-2"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contactPhone" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="contactPhone"
                placeholder="+977 1 234 5678"
                className="mt-2"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="contactAddress" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Physical Address
              </Label>
              <Input
                id="contactAddress"
                placeholder="Thamel, Kathmandu, Nepal"
                className="mt-2"
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
              />
            </div>
          </div>
        </Card>
      </div>

      <ConfirmationDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleSave}
        title="Save Contact Information?"
        description="This will update the contact information displayed in your website footer."
        confirmText="Save Changes"
      />
    </PageTransition>
  );
}
