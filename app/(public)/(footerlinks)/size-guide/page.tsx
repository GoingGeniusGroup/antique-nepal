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
      subtitle: "Use these tips to find the right fit across your wardrobe",
    },
    tables: [
      {
        title: "Measurements to Check",
        headers: ["Measurement", "How to Measure"],
        rows: [
          [
            "Bust",
            "Measure around the fullest part of your chest.",
          ],
          [
            "Waist",
            "Measure around your natural waistline.",
          ],
          [
            "Hips",
            "Measure around the fullest part of your hips.",
          ],
          [
            "Length",
            "Compare the garment measurements with a piece that fits you well.",
          ],
        ],
      },
      {
        title: "Choosing Your Size",
        headers: ["Fit detail", "What to look for"],
        rows: [
          [
            "Product size chart",
            "Check the measurements on the individual product page.",
          ],
          [
            "Fit description",
            "Review the product notes for its cut and intended fit.",
          ],
          [
            "Between sizes",
            "Choose based on your preferred fit and the garment details.",
          ],
        ],
      },
    ],
    measurementGuide: [
      {
        label: "Bust",
        description: "Keep the tape level and measure around the fullest part.",
      },
      {
        label: "Waist",
        description: "Measure around your natural waist without pulling tight.",
      },
      {
        label: "Hips",
        description: "Measure around the fullest part of your hips.",
      },
      {
        label: "Length",
        description: "Compare garment length with a similar piece that fits well.",
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
