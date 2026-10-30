import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  description: ReactNode;
  icon: LucideIcon;
  accent: string;
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accent,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/50 bg-card/75 p-5 text-card-foreground shadow-sm backdrop-blur-xl dark:border-white/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <span className={`rounded-lg p-2.5 ${accent}`}>
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">{description}</div>
    </div>
  );
}
