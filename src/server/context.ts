import { PrismaClient } from "@prisma/client";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Context function to pass to tRPC
export async function createContext(opts: CreateNextContextOptions) {
	return {
		prisma,
	};
}

export type Context = ReturnType<typeof createContext>;
export { prisma };
