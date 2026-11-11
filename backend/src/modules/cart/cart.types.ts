export interface AddCartItemBody {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemBody {
  quantity: number;
}

export interface CartItemParams {
  id: number;
}

export interface ApplyPromoBody {
  code: string;
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

export interface PromoResult {
  code: string;
  discount_percentage: number;
  subtotal: number;
  discount_amount: number;
  total_price: number;
}
