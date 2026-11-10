export interface AddCartItemBody {
  product_id: number;
  quantity: number;
}

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  stock_quantity: number;
}

export interface CartItemResult {
  id: number;
  product_id: number;
  quantity: number;
  product: CartProduct;
  line_total: number;
}

export interface CartResult {
  id: number;
  items: CartItemResult[];
  total_price: number;
}
