import { getMovies } from '@/src/utils/supabase/queries'
import MovieGridClient from './movie-grid-client'

export async function MovieGrid() {
	const movies: Movie[] = (await getMovies()) || []
	movies.sort((a, b) => {
		return new Date(b.watch_date).getTime() - new Date(a.watch_date).getTime()
	})

	const yearList = [
		'All',
		...new Set(movies?.map((x) => new Date(x.watch_date).getFullYear())),
	]
		.sort()
		.reverse()

	return (
		<section className="movie-grid__wrapper" aria-labelledby="movie-grid">
			<MovieGridClient movies={movies || []} yearList={yearList as number[]} />
		</section>
	)
}
