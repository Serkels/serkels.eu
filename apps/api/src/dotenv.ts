//

import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { z } from "zod";

//

export const ENV = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  })
  .parse(process.env);

//

const dotenvFiles = [
  `./.env.${ENV.NODE_ENV}.local`,
  `./.env.local`,
  `./.env.${ENV.NODE_ENV}`,
  "./.env",
];

for (const envFile of dotenvFiles) {
  // only load .env if the user provided has an env config file
  const dotEnvPath = path.join(process.cwd(), envFile);

  try {
    const stats = fs.statSync(dotEnvPath);
    if (!stats.isFile()) {
      continue;
    }
    console.log(` - Environments: ${envFile}`);
    dotenv.config({ path: dotEnvPath, debug: true });
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      console.error(`❌ Failed to load env from ${envFile}`, err);
    }
  }
}
