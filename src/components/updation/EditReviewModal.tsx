import React, { useState } from "react";
import { Review } from "../../types/interface"; // Ensure this import path is correct
import { trpc } from "../../utils/trpc"; // Ensure this import path is correct

interface EditReviewModalProps {
	review: Review;
	onClose: () => void;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({
	review,
	onClose,
}) => {
	const [reviewDetails, setReviewDetails] = useState({
		reviewerName: review.reviewerName || "",
		rating: review.rating.toString(), // Convert number to string for the input field
		comments: review.comments,
	});

	const updateMutation = trpc.review.update.useMutation({
		onSuccess: () => {
			onClose(); // Close the modal on success
		},
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setReviewDetails({
			...reviewDetails,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Convert rating back to number
		const updatedReviewDetails = {
			...reviewDetails,
			rating: Number(reviewDetails.rating), // Convert string to number
		};

		updateMutation.mutate({
			id: review.id,
			...updatedReviewDetails,
		});
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
			<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
				<h2 className="text-xl font-bold mb-4">Edit Review</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Reviewer Name</label>
						<input
							type="text"
							name="reviewerName"
							value={reviewDetails.reviewerName}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Rating</label>
						<input
							type="number"
							name="rating"
							min="0"
							max="10"
							value={reviewDetails.rating}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2">Comments</label>
						<textarea
							name="comments"
							value={reviewDetails.comments}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded"
						/>
					</div>
					<div className="flex justify-end space-x-2">
						<button
							type="button"
							className="px-4 py-2 bg-gray-500 text-white rounded"
							onClick={onClose}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-500 text-white rounded"
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditReviewModal;
