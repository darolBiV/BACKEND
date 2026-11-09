export type ProductSortField = "price" | "title";
export type SortOrder = "asc" | "desc";

export interface ProductQuery {
  page: number;
  limit: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  sort_by: ProductSortField;
  order: SortOrder;
}

export interface ProductListItem {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  images: string[];
  stock_quantity: number;
  created_at: string;
}

export interface ProductListResult {
  items: ProductListItem[];
  meta: {
    total_items: number;
    total_pages: number;
    current_page: number;
    limit: number;
  };
}
