import React, { useState, useEffect } from "react";
import { trpc } from "../utils/trpc";
import { MovieList } from "../components/MovieList";
import { SearchBar } from "../components/SearchBar";
import Image from "next/image";

const HomePage: React.FC = () => {
	const [query, setQuery] = useState("");
	const [movies, setMovies] = useState<any[]>([]);
	const [fetchedMovies, setFetchedMovies] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { data = [], isLoading, isError } = trpc.movie.getAll.useQuery();

	useEffect(() => {
		if (isLoading) {
			setLoading(true);
			setError(null);
		} else if (isError) {
			setLoading(false);
			setError("Error loading movies. Please try again later.");
		} else if (Array.isArray(data)) {
			setLoading(false);
			setFetchedMovies(data); // Update fetchedMovies state
			setMovies(data); // Set the initial movies to display
		} else {
			setLoading(false);
			setFetchedMovies([]); // Handle case where data is not an array
			setMovies([]);
		}
	}, [isLoading, isError, data]);

	const handleSearch = (searchQuery: string) => {
		setQuery(searchQuery);
		// Filter movies based on query
		const filteredMovies = fetchedMovies.filter((movie) =>
			movie.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
		setMovies(filteredMovies);
	};

	return (
		<div className="p-6 bg-gray-50 min-h-screen">
			<h1 className="text-4xl font-bold text-gray-800 mb-6">
				The best movie reviews site!
			</h1>
			<SearchBar onSearch={handleSearch} />

			{loading && (
				<div className="flex flex-col items-center mt-4">
					<p className="text-lg text-gray-700">Loading the Movie List...</p>
				</div>
			)}

			{!loading && error && (
				<div className="flex justify-center items-center h-screen bg-gray-100">
					<p className="text-lg text-red-500">{error}</p>
				</div>
			)}

			{!loading && !error && (
				<div className="mt-4">
					<MovieList movies={movies} />
				</div>
			)}
		</div>
	);
};

export default HomePage;
