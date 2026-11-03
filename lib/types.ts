export type Tour = {
  id: string;
  slug: string;
  name: string;
  price_usd: number | null; // null = rates on request (accommodation)
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export function formatPrice(price: number | null): string {
  return price === null ? "Rates on request" : `$${Number(price)}`;
}
