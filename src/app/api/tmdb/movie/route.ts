import { NextRequest, NextResponse } from 'next/server'

interface TMDBMovieDetails {
	id: number
	title: string
	poster_path: string | null
	release_date: string
	overview: string
	vote_average: number
	backdrop_path: string | null
	imdb_id: string | null
	director: string[]
	top_cast: string[]
	genre: string[]
}

interface TMDBCreditsResponse {
	cast: Array<{ name: string }>
	crew: Array<{ name: string; job: string }>
}

interface TMDBMovieResponse {
	id: number
	title: string
	poster_path: string | null
	release_date: string
	overview: string
	vote_average: number
	backdrop_path: string | null
	imdb_id: string | null
	genres: Array<{ name: string }>
	credits?: TMDBCreditsResponse
}

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const movieId = searchParams.get('id')

		if (!movieId) {
			return NextResponse.json(
				{ error: 'Movie ID parameter is required' },
				{ status: 400 }
			)
		}

		const tmdbKey = process.env.NEXT_TMDB_KEY

		if (!tmdbKey) {
			return NextResponse.json(
				{ error: 'TMDB API key is not configured' },
				{ status: 500 }
			)
		}

		const response = await fetch(
			`https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbKey}&append_to_response=credits`
		)

		if (!response.ok) {
			throw new Error(`TMDB API error: ${response.statusText}`)
		}

		const data: TMDBMovieResponse = await response.json()

		const director = data.credits?.crew
			?.filter((person) => person.job === 'Director')
			.map((person) => person.name) || []

		const topCast =
			data.credits?.cast?.slice(0, 5).map((person) => person.name) || []

		const genres = data.genres?.map((genre) => genre.name) || []

		const movieDetails: TMDBMovieDetails = {
			id: data.id,
			title: data.title,
			poster_path: data.poster_path,
			release_date: data.release_date,
			overview: data.overview,
			vote_average: data.vote_average,
			backdrop_path: data.backdrop_path,
			imdb_id: data.imdb_id || null,
			director,
			top_cast: topCast,
			genre: genres,
		}

		return NextResponse.json(
			{ movie: movieDetails },
			{
				status: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			}
		)
	} catch (error) {
		console.error('TMDB API error:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch TMDB movie details' },
			{
				status: 500,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			}
		)
	}
}

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	})
}
