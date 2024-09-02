import React, { useState, useEffect } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

interface SearchBarProps {
	onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	const [query, setQuery] = useState("");

	// Trigger the search whenever the query changes
	useEffect(() => {
		onSearch(query);
	}, [query, onSearch]);

	return (
		<div className="flex items-center border-2 border-[#7828C8] rounded-lg p-2 space-x-2 w-[30%] bg-white">
			<HiMagnifyingGlass size={16} className="text-[#7828C8] m-1" />
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search for your favourite movie"
				className="flex-grow p-2 border-none rounded-lg bg-white text-gray-800 focus:outline-none"
			/>
		</div>
	);
};
