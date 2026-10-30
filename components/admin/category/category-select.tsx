import { useEffect, useState } from "react";

type Category = { id: string; name: string };

type Props = {
  selectedId: string | null;
  onChange: (id: string) => void;
};

export function CategorySelect({ selectedId, onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading categories...</p>;

  // Make sure selectedId exists in categories
  const validSelectedId = categories.find((c) => c.id === selectedId)?.id || "";

  return (
    <div>
      <select
        value={validSelectedId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
