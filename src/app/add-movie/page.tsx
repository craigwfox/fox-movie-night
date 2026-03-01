import { Suspense } from 'react'
import { isUserLoggedIn } from '@/src/utils/supabase/auth'
import { redirect } from 'next/navigation'
import { AddMovieForm } from '@/src/components/add-movie/add-movie-form'

async function AddMovieAuthGuard() {
	const loggedIn = await isUserLoggedIn()
	if (!loggedIn) redirect('/login')

	return <AddMovieForm />
}

export default function AddMovie() {
	return (
		<main className="section-wrapper">
			<h1>Add movie</h1>
			<Suspense fallback={<div className="form-control">Loading form...</div>}>
				<AddMovieAuthGuard />
			</Suspense>
		</main>
	)
}
