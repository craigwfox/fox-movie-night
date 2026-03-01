import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cacheTag } from 'next/cache'
import { createClient } from '@/src/utils/supabase/server'

// Cookie-free client safe to use inside "use cache" — read-only, no auth needed
function createAnonClient() {
	return createSupabaseClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
	)
}

export async function getMovies() {
	'use cache'
	cacheTag('movies')

	const supabase = createAnonClient()
	const { data, error } = (await supabase.from('movies').select('*')) as {
		data: Movie[] | null
		error: unknown
	}

	if (error) throw error
	return data
}

export async function getMovieBySlug(slug: string) {
	'use cache'
	cacheTag('movies')

	const supabase = createAnonClient()
	const { data, error } = (await supabase
		.from('movies')
		.select('*')
		.eq('slug', slug)
		.single()) as {
		data: Movie | null
		error: unknown
	}

	if (error) throw error
	return data
}

export const insertMovie = async (movie: Movie) => {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('movies')
		.insert([movie])
		.select()
		.single()

	if (error) {
		throw new Error(`Failed to insert movie: ${error.message}`)
	}

	return data as Movie
}
