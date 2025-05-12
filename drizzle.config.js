import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle",
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_3OWNw2JQHgKl@ep-wispy-cherry-a5jfp597-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
  }
});
