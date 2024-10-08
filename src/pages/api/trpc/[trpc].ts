import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/routers/_app";
import { createContext } from "../../../server/context";
import type { NextApiRequest, NextApiResponse } from "next";

// Create the API handler
const nextApiHandler = trpcNext.createNextApiHandler({
	router: appRouter,
	createContext,
});

// Export the handler with CORS support
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Set CORS headers
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization, trpc-accept"
	);
	res.setHeader("Access-Control-Allow-Credentials", "true");

	// Handle preflight requests (CORS preflight)
	if (req.method === "OPTIONS") {
		res.status(204).end(); // Use 204 No Content status for preflight requests
		return;
	}

	// Pass the request to the tRPC handler
	return nextApiHandler(req, res);
}
