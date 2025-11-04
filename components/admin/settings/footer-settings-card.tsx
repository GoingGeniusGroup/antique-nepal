import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Mail, Phone, MapPin, Bell } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type FooterData = { 
  brandName?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  newsletterTitle?: string;
  newsletterDescription?: string;
  copyrightText?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
};

type Props = {
  footer: FooterData;
  onChange: (footer: FooterData) => void;
};

export function FooterSettingsCard({ footer, onChange }: Props) {
  return (
    <Card className="p-6 border-l-4 border-l-indigo-500 dark:!bg-slate-800 dark:!border-slate-600">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-indigo-600" />
        <div className="text-lg font-semibold text-foreground">Footer Content</div>
      </div>
      
      {/* Brand Section */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-indigo-500 rounded"></span>
          Brand Information
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="footerBrandName" className="text-sm font-medium text-muted-foreground">Brand Name</Label>
            <Input
              id="footerBrandName"
              placeholder="Antique Nepal"
              className="mt-2"
              value={footer.brandName || ""}
              onChange={(e) => onChange({ ...footer, brandName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="footerTagline" className="text-sm font-medium text-muted-foreground">Tagline</Label>
            <Input
              id="footerTagline"
              placeholder="Handcrafted Heritage"
              className="mt-2"
              value={footer.tagline || ""}
              onChange={(e) => onChange({ ...footer, tagline: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="footerDescription" className="text-sm font-medium text-muted-foreground">Description</Label>
            <Textarea
              id="footerDescription"
              placeholder="Preserving centuries of Nepalese craftsmanship..."
              className="mt-2 min-h-[80px]"
              value={footer.description || ""}
              onChange={(e) => onChange({ ...footer, description: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mb-6 pt-6 border-t border-border">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
          <Phone className="h-4 w-4 text-indigo-600" />
          Contact Information
        </h4>
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
              value={footer.email || ""}
              onChange={(e) => onChange({ ...footer, email: e.target.value })}
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
              value={footer.phone || ""}
              onChange={(e) => onChange({ ...footer, phone: e.target.value })}
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
              value={footer.address || ""}
              onChange={(e) => onChange({ ...footer, address: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mb-6 pt-6 border-t border-border">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-indigo-500 rounded"></span>
          Social Media Links
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="facebookUrl" className="text-sm font-medium text-muted-foreground">Facebook URL</Label>
            <Input
              id="facebookUrl"
              placeholder="https://facebook.com/yourpage"
              className="mt-2"
              value={footer.social?.facebook || ""}
              onChange={(e) => onChange({ ...footer, social: { ...footer.social, facebook: e.target.value } })}
            />
          </div>
          <div>
            <Label htmlFor="instagramUrl" className="text-sm font-medium text-muted-foreground">Instagram URL</Label>
            <Input
              id="instagramUrl"
              placeholder="https://instagram.com/yourprofile"
              className="mt-2"
              value={footer.social?.instagram || ""}
              onChange={(e) => onChange({ ...footer, social: { ...footer.social, instagram: e.target.value } })}
            />
          </div>
          <div>
            <Label htmlFor="twitterUrl" className="text-sm font-medium text-muted-foreground">Twitter URL</Label>
            <Input
              id="twitterUrl"
              placeholder="https://twitter.com/yourhandle"
              className="mt-2"
              value={footer.social?.twitter || ""}
              onChange={(e) => onChange({ ...footer, social: { ...footer.social, twitter: e.target.value } })}
            />
          </div>
          <div>
            <Label htmlFor="linkedinUrl" className="text-sm font-medium text-muted-foreground">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              placeholder="https://linkedin.com/company/yourcompany"
              className="mt-2"
              value={footer.social?.linkedin || ""}
              onChange={(e) => onChange({ ...footer, social: { ...footer.social, linkedin: e.target.value } })}
            />
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mb-6 pt-6 border-t border-border">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-indigo-600" />
          Newsletter Section
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="newsletterTitle" className="text-sm font-medium text-muted-foreground">Newsletter Title</Label>
            <Input
              id="newsletterTitle"
              placeholder="Join Our Community"
              className="mt-2"
              value={footer.newsletterTitle || ""}
              onChange={(e) => onChange({ ...footer, newsletterTitle: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="newsletterDescription" className="text-sm font-medium text-muted-foreground">Newsletter Description</Label>
            <Input
              id="newsletterDescription"
              placeholder="Subscribe to receive updates..."
              className="mt-2"
              value={footer.newsletterDescription || ""}
              onChange={(e) => onChange({ ...footer, newsletterDescription: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="pt-6 border-t border-border">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-indigo-500 rounded"></span>
          Copyright
        </h4>
        <div>
          <Label htmlFor="copyrightText" className="text-sm font-medium text-muted-foreground">Copyright Text</Label>
          <Input
            id="copyrightText"
            placeholder="Antique Nepal. All rights reserved."
            className="mt-2"
            value={footer.copyrightText || ""}
            onChange={(e) => onChange({ ...footer, copyrightText: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Note: The year will be automatically added (e.g., © 2024 Your Text)
          </p>
        </div>
      </div>
    </Card>
  );
}
