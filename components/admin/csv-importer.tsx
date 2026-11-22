"use client";

import { useState } from "react";
import Papa from "papaparse";

interface ProductRow {
  title: string;
  price: string;
  stock: string;
  sku: string;
  category: string;
  description?: string;
  image?: string;
}

export function CsvImporter() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage(null);

    Papa.parse<ProductRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const response = await fetch("/api/products/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(results.data),
          });

          const data: { count?: number; error?: string } | null =
            await response.json().catch(() => null);
          if (response.ok) {
            setMessage(`🎉 Successfully imported ${data?.count ?? 0} products!`);
          } else {
            setMessage(
              `❌ Error: ${data?.error || `Import failed (${response.status})`}`
            );
          }
        } catch (error) {
          setMessage(
            `❌ Error: ${
              error instanceof Error ? error.message : "Network error while uploading."
            }`
          );
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm max-w-md">
      <h3 className="text-lg font-semibold mb-2">Bulk Product Import</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Upload a CSV with <code>title</code>, <code>price</code>, <code>stock</code>, <code>sku</code>, <code>category</code>, <code>description</code>, and <code>image</code> headers. Images can use HTTP(S) URLs or local <code>/images/products/...</code> paths.
      </p>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        disabled={loading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer disabled:opacity-50"
      />

      {loading && <p className="mt-3 text-sm text-blue-500">Processing file and uploading...</p>}
      {message && <p className="mt-3 text-sm font-medium">{message}</p>}
    </div>
  );
}