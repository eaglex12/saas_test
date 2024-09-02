import React, { useState, useEffect } from "react";
import { Movie } from "../../types/interface";
import { trpc } from "../../utils/trpc"; // Adjust import based on your TRPC setup
import Image from "next/image";
import { format, parseISO } from "date-fns"; // Import date-fns for date parsing and formatting

interface EditMovieModalProps {
	movie: Movie;
	onClose: () => void;
}

const EditMovieModal: React.FC<EditMovieModalProps> = ({ movie, onClose }) => {
	const [name, setName] = useState(movie.name);
	const [releaseDate, setReleaseDate] = useState<string>(() =>
		format(movie.releaseDate, "yyyy-MM-dd")
	);
	const [averageRating, setAverageRating] = useState(movie.averageRating || 0);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const mutation = trpc.movie.update.useMutation();

	const handleSave = async () => {
		try {
			setLoading(true); // Show loading spinner when mutation starts
			await mutation.mutateAsync({
				id: movie.id,
				name,
				releaseDate, // Send releaseDate as string in 'YYYY-MM-DD' format
				averageRating,
			});
			onClose(); // Close the modal after successful update
		} catch (error) {
			setError("Failed to update movie. Please try again.");
		} finally {
			setLoading(false); // Hide loading spinner on success or error
		}
	};

	useEffect(() => {
		setName(movie.name);
		setReleaseDate(format(movie.releaseDate, "yyyy-MM-dd"));
		setAverageRating(movie.averageRating || 0);
	}, [movie]);

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white p-8 rounded-lg shadow-lg w-[700px] max-w-3xl h-[500px] relative flex flex-col">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
				>
					<span className="text-2xl">&times;</span> {/* Close button */}
				</button>
				<h2 className="text-2xl font-semibold mb-4">Edit Movie</h2>
				<div className="flex-1 overflow-y-auto mt-6">
					{/* Ensure the form is scrollable if it overflows */}
					<div className="flex flex-col space-y-4">
						<div className="mb-4">
							<label className="block text-gray-700 mb-1" htmlFor="name">
								Name
							</label>
							<input
								type="text"
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-gray-700 mb-1" htmlFor="releaseDate">
								Release Date
							</label>
							<input
								type="date"
								id="releaseDate"
								value={releaseDate}
								onChange={(e) => setReleaseDate(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded"
							/>
						</div>
						<div className="mb-4">
							<label
								className="block text-gray-700 mb-1"
								htmlFor="averageRating"
							>
								Average Rating
							</label>
							<input
								type="number"
								id="averageRating"
								value={averageRating}
								onChange={(e) => setAverageRating(Number(e.target.value))}
								className="w-full p-2 border border-gray-300 rounded"
								min="0"
								max="10"
							/>
						</div>
						{error && <p className="text-red-500 text-xs">{error}</p>}
						<div className="flex justify-end space-x-2">
							<button
								onClick={onClose}
								className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								disabled={loading}
							>
								{loading ? "Saving..." : "Save"}
							</button>
						</div>
					</div>
				</div>
				{loading && (
					<div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
						<Image
							src="/giphy.gif" // Replace with your loading spinner URL
							alt="Loading..."
							width={32}
							height={32}
							className="w-8 h-8"
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default EditMovieModal;
