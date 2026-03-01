import { Suspense } from 'react'
import { isUserLoggedIn } from '@/src/utils/supabase/auth'
import { redirect, notFound } from 'next/navigation'
import { getMovieBySlug } from '@/src/utils/supabase/queries'
import { AddMovieForm } from '@/src/components/add-movie/add-movie-form'
import { MovieFormData } from '@/src/types/movie-form'

function stringToCommaSeparated(str: string): string {
	try {
		const parsed = JSON.parse(str)
		return Array.isArray(parsed) ? parsed.join(', ') : str
	} catch {
		return str
	}
}

function formatRatingForForm(rating: string | null): 'great' | 'good' | 'ok' | 'bad' | 'absolute_trash' {
	if (!rating) return 'good'
	const lowerRating = rating.toLowerCase().replace(/\s+/g, '_')
	const validRatings: ('great' | 'good' | 'ok' | 'bad' | 'absolute_trash')[] = ['great', 'good', 'ok', 'bad', 'absolute_trash']
	return validRatings.includes(lowerRating as any) ? (lowerRating as any) : 'good'
}

function formatPickedForForm(picked: string | null): 'none' | 'Craig' | 'Rebecca' {
	if (!picked) return 'none'
	// Normalize to handle any case variation
	if (picked.toLowerCase() === 'craig') return 'Craig'
	if (picked.toLowerCase() === 'rebecca') return 'Rebecca'
	return 'none'
}

async function EditMovieAuthGuard({ params }: { params: Promise<{ slug: string }> }) {
	const loggedIn = await isUserLoggedIn()
	if (!loggedIn) redirect('/login')

	const { slug } = await params
	const movieData = await getMovieBySlug(slug)

	if (!movieData) {
		notFound()
	}

	// Transform Movie data to MovieFormData format
	const initialData: MovieFormData = {
		watch_name: movieData.name,
		watch_date: movieData.watch_date,
		craig_pick: formatPickedForForm(movieData.picked),
		craig_rating: formatRatingForForm(movieData.rating_craig),
		rebecca_rating: formatRatingForForm(movieData.rating_rebecca),
		slug: movieData.slug,
		imdb_id: movieData.imdb_id,
		tmdb_id: movieData.tmdb_id,
		release_date: movieData.release_date,
		director: stringToCommaSeparated(movieData.director),
		top_cast: stringToCommaSeparated(movieData.top_cast),
		genre: stringToCommaSeparated(movieData.genre),
		user_score: movieData.tmdb_user_score,
		poster_path: movieData.poster_path,
		backdrop_path: movieData.backdrop_path,
		overview: movieData.overview,
	}

	return (
		<AddMovieForm
			mode="edit"
			initialData={initialData}
			movieId={movieData.id}
		/>
	)
}

export default function EditMovie({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	return (
		<main className="section-wrapper">
			<h1>Update movie</h1>
			<Suspense fallback={<div className="form-control">Loading form...</div>}>
				<EditMovieAuthGuard params={params} />
			</Suspense>
		</main>
	)
}
