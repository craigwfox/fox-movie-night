import { NextRequest, NextResponse } from 'next/server'
import { isUserLoggedIn } from '@/src/utils/supabase/auth'

export async function GET(request: NextRequest) {
	const loggedIn = await isUserLoggedIn()

	if (!loggedIn) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const searchParams = request.nextUrl.searchParams
	const query = searchParams.get('query')

	const response = await fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_TMDB_KEY}&query=${query}`
	)

	const data = await response.json()
	return NextResponse.json(data)
}
