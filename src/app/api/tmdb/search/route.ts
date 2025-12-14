import { NextRequest, NextResponse } from 'next/server'

interface TMDBResult {
	id: number
	title: string
	poster_path: string | null
	release_date: string
	overview: string
	vote_average: number
	backdrop_path: string | null
}

interface TMDBSearchResponse {
	results: TMDBResult[]
	total_pages: number
	total_results: number
}

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const query = searchParams.get('query')

		if (!query) {
			return NextResponse.json(
				{ error: 'Query parameter is required' },
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
			`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${tmdbKey}`
		)

		if (!response.ok) {
			throw new Error(`TMDB API error: ${response.statusText}`)
		}

		const data: TMDBSearchResponse = await response.json()

		return NextResponse.json(
			{ results: data.results || [] },
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
		console.error('❗ TMDB API error:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch TMDB results' },
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
