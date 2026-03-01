import { NextRequest, NextResponse } from 'next/server'
import { isUserLoggedIn } from '@/src/utils/supabase/auth'

export async function GET(request: NextRequest) {
	const loggedIn = await isUserLoggedIn()

	if (!loggedIn) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const searchParams = request.nextUrl.searchParams
	const query = searchParams.get('query')

	try {
		// Search for movies
		const searchResponse = await fetch(
			`https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_TMDB_KEY}&query=${encodeURIComponent(query || '')}`
		)

		if (!searchResponse.ok) {
			return NextResponse.json(
				{ error: 'TMDB search failed' },
				{ status: 502 }
			)
		}

		const searchData = await searchResponse.json()

		// Fetch detailed information for each result
		const detailedResults = await Promise.all(
			searchData.results.slice(0, 10).map(async (movie: any) => {
				const detailResponse = await fetch(
					`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.NEXT_TMDB_KEY}&append_to_response=credits`
				)

				if (!detailResponse.ok) {
					return movie
				}

				return await detailResponse.json()
			})
		)

		return NextResponse.json({ results: detailedResults })
	} catch (error) {
		console.error('Search error:', error)
		return NextResponse.json(
			{ error: 'Search failed' },
			{ status: 500 }
		)
	}
}
