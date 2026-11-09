import type { FastifySchema } from "fastify";

export const productListSchema: FastifySchema = {
  querystring: {
    type: "object",
    additionalProperties: false,
    properties: {
      page: { type: "integer", minimum: 1, default: 1 },
      limit: { type: "integer", minimum: 1, default: 12 },
      search: { type: "string", minLength: 1 },
      min_price: { type: "number", minimum: 0 },
      max_price: { type: "number", minimum: 0 },
      min_rating: { type: "number", minimum: 0, maximum: 5 },
      sort_by: { type: "string", enum: ["price", "title"], default: "title" },
      order: { type: "string", enum: ["asc", "desc"], default: "asc" },
    },
  },
  response: {
    200: {
      type: "object",
      required: ["items", "meta"],
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            required: [
              "id",
              "title",
              "description",
              "price",
              "rating",
              "images",
              "stock_quantity",
              "created_at",
            ],
            properties: {
              id: { type: "integer" },
              title: { type: "string" },
              description: { type: "string" },
              price: { type: "number" },
              rating: { type: "number" },
              images: { type: "array", items: { type: "string" } },
              stock_quantity: { type: "integer" },
              created_at: { type: "string" },
            },
          },
        },
        meta: {
          type: "object",
          required: ["total_items", "total_pages", "current_page", "limit"],
          properties: {
            total_items: { type: "integer" },
            total_pages: { type: "integer" },
            current_page: { type: "integer" },
            limit: { type: "integer" },
          },
        },
      },
    },
  },
};
