import { MovieFormData } from './movie-form'
import { TMDBMovieDetails } from './tmdb'

export function generateSlug(movieName: string, watchDate: string): string {
	const year = new Date(watchDate).getFullYear()
	const slug = movieName
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Remove special characters
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
		.trim()

	return `${year}-${slug}`
}

export function populateMovieData(
	movie: TMDBMovieDetails,
	watchDate: string
): Partial<MovieFormData> {
	const directorArray = movie.credits?.crew
		?.filter((person) => person.job === 'Director')
		.map((person) => person.name) || []

	const topCastArray = movie.credits?.cast
		?.slice(0, 5)
		.map((actor) => actor.name) || []

	const genreArray = movie.genres.map((g) => g.name)

	return {
		slug: generateSlug(movie.title, watchDate),
		imdb_id: movie.imdb_id || '',
		tmdb_id: String(movie.id),
		release_date: movie.release_date,
		director: JSON.stringify(directorArray),
		top_cast: JSON.stringify(topCastArray),
		genre: JSON.stringify(genreArray),
		user_score: String(movie.vote_average),
		poster_path: movie.poster_path || '',
		backdrop_path: movie.backdrop_path || '',
		overview: movie.overview,
	}
}
