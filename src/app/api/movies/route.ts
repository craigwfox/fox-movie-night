import { createClient } from '@/src/utils/supabase/server'
import { isUserLoggedIn } from '@/src/utils/supabase/auth'
import { NextRequest, NextResponse } from 'next/server'
import type { MovieFormData } from '@/src/types/movie-form'

export async function GET() {
	try {
		const supabase = await createClient()
		const { data: movies, error } = await supabase
			.from('movies')
			.select()
			.order('watch_date', { ascending: false })
			.limit(10)

		if (error) {
			console.error('❗ supabase error:', error)
			return NextResponse.json(
				{ error: 'Failed to fetch movies' },
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

		return NextResponse.json(
			{ movies: movies || [] },
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
		console.error('❗ error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
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

export async function POST(request: NextRequest) {
	try {
		const loggedIn = await isUserLoggedIn()
		if (!loggedIn) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const body = (await request.json()) as MovieFormData

		// Transform form data to database schema
		const movieData = {
			name: body.watch_name,
			watch_date: body.watch_date,
			picked: body.craig_pick,
			rating_craig: body.craig_rating,
			rating_rebecca: body.rebecca_rating,
			slug: body.slug,
			imdb_id: body.imdb_id,
			tmdb_id: body.tmdb_id,
			release_date: body.release_date,
			director: body.director,
			top_cast: body.top_cast,
			genre: body.genre,
			tmdb_user_score: body.user_score,
			poster_path: body.poster_path,
			backdrop_path: body.backdrop_path,
			overview: body.overview,
		}

		const supabase = await createClient()
		const { data: insertedMovie, error } = await supabase
			.from('movies')
			.insert([movieData])
			.select()
			.single()

		if (error) {
			console.error('❗ insert error:', error)
			return NextResponse.json(
				{ error: `Failed to insert movie: ${error.message}` },
				{ status: 400 }
			)
		}

		return NextResponse.json(
			{ movie: insertedMovie },
			{ status: 201 }
		)
	} catch (error) {
		console.error('❗ POST error:', error)
		const message = error instanceof Error ? error.message : 'Internal server error'
		return NextResponse.json(
			{ error: message },
			{ status: 500 }
		)
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const loggedIn = await isUserLoggedIn()
		if (!loggedIn) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const body = (await request.json()) as MovieFormData & { movieId: string }
		const { movieId, ...movieFormData } = body

		if (!movieId) {
			return NextResponse.json(
				{ error: 'Movie ID is required' },
				{ status: 400 }
			)
		}

		// Transform form data to database schema
		const movieData = {
			name: movieFormData.watch_name,
			watch_date: movieFormData.watch_date,
			picked: movieFormData.craig_pick,
			rating_craig: movieFormData.craig_rating,
			rating_rebecca: movieFormData.rebecca_rating,
			slug: movieFormData.slug,
			imdb_id: movieFormData.imdb_id,
			tmdb_id: movieFormData.tmdb_id,
			release_date: movieFormData.release_date,
			director: movieFormData.director,
			top_cast: movieFormData.top_cast,
			genre: movieFormData.genre,
			tmdb_user_score: movieFormData.user_score,
			poster_path: movieFormData.poster_path,
			backdrop_path: movieFormData.backdrop_path,
			overview: movieFormData.overview,
		}

		const supabase = await createClient()
		const { data: updatedMovie, error } = await supabase
			.from('movies')
			.update(movieData)
			.eq('id', movieId)
			.select()
			.single()

		if (error) {
			console.error('❗ update error:', error)
			return NextResponse.json(
				{ error: `Failed to update movie: ${error.message}` },
				{ status: 400 }
			)
		}

		return NextResponse.json(
			{ movie: updatedMovie },
			{ status: 200 }
		)
	} catch (error) {
		console.error('❗ PATCH error:', error)
		const message = error instanceof Error ? error.message : 'Internal server error'
		return NextResponse.json(
			{ error: message },
			{ status: 500 }
		)
	}
}

// Handle preflight requests for CORS
export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	})
}
