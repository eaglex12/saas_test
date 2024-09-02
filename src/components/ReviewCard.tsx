import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Review } from "../types/interface"; // Adjust import based on your types
import { trpc } from "../utils/trpc"; // Adjust import based on your trpc setup
import EditReviewModal from "./updation/EditReviewModal"; // Import your EditReviewModal component

interface ReviewCardProps {
	review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
	const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

	const trpcUtils = trpc.useContext();
	const deleteMutation = trpc.review.delete.useMutation({
		onSuccess: () => {
			trpcUtils.review.getAllByMovieId.invalidate(); // Invalidate cache
		},
	});

	const handleEdit = () => {
		setIsModalOpen(true); // Open the modal for editing
	};

	const handleDelete = () => {
		deleteMutation.mutate(review.id);
	};

	return (
		<div className="relative p-6 bg-white-200 shadow-lg border border-gray-400 h-[160px] mx-auto mb-5">
			<div className="flex justify-between">
				<p className="text-gray-900">{review.comments}</p>
				<span className="text-xl text-gray-600 font-bold">
					{review.rating} / 10
				</span>
			</div>
			<div className="flex justify-between items-center mt-8">
				<span className="text-gray-800 italic font-bold">
					By {review.reviewerName}
				</span>
				<div className="flex space-x-2">
					<button className="p-2 hover:bg-blue-200" onClick={handleEdit}>
						<FaEdit size={20} className="text-gray-500" />
					</button>
					<button className="p-2 hover:bg-red-200" onClick={handleDelete}>
						<MdDelete size={20} className="text-gray-500" />
					</button>
				</div>
			</div>
			{isModalOpen && (
				<EditReviewModal
					review={review}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default ReviewCard;
