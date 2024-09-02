import React, { useState } from "react";
import Image from "next/image";
import { trpc } from "../../../utils/trpc"; // Adjust the path based on your setup

interface AddMovieProps {
	onMovieAdded: () => void;
}

export const AddMovie: React.FC<AddMovieProps> = ({ onMovieAdded }) => {
	const [movieName, setMovieName] = useState("");
	const [releaseDate, setReleaseDate] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false); // New state for loading

	const mutation = trpc.movie.create.useMutation({
		onMutate: () => {
			setLoading(true); // Show loading spinner when mutation starts
		},
		onSuccess: () => {
			setMovieName("");
			setReleaseDate("");
			setError(null);
			setLoading(false); // Hide loading spinner on success
			onMovieAdded(); // Notify parent component that a movie was added
		},
		onError: (error) => {
			setError("Failed to add movie. Please try again.");
			setLoading(false); // Hide loading spinner on error
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (movieName && releaseDate) {
			mutation.mutate({ name: movieName, releaseDate });
		} else {
			setError("Please fill out all fields.");
		}
	};

	return (
		<div className="flex flex-col space-y-4">
			<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
				<input
					type="text"
					placeholder="Movie Name"
					value={movieName}
					onChange={(e) => setMovieName(e.target.value)}
					className="p-3 border rounded border-gray-300"
				/>
				<input
					type="date"
					value={releaseDate}
					onChange={(e) => setReleaseDate(e.target.value)}
					className="p-3 border rounded border-gray-300"
				/>
				{error && <p className="text-red-500 text-xs">{error}</p>}
				<button
					type="submit"
					className="bg-violet-600 text-white py-2 px-4 rounded self-end"
					disabled={loading} // Disable button while loading
				>
					{loading ? "Adding Movie..." : "Create movie"}{" "}
					{/* Show loading state */}
				</button>
			</form>
			{loading && (
				<div className="flex justify-center mt-4">
					<Image
						src="/giphy.gif" // Replace with your loading spinner URL
						alt="Loading..."
						width={32} // Set the width of the spinner
						height={32} // Set the height of the spinner
						className="w-8 h-8"
					/>
				</div>
			)}
		</div>
	);
};
