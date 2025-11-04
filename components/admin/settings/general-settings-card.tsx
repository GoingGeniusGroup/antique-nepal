import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";

type Props = {
  general: { siteName?: string; logo?: string };
  onChange: (general: { siteName?: string; logo?: string }) => void;
};

export function GeneralSettingsCard({ general, onChange }: Props) {
  return (
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
            value={general.siteName || ""}
            onChange={(e) => onChange({ ...general, siteName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="logo" className="text-sm font-medium text-muted-foreground">Logo URL</Label>
          <Input
            id="logo"
            placeholder="https://example.com/logo.png"
            className="mt-2"
            value={general.logo || ""}
            onChange={(e) => onChange({ ...general, logo: e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}
