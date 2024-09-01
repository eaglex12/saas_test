import React from "react";
import { AddMovie } from "./AddMovie";

interface AddMovieModalProps {
	isOpen: boolean;
	onClose: () => void;
	onMovieAdded: () => void;
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({
	isOpen,
	onClose,
	onMovieAdded,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white p-6 rounded shadow-lg w-80">
				<h2 className="text-xl font-semibold mb-4">Add New Movie</h2>
				<AddMovie onMovieAdded={onMovieAdded} />
				<button
					onClick={onClose}
					className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default AddMovieModal;
