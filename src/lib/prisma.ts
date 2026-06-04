import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  // During build time on Vercel, we provide a dummy but valid string to avoid initialization errors
  if (!connectionString) {
    if (process.env.VERCEL && process.env.NEXT_PHASE !== 'phase-production-build') {
       throw new Error(
        "DATABASE_URL environment variable is not set. " +
        "Add it in Vercel → Settings → Environment Variables."
      );
    }
    const dummyUrl = "postgresql://postgres:postgres@localhost:5432/postgres";
    const pool = new pg.Pool({ connectionString: dummyUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
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
