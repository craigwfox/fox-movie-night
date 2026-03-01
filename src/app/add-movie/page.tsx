import { isUserLoggedIn } from '@/src/utils/supabase/auth'
import { redirect } from 'next/navigation'

export default async function AddMovie() {
	const loggedIn = await isUserLoggedIn()
	if (!loggedIn) redirect('/login')

	return (
		<main className="section-wrapper">
			<h1>Add movie</h1>

			<section id="watch-info">
				{/*
					Watch fields
					Name - Text input
					Date - Date input
					Picked - Select - Options: None, Craig, Rebecca
					Craig's Rating - Select - Options: Great, Good, Ok, Bad, Absolute Trash
					Rebecca's Rating - Select - Options: Great, Good, Ok, Bad, Absolute Trash

					Button to user the Name input to search TMDB using the /api/search endpoint
				 */}
			</section>
			<section id="tmdb-data">
				<div>
					{/*
						TMDB search items
						Show list of cards with the api results from the button click above
						Card:
							- Movie Cover
							- Movie title
							- Release Date
					*/}
				</div>
				<div>
					{/*
						TMDB input fields
						Slug - Text input
						IMDB ID - Text input
						TMDB ID - Text input
						Release date - Date input - YYYYMMDD
						Director - Text input - Will need to take a list and make it a comma string
						Top cast - Text input - Will need to take a list and make it a comma string
						Genre - Text input - Will need to take a list and make it a comma string
						User score - Text input
						Poster path - Text input
						Backdrop path - Text input
						Overview - Textarea
					*/}
				</div>
			</section>
		</main>
	)
}
