import type { FastifySchema } from "fastify";

const cartResponseSchema = {
  type: "object",
  required: ["id", "items", "total_price"],
  properties: {
    id: { type: "integer" },
    items: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "product_id", "quantity", "product", "line_total"],
        properties: {
          id: { type: "integer" },
          product_id: { type: "integer" },
          quantity: { type: "integer" },
          product: {
            type: "object",
            required: ["id", "title", "price", "image", "stock_quantity"],
            properties: {
              id: { type: "integer" },
              title: { type: "string" },
              price: { type: "number" },
              image: { type: "string" },
              stock_quantity: { type: "integer" },
            },
          },
          line_total: { type: "number" },
        },
      },
    },
    total_price: { type: "number" },
  },
} as const;

const cartItemParamsSchema = {
  type: "object",
  additionalProperties: false,
  required: ["id"],
  properties: {
    id: { type: "integer", minimum: 1 },
  },
} as const;

export const getCartSchema: FastifySchema = {
  tags: ["Cart"],
  summary: "Get the current user's cart",
  security: [{ bearerAuth: [] }],
  response: {
    200: cartResponseSchema,
  },
};

export const addCartItemSchema: FastifySchema = {
  tags: ["Cart"],
  summary: "Add a product to the cart",
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    additionalProperties: false,
    required: ["product_id"],
    properties: {
      product_id: { type: "integer", minimum: 1 },
      quantity: { type: "integer", minimum: 1, default: 1 },
    },
  },
  response: {
    200: cartResponseSchema,
  },
};

export const updateCartItemSchema: FastifySchema = {
  tags: ["Cart"],
  summary: "Change a cart item quantity",
  security: [{ bearerAuth: [] }],
  params: cartItemParamsSchema,
  body: {
    type: "object",
    additionalProperties: false,
    required: ["quantity"],
    properties: {
      quantity: { type: "integer", minimum: 1 },
    },
  },
  response: {
    200: cartResponseSchema,
  },
};

export const deleteCartItemSchema: FastifySchema = {
  tags: ["Cart"],
  summary: "Remove an item from the cart",
  security: [{ bearerAuth: [] }],
  params: cartItemParamsSchema,
  response: {
    200: cartResponseSchema,
  },
};

export const applyPromoSchema: FastifySchema = {
  tags: ["Cart"],
  summary: "Apply a promo code to the cart",
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    additionalProperties: false,
    required: ["code"],
    properties: {
      code: { type: "string", minLength: 1 },
    },
  },
  response: {
    200: {
      type: "object",
      required: [
        "code",
        "discount_percentage",
        "subtotal",
        "discount_amount",
        "total_price",
      ],
      properties: {
        code: { type: "string" },
        discount_percentage: { type: "integer" },
        subtotal: { type: "number" },
        discount_amount: { type: "number" },
        total_price: { type: "number" },
      },
    },
  },
};
