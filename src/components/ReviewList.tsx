import React from "react";
import ReviewCard from "./ReviewCard";
import { Review } from "../types/interface"; // Adjust import based on your types

interface ReviewListProps {
	reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
	return (
		<div className="space-y-4">
			{reviews.map((review) => (
				<ReviewCard key={review.id} review={review} />
			))}
		</div>
	);
};

export default ReviewList;
