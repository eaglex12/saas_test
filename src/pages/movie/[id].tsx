import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useMemo } from "react";
import ReviewList from "../../components/ReviewList"; // Ensure correct path

export default function MovieReview() {
	const router = useRouter();
	const { id } = router.query;
	const movieId = parseInt(id as string, 10);

	const { data: movie, isLoading: isLoadingMovie } =
		trpc.movie.getById.useQuery(movieId);
	const { data: reviews, isLoading: isLoadingReviews } =
		trpc.review.getAllByMovieId.useQuery(movieId);

	const averageRating = useMemo(() => {
		if (!reviews || reviews.length === 0) return null;

		const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
		return (totalRating / reviews.length).toFixed(1);
	}, [reviews]);

	if (isLoadingMovie || isLoadingReviews) {
		return (
			<div className="flex items-center justify-center h-screen">
				<h2 className="text-xl font-bold">Loading Reviews...</h2>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			{/* Pass movieName and averageRating to ReviewList */}
			<ReviewList
				reviews={reviews ?? []}
				movieName={movie?.name ?? "Movie Title"}
				averageRating={averageRating}
			/>
		</div>
	);
}
