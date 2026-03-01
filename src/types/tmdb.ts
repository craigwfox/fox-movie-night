export type TMDBResult = {
	id: number
	title: string
	poster_path: string | null
	backdrop_path: string | null
	release_date: string
	overview: string
	vote_average: number
}

export type TMDBMovieDetails = {
	id: number
	title: string
	poster_path: string | null
	backdrop_path: string | null
	release_date: string
	overview: string
	vote_average: number
	imdb_id: string | null
	genres: Array<{ id: number; name: string }>
	credits?: {
		cast: Array<{ name: string }>
		crew: Array<{ name: string; job: string }>
	}
}
