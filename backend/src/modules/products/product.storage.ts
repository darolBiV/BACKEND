import { randomUUID } from "node:crypto";
import { extname } from "node:path";

import { createClient } from "@supabase/supabase-js";
import type { MultipartFile } from "@fastify/multipart";

import { env } from "../../config/env.js";
import { AppError } from "../../errors/app-error.js";

interface StorageBucket {
  upload(
    path: string,
    data: Buffer,
    options: { contentType: string; upsert: boolean },
  ): Promise<{ error: { message: string } | null }>;
  getPublicUrl(path: string): { data: { publicUrl: string } };
}

interface StorageClient {
  from(bucket: string): StorageBucket;
}

const createStorageClient = (): StorageClient | null => {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY).storage;
};

export class ProductStorage {
  public constructor(
    private readonly storage: StorageClient | null = createStorageClient(),
    private readonly bucket: string = env.SUPABASE_STORAGE_BUCKET,
  ) {}

  public async upload(file: MultipartFile): Promise<string> {
    if (!this.storage) {
      throw new AppError(500, "Supabase Storage is not configured");
    }

    if (!file.mimetype.startsWith("image/")) {
      throw new AppError(400, "Only image files are allowed");
    }

    const extension = extname(file.filename).toLowerCase();
    const path = `products/${randomUUID()}${extension}`;
    const bucket = this.storage.from(this.bucket);
    const buffer = await file.toBuffer();
    const { error } = await bucket.upload(path, buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

    if (error) {
      throw new AppError(502, "Failed to upload image to Supabase Storage");
    }

    return bucket.getPublicUrl(path).data.publicUrl;
  }
}
