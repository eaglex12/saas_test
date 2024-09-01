import React from "react";
import MovieCard from "./Moviecard";
import { Movie } from "../types/interface";

interface MovieListProps {
	movies: Movie[];
}

export const MovieList: React.FC<MovieListProps> = ({ movies }) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 mt-6">
			{movies.length > 0 ? (
				movies.map((movie) => (
					<MovieCard
						key={movie.id}
						movie={movie} // Ensure this matches the prop type in MovieCard
					/>
				))
			) : (
				<p className="text-center text-gray-500">No movies found.</p>
			)}
		</div>
	);
};
