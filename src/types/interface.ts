export interface Movie {
	id: number;
	name: string;
	releaseDate: Date;
	averageRating?: number | null;
}

export interface Review {
	id: number;
	movieId: number;
	reviewerName?: string | null;
	rating: number;
	comments: string;
}
