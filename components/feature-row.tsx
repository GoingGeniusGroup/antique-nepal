import { Leaf, Scale, BadgeCheck } from "lucide-react";

const items = [
  { icon: Leaf, title: "100% Eco‑Friendly", desc: "Sustainable hemp fiber" },
  { icon: Scale, title: "Fair Trade", desc: "Supporting local artisans" },
  { icon: BadgeCheck, title: "Quality Crafted", desc: "15+ years tradition" },
];

export function FeatureRow() {
  return (
    <div className="-mt-44 relative z-20 mx-auto max-w-6xl px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
      {items.map((it) => (
        <div key={it.title} className="rounded-lg bg-white/18 backdrop-blur-md shadow-[0_14px_40px_rgba(0,0,0,0.3)] border border-white/30 h-44 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-1">
          <div className="mb-2 h-10 w-10 rounded-full bg-white/15 border border-white/30 flex items-center justify-center">
            <it.icon className="h-5 w-5 text-white"/>
          </div>
          <div className="px-6 text-white">
            <div className="text-base font-semibold text-white">{it.title}</div>
            <div className="text-sm text-white/85">{it.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}


