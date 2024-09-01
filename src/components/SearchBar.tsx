import React, { useState } from "react";

interface SearchBarProps {
	onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	const [query, setQuery] = useState("");

	const handleSearch = () => {
		onSearch(query);
	};

	return (
		<div className="flex items-center space-x-2">
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search movies..."
				className="p-2 border rounded"
			/>
			<button
				onClick={handleSearch}
				className="p-2 bg-blue-500 text-white rounded"
			>
				Search
			</button>
		</div>
	);
};
