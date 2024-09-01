import React, { useState, useEffect } from "react";
import { trpc } from "../../../utils/trpc";
import { Movie } from "@/types/interface";

interface AddReviewProps {
	movieId: number;
	onReviewAdded?: () => Promise<void>;
}

const AddReview: React.FC<AddReviewProps> = ({ movieId, onReviewAdded }) => {
	const [selectedMovieId, setSelectedMovieId] = useState<number | null>(
		movieId
	);
	const [reviewText, setReviewText] = useState<string>("");
	const [rating, setRating] = useState<number | "">("");
	const [error, setError] = useState<string | null>(null);
	const [reviewerName, setReviewerName] = useState<string>("");
	const [movies, setMovies] = useState<Movie[]>([]);

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
		onSuccess: async () => {
			setReviewText("");
			setRating("");
			setReviewerName("");

			setError(null);
			if (onReviewAdded) {
				await onReviewAdded();
			}
		},
		onError: () => {
			setError("Failed to add review. Please try again.");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			selectedMovieId !== null &&
			reviewText &&
			rating !== "" &&
			rating >= 0 &&
			rating <= 10
		) {
			mutation.mutate({
				movieId: selectedMovieId,
				reviewerName,
				rating,
				comments: reviewText,
			});
		} else {
			setError("Please fill out all fields correctly.");
		}
	};

	return (
		<div className="bg-white p-4 rounded shadow-md">
			<h2 className="text-lg font-semibold mb-4">Add Review</h2>
			<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
				<select
					value={selectedMovieId ?? ""}
					onChange={(e) => setSelectedMovieId(Number(e.target.value))}
					className="p-2 border border-gray-300 rounded"
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
					className="p-2 border border-gray-300 rounded"
				/>
				<textarea
					placeholder="Write your review"
					value={reviewText}
					onChange={(e) => setReviewText(e.target.value)}
					className="p-2 border border-gray-300 rounded"
					rows={4}
				/>
				<input
					type="number"
					placeholder="Rating (0-10)"
					value={rating}
					onChange={(e) => setRating(Number(e.target.value))}
					min="0"
					max="10"
					className="p-2 border border-gray-300 rounded"
				/>
				{error && <p className="text-red-500 text-sm">{error}</p>}
				<button
					type="submit"
					className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
				>
					Add Review
				</button>
			</form>
		</div>
	);
};

export default AddReview;
