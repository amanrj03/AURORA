import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let prisma;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("\n========================================================");
  console.warn("[AURORA DB] WARNING: DATABASE_URL is not configured in .env");
  console.warn("Please add: DATABASE_URL=\"postgresql://user:pass@localhost:5432/db\"");
  console.warn("Database queries will fail until this variable is defined.");
  console.warn("========================================================\n");

  prisma = new Proxy({}, {
    get: function (target, prop) {
      return new Proxy(() => {}, {
        apply: () => {
          throw new Error("DATABASE_URL is not configured in .env. Please specify your PostgreSQL connection string.");
        },
        get: () => {
          return () => {
            throw new Error("DATABASE_URL is not configured in .env. Please specify your PostgreSQL connection string.");
          };
        }
      });
    }
  });
} else {
  if (process.env.NODE_ENV === "production") {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } else {
    // If global prisma exists but is missing the newly added History model due to HMR cache, re-initialize it
    if (!global.prisma || !global.prisma.history) {
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      global.prisma = new PrismaClient({ adapter });
    }
    prisma = global.prisma;
  }
}

export default prisma;
