// src/pages/movie/[id].tsx
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function MovieReview() {
	const router = useRouter();
	const { id } = router.query;
	const movieId = parseInt(id as string, 10);

	const { data: movie, isLoading: isLoadingMovie } =
		trpc.movie.getById.useQuery(movieId);
	const { data: reviews, isLoading: isLoadingReviews } =
		trpc.review.getAllByMovieId.useQuery(movieId);

	// Calculate the average rating using useMemo to avoid recalculating on every render
	const averageRating = useMemo(() => {
		if (!reviews || reviews.length === 0) return null;

		const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
		return (totalRating / reviews.length).toFixed(1);
	}, [reviews]);

	// If either movie or reviews are still loading, show a loading message
	if (isLoadingMovie || isLoadingReviews) {
		return (
			<div className="flex items-center justify-center h-screen">
				<h2 className="text-xl font-bold">Loading Reviews...</h2>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 h-screen">
			<h1 className="text-2xl font-bold mb-4">
				{movie?.name}
				{averageRating && (
					<span className="text-lg font-medium text-gray-600 ml-2">
						(Avg. Rating: {averageRating}/10)
					</span>
				)}
			</h1>
			<h2 className="text-xl mb-4">Reviews</h2>
			<div className="space-y-4">
				{reviews?.map((review) => (
					<div
						key={review.id}
						className="p-4 border border-gray-200 rounded shadow"
					>
						<p>
							<strong>Reviewer:</strong> {review.reviewerName ?? "Anonymous"}
						</p>
						<p>
							<strong>Rating:</strong> {review.rating}/10
						</p>
						<p>{review.comments}</p>
					</div>
				))}
			</div>
		</div>
	);
}
