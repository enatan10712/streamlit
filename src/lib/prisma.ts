import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.VERCEL) {
       // During Vercel build, provide a dummy string to allow 'prisma generate' and build to succeed
       const dummyUrl = "postgresql://postgres:postgres@localhost:5432/postgres";
       const pool = new pg.Pool({ connectionString: dummyUrl });
       const adapter = new PrismaPg(pool);
       return new PrismaClient({ adapter });
    }

    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Please add it to your .env file or Vercel environment variables."
    );
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();
export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
