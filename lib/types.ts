export type Tour = {
  id: string;
  slug: string;
  name: string;
  price_usd: number | null; // null = "Book with us"
  price_label?: string | null;
  description: string | null;
  image_url: string | null;
  duration?: string | null;
  category?: string | null;
  sort_order: number;
  is_active: boolean;
};

export function formatPrice(price: number | null, label?: string | null): string {
  return label ?? (price === null ? "Book with us" : `$${Number(price)}`);
}
