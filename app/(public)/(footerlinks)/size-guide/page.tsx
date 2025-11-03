"use client";

import Image from "next/image";
import { Ruler } from "lucide-react";
import paperTexture from "@/public/paper-texture.jpg";

export default function SizeGuidePage() {
  // 🗂️ Dictionary-style Size Guide data
  const sizeData = {
    hero: {
      icon: Ruler,
      title: "Size Guide",
      subtitle: "Find the perfect fit for your lifestyle",
    },
    tables: [
      {
        title: "Tote Bags",
        headers: ["Size", "Width", "Height", "Depth", "Best For"],
        rows: [
          [
            "Small",
            `12" (30cm)`,
            `14" (35cm)`,
            `4" (10cm)`,
            "Daily essentials, light shopping",
          ],
          [
            "Medium",
            `15" (38cm)`,
            `16" (40cm)`,
            `5" (13cm)`,
            "Work, laptop, everyday use",
          ],
          [
            "Large",
            `18" (45cm)`,
            `18" (45cm)`,
            `6" (15cm)`,
            "Travel, beach, groceries",
          ],
        ],
      },
      {
        title: "Backpacks",
        headers: ["Size", "Capacity", "Height", "Width", "Best For"],
        rows: [
          [
            "Small (15L)",
            "15 liters",
            `16" (40cm)`,
            `11" (28cm)`,
            "Day trips, urban commuting",
          ],
          [
            "Medium (25L)",
            "25 liters",
            `19" (48cm)`,
            `13" (33cm)`,
            "School, work, short trips",
          ],
          [
            "Large (35L)",
            "35 liters",
            `22" (56cm)`,
            `15" (38cm)`,
            "Travel, hiking, camping",
          ],
        ],
      },
      {
        title: "Shoulder Bags",
        headers: ["Size", "Width", "Height", "Strap Drop", "Best For"],
        rows: [
          [
            "Small",
            `10" (25cm)`,
            `8" (20cm)`,
            `20" (50cm)`,
            "Evening out, essentials",
          ],
          [
            "Medium",
            `12" (30cm)`,
            `10" (25cm)`,
            `22" (56cm)`,
            "Daily use, casual outings",
          ],
        ],
      },
      {
        title: "Clutches",
        headers: ["Style", "Width", "Height", "Fits"],
        rows: [
          [
            "Envelope",
            `11" (28cm)`,
            `7" (18cm)`,
            "Phone, cards, lipstick, keys",
          ],
          [
            "Fold-over",
            `12" (30cm)`,
            `8" (20cm)`,
            "Small tablet, wallet, makeup",
          ],
        ],
      },
    ],
    measurementGuide: [
      {
        label: "Width",
        description: "Measure from left to right at the widest point",
      },
      {
        label: "Height",
        description: "Measure from top to bottom at the tallest point",
      },
      {
        label: "Depth",
        description: "Measure from front to back when the bag is full",
      },
      {
        label: "Strap Drop",
        description: "Measure from top of bag to bottom of strap",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src={paperTexture}
              alt="Paper texture background"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <sizeData.hero.icon className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-foreground">
                {sizeData.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {sizeData.hero.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Size Tables */}
        <section className="py-20">
          <div className="container max-w-5xl mx-auto space-y-16 px-4 sm:px-6 lg:px-8">
            {sizeData.tables.map((table, idx) => (
              <div key={idx}>
                <h2 className="font-serif text-3xl font-bold mb-6">
                  {table.title}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/30">
                        {table.headers.map((header, i) => (
                          <th
                            key={i}
                            className="border border-border p-4 text-left"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      {table.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`border border-border p-4 ${
                                cIdx === 0 ? "font-medium" : ""
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Measurement Guide */}
            <div className="bg-muted/30 p-8 rounded-lg">
              <h3 className="font-serif text-2xl font-bold mb-4">
                How to Measure
              </h3>
              <div className="space-y-4 text-muted-foreground">
                {sizeData.measurementGuide.map((item, index) => (
                  <p key={index}>
                    <strong>{item.label}:</strong> {item.description}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
