interface Movie {
	id: string;
	name: string;
	imdb_id: string;
	watch_date: string;
	rating_craig: string | null;
	rating_rebecca: string | null;
	picked: string | null;
	release_date: string;
	director: string;
	top_cast: string;
	genre: string;
	tmdb_id: string;
	tmdb_user_score: string;
	poster_path: string;
	backdrop_path: string;
	overview: string;
	slug: string;
	created_at?: string;
}

interface ParsedMovie extends Omit<Movie, "director" | "top_cast" | "genre"> {
	director: string[];
	top_cast: string[];
	genre: string[];
}
