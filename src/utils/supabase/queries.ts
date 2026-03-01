import { cache } from 'react'
import { createClient } from '@/src/utils/supabase/server'

export const getMovies = cache(async () => {
	const supabase = await createClient()
	const { data, error } = (await supabase.from('movies').select('*')) as {
		data: Movie[] | null
		error: unknown
	}

	if (error) throw error
	return data
})

export const getMovieBySlug = cache(async (slug: string) => {
	const supabase = await createClient()
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
})

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
