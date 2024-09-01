import React from "react";
import AddReview from "./AddReview";

interface AddReviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	movieId: number;
	onReviewAdded?: () => Promise<void>; // Make it optional if not always required
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
	isOpen,
	onClose,
	movieId,
	onReviewAdded,
}) => {
	if (!isOpen) return null;

	const handleReviewAdded = async () => {
		if (onReviewAdded) {
			await onReviewAdded(); // Call the onReviewAdded function if provided
		}
		onClose(); // Close the modal after the review is added
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white p-6 rounded shadow-lg w-80">
				<h2 className="text-xl font-semibold mb-4">Add New Review</h2>
				<AddReview
					movieId={movieId}
					onReviewAdded={handleReviewAdded} // Pass handleReviewAdded to AddReview
				/>
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

export default AddReviewModal;
