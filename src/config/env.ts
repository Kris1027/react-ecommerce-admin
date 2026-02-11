import { z } from "zod/v4";

const envSchema = z.object({
  VITE_API_URL: z.url(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    z.prettifyError(parsed.error),
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
