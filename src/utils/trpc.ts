import { createTRPCNext } from "@trpc/next";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { NextPageContext } from "next";
import type { AppRouter } from "../server/routers/_app";
import { transformer } from "./transformer";

function getBaseUrl() {
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	if (process.env.RENDER_INTERNAL_HOSTNAME) {
		return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
	}
	console.log("helo");

	return `http://localhost:${process.env.PORT ?? 3000}`;
}

export interface SSRContext extends NextPageContext {
	status?: number;
}

export const trpc = createTRPCNext<AppRouter, SSRContext>({
	config({ ctx }) {
		return {
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === "development" ||
						(opts.direction === "down" && opts.result instanceof Error),
				}),
				unstable_httpBatchStreamLink({
					url: `${getBaseUrl()}/api/trpc`, // Endpoint for TRPC API
					headers() {
						if (!ctx?.req?.headers) {
							return {};
						}

						const { connection: _connection, ...headers } = ctx.req.headers;
						return headers;
					},
					transformer,
				}),
			],
		};
	},

	ssr: false,
	transformer,
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
