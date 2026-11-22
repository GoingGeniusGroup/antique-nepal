export const CATEGORY_OPTIONS = [
  { slug: "tops", name: "Tops", image: "/images/products/kurthino7.jpg" },
  {
    slug: "kurthi-set",
    name: "Kurthi Set",
    image: "/images/products/kurthaset-8.jpg",
  },
  {
    slug: "cord-set",
    name: "Cord Set",
    image:
      "/catimage/1762757664382-Two%20Weavers%20Engaged%20In%20Traditional%20Crafting%20With%20Looms%20(2).png",
  },
  { slug: "sweater", name: "Sweater", image: "/images/products/sweater1.jpg" },
  {
    slug: "hand-bags",
    name: "Hand Bags",
    image: "/images/products/handbag4.jpg",
  },
] as const;

export function getCategoryDisplayName(categoryName: string): string {
  const normalizedName = categoryName.trim().toLowerCase();
  return (
    CATEGORY_OPTIONS.find(
      ({ name, slug }) =>
        name.toLowerCase() === normalizedName || slug === normalizedName
    )?.name ?? categoryName
  );
}

export function getCategoryImage(categoryName: string): string | undefined {
  const normalizedName = categoryName.trim().toLowerCase();
  return CATEGORY_OPTIONS.find(
    ({ name, slug }) =>
      name.toLowerCase() === normalizedName || slug === normalizedName
  )?.image;
}

export function orderCategories<
  T extends { slug: string; name: string; image?: string | null },
>(
  categories: T[]
): Array<T & { name: string; image: string }> {
  const categoriesBySlug = new Map(
    categories.map((category) => [category.slug, category])
  );

  return CATEGORY_OPTIONS.flatMap(({ slug, name, image }) => {
    const category = categoriesBySlug.get(slug);
    return category
      ? [{ ...category, name, image: category.image || image }]
      : [];
  });
}
