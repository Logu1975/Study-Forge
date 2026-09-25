/**
 * config.ts - reads and checks the settings the server needs.
 *
 * Settings come from environment variables. During development you can put
 * them in server/.env (see server/.env.example); "dotenv/config" loads that
 * file for us. If a setting is invalid, we stop immediately with a clear
 * message instead of failing in a confusing way later.
 */
import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  // Not used until Stage 2 (login). We will make it required then.
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters").optional(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid settings in your environment / .env file:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.map(String).join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const config = {
  env: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  sessionSecret: parsed.data.SESSION_SECRET,
  // npm sets this variable when the server is started with an npm script.
  version: process.env.npm_package_version ?? "dev",
};
