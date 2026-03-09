import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
}

// Anon/publishable client — no secret keys used
function createAnonClient() {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
	)
}

export async function GET() {
	try {
		const supabase = createAnonClient()
		const { data: movies, error } = await supabase
			.from('movies')
			.select('*')
			.order('watch_date', { ascending: false })
			.limit(10)

		if (error) {
			console.error('❗ supabase error:', error)
			return NextResponse.json(
				{ error: 'Failed to fetch movies' },
				{ status: 500, headers: CORS_HEADERS },
			)
		}

		return NextResponse.json(movies ?? [], {
			status: 200,
			headers: CORS_HEADERS,
		})
	} catch (error) {
		console.error('❗ error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500, headers: CORS_HEADERS },
		)
	}
}

// Handle CORS preflight requests
export async function OPTIONS() {
	return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}
