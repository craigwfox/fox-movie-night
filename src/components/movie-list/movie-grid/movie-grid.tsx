import { createClient } from '@/src/utils/supabase/server'
import MovieGridClient from './movie-grid-client'

export async function MovieGrid() {
	const supabase = await createClient()

	const { data: movies } = (await supabase.from('movies').select()) as {
		data: Movie[] | null
	}

	const yearList = [
		'All',
		...new Set(movies?.map((x) => new Date(x.watch_date).getFullYear())),
	]
		.sort()
		.reverse()

	return (
		<section className="movie-grid__wrapper" aria-labelledby="movie-grid">
			<MovieGridClient
				movies={movies?.reverse() || []}
				yearList={yearList as number[]}
			/>
		</section>
	)
}
