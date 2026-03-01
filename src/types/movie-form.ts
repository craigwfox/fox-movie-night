export type MovieFormData = {
	// Watch information
	watch_name: string
	watch_date: string
	craig_pick: 'none' | 'craig' | 'rebecca'
	craig_rating: 'great' | 'good' | 'ok' | 'bad' | 'absolute_trash'
	rebecca_rating: 'great' | 'good' | 'ok' | 'bad' | 'absolute_trash'

	// TMDB data
	slug: string
	imdb_id: string
	tmdb_id: string
	release_date: string
	director: string
	top_cast: string
	genre: string
	user_score: string
	poster_path: string
	backdrop_path: string
	overview: string
}
