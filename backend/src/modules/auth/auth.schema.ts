import type { FastifySchema } from "fastify";

export const registerSchema: FastifySchema = {
  tags: ["Auth"],
  summary: "Register a customer",
  body: {
    type: "object",
    additionalProperties: false,
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
    },
  },
  response: {
    201: {
      type: "object",
      required: ["id", "email", "role", "created_at"],
      properties: {
        id: { type: "integer" },
        email: { type: "string" },
        role: { type: "string", enum: ["customer"] },
        created_at: { type: "string" },
      },
    },
  },
};

export const loginSchema: FastifySchema = {
  tags: ["Auth"],
  summary: "Log in and receive a JWT",
  body: {
    type: "object",
    additionalProperties: false,
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 1 },
    },
  },
  response: {
    200: {
      type: "object",
      required: ["token"],
      properties: {
        token: { type: "string" },
      },
    },
  },
};
