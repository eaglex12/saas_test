import { z } from "zod";
import { router, procedure } from "../trpc";
import { prisma } from "../context";
import { TRPCError } from "@trpc/server";
import { format, parseISO } from "date-fns";

// Helper function to format dates as 'YYYY-MM-DD'
const formatDate = (date: Date): string => {
	return format(date, "yyyy-MM-dd"); // Format date to 'YYYY-MM-DD'
};

// Helper function to parse 'YYYY-MM-DD' string into a Date object
const parseDate = (dateStr: string): Date => {
	return parseISO(dateStr); // Parse 'YYYY-MM-DD' string to Date object
};

export const movieRouter = router({
	getAll: procedure.query(async () => {
		try {
			const movies = await prisma.movie.findMany();
			console.log("Movies fetched:", movies); // Debug log
			return movies;
		} catch (error) {
			console.error("Error fetching movies:", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch movies",
			});
		}
	}),
	getById: procedure.input(z.number()).query(async ({ input }) => {
		try {
			const movie = await prisma.movie.findUnique({ where: { id: input } });
			if (!movie) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Movie not found" });
			}
			console.log("Movie fetched by ID:", movie); // Debug log
			return {
				...movie,
				releaseDate: formatDate(movie.releaseDate), // Convert to 'YYYY-MM-DD' format
			};
		} catch (error) {
			console.error("Error fetching movie by ID:", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch movie by ID",
			});
		}
	}),
	create: procedure
		.input(
			z.object({
				name: z.string(),
				releaseDate: z.string(), // Input is string in 'YYYY-MM-DD' format
			})
		)
		.mutation(async ({ input }) => {
			try {
				const movie = await prisma.movie.create({
					data: {
						...input,
						releaseDate: parseDate(input.releaseDate), // Parse 'YYYY-MM-DD' format to Date
					},
				});
				console.log("Movie created:", movie); // Debug log
				return {
					...movie,
					releaseDate: formatDate(movie.releaseDate), // Convert to 'YYYY-MM-DD' format
				};
			} catch (error) {
				console.error("Error creating movie:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create movie",
				});
			}
		}),
	update: procedure
		.input(
			z.object({
				id: z.number(),
				name: z.string().optional(),
				releaseDate: z.string().optional(), // Input is string in 'YYYY-MM-DD' format
			})
		)
		.mutation(async ({ input }) => {
			try {
				const movie = await prisma.movie.update({
					where: { id: input.id },
					data: {
						...input,
						releaseDate: input.releaseDate
							? parseDate(input.releaseDate) // Parse 'YYYY-MM-DD' format to Date
							: undefined,
					},
				});
				console.log("Movie updated:", movie); // Debug log
				return {
					...movie,
					releaseDate: formatDate(movie.releaseDate), // Convert to 'YYYY-MM-DD' format
				};
			} catch (error) {
				console.error("Error updating movie:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update movie",
				});
			}
		}),
	delete: procedure.input(z.number()).mutation(async ({ input }) => {
		try {
			const movie = await prisma.movie.delete({ where: { id: input } });
			console.log("Movie deleted:", movie); // Debug log
			return {
				...movie,
				releaseDate: formatDate(movie.releaseDate), // Convert to 'YYYY-MM-DD' format
			};
		} catch (error) {
			console.error("Error deleting movie:", error);
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to delete movie",
			});
		}
	}),
});
