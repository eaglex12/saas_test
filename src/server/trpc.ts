import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import superjson from "superjson";

// Initialize tRPC with context
const t = initTRPC.context<Context>().create({
	transformer: superjson,
});

// Export reusable tRPC helpers
export const router = t.router;
export const procedure = t.procedure;
