import React from "react";
import { Review } from "../types/interface"; // Adjust import based on your types

interface ReviewCardProps {
	review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
	return (
		<div className="flex justify-between items-start mt-4 border-2 border-gray-200 px-4 py-4 mb-5">
			<div>
				<p className="text-custom-black mb-4">{review.comments}</p>
				<span className="text-custom-black italic font-bold">
					By {review.reviewerName}
				</span>
			</div>
			<div className="flex items-center justify-end">
				<span className="text-xl mr-2 text-custom-blue">{review.rating}</span>
			</div>
		</div>
	);
};

export default ReviewCard;
