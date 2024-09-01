import React, { useState, useEffect } from "react";
import AddMovieModal from "./creation/movieCreation/AddMovieModal";
import AddReviewModal from "./creation/reviewCreation/AddReviewModal";
import { trpc } from "../utils/trpc"; // Adjust the path based on your setup

const Header: React.FC = () => {
	const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
	const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
	const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
	const [movies, setMovies] = useState<any[]>([]); // Adjust the type based on your movie data

	// Fetch movies
	const { data: movieData, refetch: refetchMovies } =
		trpc.movie.getAll.useQuery();

	useEffect(() => {
		if (movieData) {
			setMovies(movieData);
		}
	}, [movieData]);

	const openAddMovieModal = () => setIsAddMovieOpen(true);
	const closeAddMovieModal = () => setIsAddMovieOpen(false);

	const openAddReviewModal = (movieId: number) => {
		setSelectedMovieId(movieId);
		setIsAddReviewOpen(true);
	};
	const closeAddReviewModal = () => setIsAddReviewOpen(false);

	const handleMovieAdded = async () => {
		await refetchMovies(); // Refetch the movie list after adding a movie
	};

	const handleReviewAdded = async () => {
		if (selectedMovieId !== null) {
			await refetchMovies(); // Optionally, refetch movies to ensure review count is up-to-date
			closeAddReviewModal(); // Close the review modal
		}
	};

	return (
		<div className="bg-slate-300 px-2 py-1 flex flex-row justify-between items-center text-slate-700 text-xs font-medium space-x-2 space-y-2">
			<div>MOVIECRITIC</div>
			<div className="flex flex-row space-x-2 items-center justify-center">
				<button
					onClick={openAddMovieModal}
					className="bg-green-500 text-white py-1 px-2 rounded"
				>
					Add Movie
				</button>
				<button
					onClick={() => openAddReviewModal(1)} // Example movie ID; replace with actual logic
					className="bg-blue-500 text-white py-1 px-2 rounded"
				>
					Add Review
				</button>
			</div>

			<AddMovieModal
				isOpen={isAddMovieOpen}
				onClose={closeAddMovieModal}
				onMovieAdded={handleMovieAdded}
			/>
			{selectedMovieId !== null && (
				<AddReviewModal
					isOpen={isAddReviewOpen}
					onClose={closeAddReviewModal}
					movieId={selectedMovieId}
					onReviewAdded={handleReviewAdded}
				/>
			)}
		</div>
	);
};

export default Header;
