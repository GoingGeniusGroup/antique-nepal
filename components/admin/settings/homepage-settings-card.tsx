import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Package } from "lucide-react";

type HomepageData = {
  featuredTitle?: string;
  featuredSubtitle?: string;
  featuredDescription?: string;
  productHighlights?: {
    title?: string;
    subtitle?: string;
    featuredProductIds?: string[];
  };
};

type Props = {
  homepage: HomepageData;
  onChange: (homepage: HomepageData) => void;
};

export function HomepageSettingsCard({ homepage, onChange }: Props) {
  return (
    <>
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
              value={homepage.featuredTitle || ""}
              onChange={(e) => onChange({ ...homepage, featuredTitle: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="featuredSubtitle" className="text-sm font-medium text-muted-foreground">Featured Subtitle</Label>
            <Input
              id="featuredSubtitle"
              placeholder="Discover Our Best Sellers"
              className="mt-2"
              value={homepage.featuredSubtitle || ""}
              onChange={(e) => onChange({ ...homepage, featuredSubtitle: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="featuredDescription" className="text-sm font-medium text-muted-foreground">Featured Description</Label>
            <Input
              id="featuredDescription"
              placeholder="Explore our handpicked selection of premium hemp bags..."
              className="mt-2"
              value={homepage.featuredDescription || ""}
              onChange={(e) => onChange({ ...homepage, featuredDescription: e.target.value })}
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
              value={homepage.productHighlights?.title || ""}
              onChange={(e) => onChange({ 
                ...homepage, 
                productHighlights: { 
                  ...homepage.productHighlights, 
                  title: e.target.value 
                } 
              })}
            />
          </div>
          <div>
            <Label htmlFor="highlightsSubtitle" className="text-sm font-medium text-muted-foreground">Highlights Subtitle</Label>
            <Input
              id="highlightsSubtitle"
              placeholder="Premium Quality & Sustainable"
              className="mt-2"
              value={homepage.productHighlights?.subtitle || ""}
              onChange={(e) => onChange({ 
                ...homepage, 
                productHighlights: { 
                  ...homepage.productHighlights, 
                  subtitle: e.target.value 
                } 
              })}
            />
          </div>
        </div>
      </Card>
    </>
  );
}
