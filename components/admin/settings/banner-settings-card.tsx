import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react";

type Props = {
  banner: { text?: string; isVisible?: boolean };
  onChange: (banner: { text?: string; isVisible?: boolean }) => void;
};

export function BannerSettingsCard({ banner, onChange }: Props) {
  return (
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
            value={banner.text || ""}
            onChange={(e) => onChange({ ...banner, text: e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}
