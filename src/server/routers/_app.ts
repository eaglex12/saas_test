// src/server/routers/_app.ts
import { router } from "../trpc";
import { movieRouter } from "./movie";
import { reviewRouter } from "./review";

export const appRouter = router({
	movie: movieRouter,
	review: reviewRouter,
});

export type AppRouter = typeof appRouter;
