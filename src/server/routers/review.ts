import { z } from "zod";
import { router, procedure } from "../trpc";
import { prisma } from "../context";

export const reviewRouter = router({
	getAll: procedure.query(async () => {
		return prisma.review.findMany(); // Fetch all reviews
	}),
	getAllByMovieId: procedure.input(z.number()).query(async ({ input }) => {
		return prisma.review.findMany({ where: { movieId: input } });
	}),
	create: procedure
		.input(
			z.object({
				movieId: z.number(),
				reviewerName: z.string().optional(),
				rating: z.number().min(0).max(10),
				comments: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			const review = await prisma.review.create({ data: input });

			// Update the average rating of the movie
			const reviews = await prisma.review.findMany({
				where: { movieId: input.movieId },
			});
			const averageRating =
				reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;

			await prisma.movie.update({
				where: { id: input.movieId },
				data: { averageRating },
			});

			return review;
		}),
	update: procedure
		.input(
			z.object({
				id: z.number(),
				reviewerName: z.string().optional(),
				rating: z.number().min(0).max(10).optional(),
				comments: z.string().optional(),
			})
		)
		.mutation(async ({ input }) => {
			return prisma.review.update({ where: { id: input.id }, data: input });
		}),
	delete: procedure.input(z.number()).mutation(async ({ input }) => {
		return prisma.review.delete({ where: { id: input } });
	}),
	search: procedure.input(z.string()).query(async ({ input }) => {
		const trimmedInput = input.trim().toLowerCase();
		return prisma.review.findMany({
			where: {
				OR: [
					{ reviewerName: { contains: input, mode: "insensitive" } },
					{ comments: { contains: input, mode: "insensitive" } },
				],
			},
		});
	}),
});
