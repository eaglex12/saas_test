import React from "react";
import ReviewCard from "./ReviewCard";
import { Review } from "../types/interface"; // Adjust import based on your types

interface ReviewListProps {
	reviews: Review[];
	movieName: string;
	averageRating: string | null;
}

const ReviewList: React.FC<ReviewListProps> = ({
	reviews,
	movieName,
	averageRating,
}) => {
	return (
		<div className="h-screen overflow-y-auto p-4">
			{/* Movie details */}
			<div className="mb-4 flex justify-between items-center">
				<h1 className="text-3xl font-bold">{movieName}</h1>
				{averageRating && (
					<span className="text-3xl font-bold text-violet-600">
						{averageRating}/10
					</span>
				)}
			</div>
			{/* Reviews */}
			<div className="space-y-4 mt-10">
				{reviews.map((review) => (
					<ReviewCard key={review.id} review={review} />
				))}
			</div>
		</div>
	);
};

export default ReviewList;
