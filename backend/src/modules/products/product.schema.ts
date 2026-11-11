import type { FastifySchema } from "fastify";

const productResponseSchema = {
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
} as const;

const productBodySchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "description", "price", "rating", "images", "stock_quantity"],
  properties: {
    title: { type: "string", minLength: 1 },
    description: { type: "string", minLength: 1 },
    price: { type: "number", minimum: 0 },
    rating: { type: "number", minimum: 0, maximum: 5 },
    images: {
      type: "array",
      minItems: 3,
      items: { type: "string", format: "uri" },
    },
    stock_quantity: { type: "integer", minimum: 0 },
  },
} as const;

const productParamsSchema = {
  type: "object",
  additionalProperties: false,
  required: ["id"],
  properties: {
    id: { type: "integer", minimum: 1 },
  },
} as const;

export const productListSchema: FastifySchema = {
  tags: ["Products"],
  summary: "Get the product catalog",
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

export const productCreateSchema: FastifySchema = {
  tags: ["Products"],
  summary: "Create a product",
  security: [{ bearerAuth: [] }],
  body: productBodySchema,
  response: {
    201: productResponseSchema,
  },
};

export const productUpdateSchema: FastifySchema = {
  tags: ["Products"],
  summary: "Update a product",
  security: [{ bearerAuth: [] }],
  params: productParamsSchema,
  body: productBodySchema,
  response: {
    200: productResponseSchema,
  },
};

export const productDeleteSchema: FastifySchema = {
  tags: ["Products"],
  summary: "Delete a product",
  security: [{ bearerAuth: [] }],
  params: productParamsSchema,
};

export const productImageUploadSchema: FastifySchema = {
  tags: ["Products"],
  summary: "Upload a product image",
  description: "Uploads one image as multipart/form-data. The file field name is `file`.",
  consumes: ["multipart/form-data"],
  security: [{ bearerAuth: [] }],
  response: {
    201: {
      type: "object",
      required: ["url"],
      properties: {
        url: { type: "string", format: "uri" },
      },
    },
  },
};
