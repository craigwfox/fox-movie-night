import { createClient } from '@/src/utils/supabase/server'
import { NextResponse } from 'next/server'

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

// Handle preflight requests for CORS
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
