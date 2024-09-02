import React, { useState, useEffect } from "react";
import { trpc } from "../utils/trpc"; // Adjust import based on your TRPC setup

const ReviewSearch: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [allReviews, setAllReviews] = useState<any[]>([]);
	const [filteredReviews, setFilteredReviews] = useState<any[]>([]);

	// Fetch all reviews initially
	const { data: reviewsData, error, isLoading } = trpc.review.getAll.useQuery();

	useEffect(() => {
		if (reviewsData) {
			setAllReviews(reviewsData);
			setFilteredReviews(reviewsData); // Set initial filtered reviews
		}
	}, [reviewsData]);

	useEffect(() => {
		if (searchQuery.trim() === "") {
			setFilteredReviews(allReviews); // Show all reviews if search query is empty
		} else {
			// Filter reviews based on search query
			setFilteredReviews(
				allReviews.filter((review) =>
					review.comments.toLowerCase().includes(searchQuery.toLowerCase())
				)
			);
		}
	}, [searchQuery, allReviews]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	return (
		<div className="p-4 h-[100vh] bg-white">
			<h1 className="text-2xl font-bold mb-4">Search Reviews</h1>
			<input
				type="text"
				value={searchQuery}
				onChange={handleChange}
				className="w-[700px] p-2 border border-gray-300 rounded"
				placeholder="Enter comment or Reviewer name to search..."
			/>
			<div className="mt-4">
				{isLoading ? (
					<p>Loading...</p>
				) : error ? (
					<p>Error: {error.message}</p>
				) : filteredReviews.length > 0 ? (
					<ul>
						{filteredReviews.map((review) => (
							<li
								key={review.id}
								className="mb-4 p-4 border border-gray-300 rounded"
							>
								<h2 className="text-xl font-bold">
									Reviewer Name: {review.reviewerName}
								</h2>
								<p className="text-gray-700">Rating: {review.rating} / 10</p>
								<p className="text-gray-700">{review.comments}</p>
							</li>
						))}
					</ul>
				) : (
					<p>No reviews found.</p>
				)}
			</div>
		</div>
	);
};

export default ReviewSearch;
