import React, { useState, useEffect } from "react";
import AddMovieModal from "./creation/movieCreation/AddMovieModal";
import AddReviewModal from "./creation/reviewCreation/AddReviewModal";
import { trpc } from "../utils/trpc"; // Adjust the path based on your setup
import { useRouter } from "next/router"; // Import useRouter from next/router

const Header: React.FC = () => {
	const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
	const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
	const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
	const [movies, setMovies] = useState<any[]>([]);

	const router = useRouter(); // Create the router object

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
		await refetchMovies();
	};

	const handleReviewAdded = async () => {
		if (selectedMovieId !== null) {
			await refetchMovies();
			closeAddReviewModal();
		}
	};

	const goToReviewSearch = () => {
		router.push("/review-search"); // Navigate to the review search page
	};

	return (
		<div className="bg-gray-200 px-4 py-4 flex justify-between items-center text-slate-700 font-semibold h-20">
			<div className="text-xl font-medium ml-4  math">MOVIECRITIC</div>
			{/* Added margin-left here */}
			<div className="flex space-x-4">
				<button
					onClick={openAddMovieModal}
					className="bg-white text-violet-600 border border-violet-300 py-1 px-4 rounded hover:bg-gray-100 transition"
				>
					Add new movie
				</button>
				<button
					onClick={() => openAddReviewModal(1)} // Example movie ID
					className="bg-violet-600 text-white border border-violet-800 py-1 px-4 rounded hover:bg-violet-700 transition"
				>
					Add new review
				</button>
				<button
					onClick={goToReviewSearch} // Redirect to review search page
					className="bg-green-600 text-white border border-green-800 py-1 px-4 rounded hover:bg-green-700 transition"
				>
					Search reviews
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
					onReviewAdded={handleReviewAdded}
				/>
			)}
		</div>
	);
};

export default Header;
