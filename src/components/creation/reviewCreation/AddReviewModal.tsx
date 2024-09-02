import React from "react";
import AddReview from "./AddReview";

interface AddReviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	onReviewAdded?: () => Promise<void>;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
	isOpen,
	onClose,
	onReviewAdded,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white p-8 rounded-lg shadow-lg w-[700px] max-w-3xl h-[550px] relative flex flex-col">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
				>
					<span className="text-2xl">&times;</span> {/* Cross button */}
				</button>
				<h2 className="text-2xl font-semibold mb-4">Add New Review</h2>
				<div className="flex-1 overflow-y-auto mt-6">
					{/* Ensure the form is scrollable if it overflows */}
					<AddReview onReviewAdded={onReviewAdded} />
				</div>
			</div>
		</div>
	);
};

export default AddReviewModal;
