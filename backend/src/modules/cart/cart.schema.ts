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

export const getCartSchema: FastifySchema = {
  response: {
    200: cartResponseSchema,
  },
};

export const addCartItemSchema: FastifySchema = {
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
