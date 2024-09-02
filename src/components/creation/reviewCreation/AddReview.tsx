import React, { useState, useEffect } from "react";
import { trpc } from "../../../utils/trpc";
import { Movie } from "@/types/interface";
import Image from "next/image";
import { number } from "zod";

const AddReview: React.FC<{ onReviewAdded?: () => Promise<void> }> = ({
	onReviewAdded,
}) => {
	const [selectedMovieId, setSelectedMovieId] = useState<number | "">("");
	const [reviewText, setReviewText] = useState<string>("");
	const [rating, setRating] = useState<number | "">("");
	const [error, setError] = useState<string | null>(null);
	const [reviewerName, setReviewerName] = useState<string>("");
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(false);

	// Fetch movies
	const { data: movieData } = trpc.movie.getAll.useQuery();

	useEffect(() => {
		if (movieData) {
			const updatedMovies = movieData.map((movie) => ({
				...movie,
				releaseDate: new Date(movie.releaseDate), // Assuming releaseDate is a string
			}));
			setMovies(updatedMovies);
		}
	}, [movieData]);

	const mutation = trpc.review.create.useMutation({
		onMutate: () => {
			setLoading(true);
		},
		onSuccess: async () => {
			setReviewText("");
			setRating("");
			setReviewerName("");
			setError(null);
			setLoading(false);
			if (onReviewAdded) {
				await onReviewAdded();
			}
		},
		onError: () => {
			setError("Failed to add review. Please try again.");
			setLoading(false);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			selectedMovieId !== "" &&
			reviewText &&
			rating !== "" &&
			rating >= 0 &&
			rating <= 10
		) {
			mutation.mutate({
				movieId: Number(selectedMovieId),
				reviewerName,
				rating,
				comments: reviewText,
			});
		} else {
			setError("Please fill out all fields correctly.");
		}
	};

	return (
		<div className="flex flex-col space-y-4">
			<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
				<select
					value={selectedMovieId}
					onChange={(e) => setSelectedMovieId(Number(e.target.value))}
					className="p-3 border rounded border-gray-300"
				>
					<option value="" disabled>
						Select a movie
					</option>
					{movies.map((movie) => (
						<option key={movie.id} value={movie.id}>
							{movie.name}
						</option>
					))}
				</select>
				<input
					type="text"
					placeholder="Your Name"
					value={reviewerName}
					onChange={(e) => setReviewerName(e.target.value)}
					className="p-3 border rounded border-gray-300"
				/>
				<textarea
					placeholder="Write your review"
					value={reviewText}
					onChange={(e) => setReviewText(e.target.value)}
					className="p-3 border rounded border-gray-300"
					rows={4}
				/>
				<input
					type="number"
					placeholder="Rating (0-10)"
					value={rating}
					onChange={(e) => setRating(Number(e.target.value))}
					min="0"
					max="10"
					className="p-3 border rounded border-gray-300"
				/>
				{error && <p className="text-red-500 text-xs">{error}</p>}
				<button
					type="submit"
					className="bg-violet-600 text-white py-2 px-4 rounded self-end"
					disabled={loading}
				>
					{loading ? "Adding Review..." : "Add Review"}
				</button>
			</form>
			{loading && (
				<div className="flex justify-center mt-4">
					<Image
						src="/giphy.gif"
						alt="Loading..."
						width={32}
						height={32}
						className="w-8 h-8"
					/>
				</div>
			)}
		</div>
	);
};

export default AddReview;
