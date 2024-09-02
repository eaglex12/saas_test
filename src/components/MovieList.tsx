import React from "react";
import MovieCard from "./Moviecard";
import { Movie } from "../types/interface";
import { trpc } from "../utils/trpc"; // Import TRPC hook

interface MovieListProps {
	movies: Movie[];
	loading?: boolean; // Add a loading prop
	error?: string | null; // Add an error prop
}

export const MovieList: React.FC<MovieListProps> = ({
	movies,
	loading = false,
	error = null,
}) => {
	const utils = trpc.useContext(); // Get TRPC context for refetching
	const deleteMovieMutation = trpc.movie.delete.useMutation({
		onMutate: async (id: number) => {
			await utils.movie.getAll.cancel(); // Cancel any outgoing refetches

			// Get the current list of movies
			const previousMovies = utils.movie.getAll.getData();

			// Optimistically update the movies by filtering out the deleted one
			utils.movie.getAll.setData(
				undefined,
				(old) => old?.filter((movie) => movie.id !== id) || []
			);

			// Return a context object with the previous state
			return { previousMovies };
		},
		onError: (err, id, context) => {
			// Roll back to the previous state if deletion fails
			if (context?.previousMovies) {
				utils.movie.getAll.setData(undefined, context.previousMovies);
			}
		},
		onSettled: () => {
			utils.movie.getAll.invalidate(); // Refetch movies after deletion
		},
	});

	const handleDelete = (id: number) => {
		if (confirm("Are you sure you want to delete this movie?")) {
			deleteMovieMutation.mutate(id);
		}
	};

	if (loading) {
		return <p className="text-center text-gray-500">Loading movies...</p>;
	}

	if (error) {
		return (
			<p className="text-center text-red-500">Error loading movies: {error}</p>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-6">
			{movies.length > 0 ? (
				movies.map((movie) => (
					<MovieCard key={movie.id} movie={movie} onDelete={handleDelete} />
				))
			) : (
				<p className="text-center text-gray-500">No movies found.</p>
			)}
		</div>
	);
};
