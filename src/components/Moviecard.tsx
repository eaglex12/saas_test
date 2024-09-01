// components/MovieCard.tsx

import React from "react";
import { useRouter } from "next/router";
import { Movie } from "../types/interface";

interface MovieCardProps {
	movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
	const router = useRouter();

	const handleClick = () => {
		router.push(`/movie/${movie.id}`); // Redirect to the movie details page
	};

	return (
		<div
			className="p-4 border rounded shadow cursor-pointer"
			onClick={handleClick}
		>
			<h3 className="text-lg font-bold">{movie.name}</h3>
			<p>Release Date: {new Date(movie.releaseDate).toDateString()}</p>
			<p>Rating: {movie.averageRating ?? "N/A"}</p>
		</div>
	);
};

export default MovieCard;
