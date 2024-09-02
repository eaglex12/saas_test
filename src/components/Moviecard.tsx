import React, { useState } from "react";
import { useRouter } from "next/router";
import { Movie } from "../types/interface";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import EditMovieModal from "./updation/EditMovieModal"; // Import the EditMovieModal
import { format, parse } from "date-fns"; // Import format and parse functions from date-fns
import { enGB } from "date-fns/locale"; // Import locale for English (Great Britain)

// Helper function to format date with ordinal suffix
const formatWithOrdinal = (date: Date) => {
	const day = format(date, "d", { locale: enGB });
	const month = format(date, "MMMM", { locale: enGB });
	const year = format(date, "yyyy");
	const dayWithSuffix =
		day +
		(["1", "21", "31"].includes(day)
			? "st"
			: ["2", "22"].includes(day)
			? "nd"
			: ["3", "23"].includes(day)
			? "rd"
			: "th");
	return `${dayWithSuffix} ${month}, ${year}`;
};

interface MovieCardProps {
	movie: Movie;
	onDelete: (id: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onDelete }) => {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

	// Format the release date to 'd MMMM, yyyy' with ordinal suffix
	const formattedReleaseDate = formatWithOrdinal(new Date(movie.releaseDate));

	const handleClick = () => {
		router.push(`/movie/${movie.id}`);
	};

	return (
		<div className="relative p-6 bg-violet-200 shadow-lg cursor-pointer ">
			<h3 className="text-2xl text-gray-900 mb-4" onClick={handleClick}>
				{movie.name}{" "}
			</h3>
			<p className="text-gray-700 italic mb-3" onClick={handleClick}>
				Release Date: {formattedReleaseDate}
			</p>
			<p className="text-gray-700 font-bold mb-4" onClick={handleClick}>
				Rating:{" "}
				{movie.averageRating ? `${movie.averageRating.toFixed(2)} / 10` : "N/A"}
			</p>

			<div className="absolute bottom-2 right-2 flex space-x-2">
				<button
					className="p-1 hover:bg-green-200"
					onClick={() => setIsModalOpen(true)} // Open the modal
				>
					<FaEdit size={20} className="text-gray-500" />
				</button>
				<button
					className="p-1 hover:bg-red-200"
					onClick={() => onDelete(movie.id)}
				>
					<MdDelete size={20} className="text-gray-500" />
				</button>
			</div>

			{isModalOpen && (
				<EditMovieModal movie={movie} onClose={() => setIsModalOpen(false)} />
			)}
		</div>
	);
};

export default MovieCard;
