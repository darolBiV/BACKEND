import type { FastifySchema } from "fastify";

export const registerSchema: FastifySchema = {
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
