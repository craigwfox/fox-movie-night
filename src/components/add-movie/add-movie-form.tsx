'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { MovieFormData } from '@/src/types/movie-form'
import { TMDBMovieDetails } from '@/src/types/tmdb'
import { populateMovieData } from '@/src/types/movie-utils'
import { TextInput } from '@/src/components/common/form-inputs/text-input/text-input'
import { SelectInput } from '@/src/components/common/form-inputs/select-input/select-input'
import { Textarea } from '@/src/components/common/form-inputs/textarea/textarea'
import { TmdbResultsList } from './tmdb-results/tmdb-results-list'

const RATING_OPTIONS = [
	{ value: 'great', label: 'Great' },
	{ value: 'good', label: 'Good' },
	{ value: 'ok', label: 'Ok' },
	{ value: 'bad', label: 'Bad' },
	{ value: 'absolute_trash', label: 'Absolute Trash' },
]

const PICKED_OPTIONS = [
	{ value: 'none', label: 'None' },
	{ value: 'Craig', label: 'Craig' },
	{ value: 'Rebecca', label: 'Rebecca' },
]

const formatRating = (rating: string): string => {
	const ratingMap: Record<string, string> = {
		great: 'Great',
		good: 'Good',
		ok: 'Ok',
		bad: 'Bad',
		absolute_trash: 'Absolute Trash',
	}
	return ratingMap[rating] || rating
}

const formatPicked = (picked: string): string => {
	const pickedMap: Record<string, string> = {
		none: 'None',
		craig: 'Craig',
		Craig: 'Craig',
		rebecca: 'Rebecca',
		Rebecca: 'Rebecca',
	}
	return pickedMap[picked] || picked
}

export function AddMovieForm({
	mode = 'add',
	initialData,
	movieId,
}: {
	mode?: 'add' | 'edit'
	initialData?: Partial<MovieFormData>
	movieId?: string
} = {}) {
	const router = useRouter()

	const [isSearching, setIsSearching] = useState(false)
	const [searchResults, setSearchResults] = useState<TMDBMovieDetails[]>([])
	const [selectedMovieId, setSelectedMovieId] = useState<number>()
	const [showResults, setShowResults] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [message, setMessage] = useState<{
		type: 'success' | 'error'
		text: string
	} | null>(null)

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors },
	} = useForm<MovieFormData>({
		defaultValues: {
			watch_name: '',
			watch_date: '',
			craig_pick: 'none',
			craig_rating: 'good',
			rebecca_rating: 'good',
			slug: '',
			imdb_id: '',
			tmdb_id: '',
			release_date: '',
			director: '',
			top_cast: '',
			genre: '',
			user_score: '',
			poster_path: '',
			backdrop_path: '',
			overview: '',
		},
	})

	// Populate form with initial data when in edit mode and clear any messages
	useEffect(() => {
		if (mode === 'edit' && initialData) {
			reset(initialData as MovieFormData)
			setMessage(null)
		}
	}, [mode, initialData, reset])

	const watchName = watch('watch_name')
	const watchDate = watch('watch_date')

	const handleTmdbSearch = async () => {
		if (!watchName.trim()) {
			alert('Please enter a movie name')
			return
		}

		setIsSearching(true)
		setShowResults(true)
		try {
			const response = await fetch(
				`/api/search?query=${encodeURIComponent(watchName)}`,
			)
			if (!response.ok) {
				throw new Error('Search failed')
			}
			const data = await response.json()
			setSearchResults(data.results || [])
		} catch (error) {
			console.error('Error searching TMDB:', error)
			alert('Failed to search TMDB')
			setShowResults(false)
		} finally {
			setIsSearching(false)
		}
	}

	const handleMovieSelect = (movie: TMDBMovieDetails) => {
		setSelectedMovieId(movie.id)
		setSearchResults([])
		setShowResults(false)
		setValue('watch_name', movie.title)
		const movieData = populateMovieData(movie, watchDate)
		Object.entries(movieData).forEach(([key, value]) => {
			setValue(key as keyof MovieFormData, value as any)
		})
	}

	const onSubmit = async (data: MovieFormData) => {
		setIsSubmitting(true)
		setMessage(null)

		try {
			// Format the data with proper title case for ratings and picked
			const formattedData = {
				...data,
				craig_rating: formatRating(data.craig_rating),
				rebecca_rating: formatRating(data.rebecca_rating),
				craig_pick: formatPicked(data.craig_pick),
			}

			const isEditMode = mode === 'edit' && movieId
			const endpoint = isEditMode ? '/api/movies' : '/api/movies'
			const method = isEditMode ? 'PATCH' : 'POST'
			const bodyData = isEditMode
				? { ...formattedData, movieId }
				: formattedData

			const response = await fetch(endpoint, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(bodyData),
			})

			if (!response.ok) {
				const errorData = await response.json()
				if (response.status === 401) {
					setMessage({
						type: 'error',
						text:
							'You must be logged in to ' +
							(isEditMode ? 'update' : 'add') +
							' a movie',
					})
					router.push('/login')
					return
				}
				throw new Error(
					errorData.error || `Failed to ${isEditMode ? 'update' : 'add'} movie`,
				)
			}

			const result = await response.json()
			setMessage({
				type: 'success',
				text: `Movie ${isEditMode ? 'updated' : 'added'} successfully! Redirecting...`,
			})

			// Redirect to the movie page after a brief delay
			setTimeout(() => {
				router.push(`/movie/${result.movie.slug}`)
			}, 1500)
		} catch (error) {
			console.error('Error submitting form:', error)
			const errorText =
				error instanceof Error
					? error.message
					: `Failed to ${mode === 'edit' ? 'update' : 'add'} movie`
			setMessage({
				type: 'error',
				text: errorText,
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="form-wrapper add-movie-form"
		>
			<section id="watch-info" className="form-section">
				<h2>Watch Information</h2>

				<Controller
					name="watch_name"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput
							label="Movie Name"
							id="watch_name"
							required
							value={field.value}
							onChange={field.onChange}
							message={errors.watch_name ? 'Required' : ''}
						/>
					)}
				/>

				<div className="form-control">
					<label htmlFor="watch_date">Watch Date</label>
					<Controller
						name="watch_date"
						control={control}
						rules={{ required: true }}
						render={({ field }) => (
							<>
								<input type="date" id="watch_date" required {...field} />
								{errors.watch_date && <span className="message">Required</span>}
							</>
						)}
					/>
				</div>

				<Controller
					name="craig_pick"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<SelectInput
							label="Picked by"
							id="craig_pick"
							required
							options={PICKED_OPTIONS}
							value={field.value}
							onChange={field.onChange}
							message={errors.craig_pick ? 'Required' : ''}
						/>
					)}
				/>

				<Controller
					name="craig_rating"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<SelectInput
							label="Craig's Rating"
							id="craig_rating"
							required
							options={RATING_OPTIONS}
							value={field.value}
							onChange={field.onChange}
							message={errors.craig_rating ? 'Required' : ''}
						/>
					)}
				/>

				<Controller
					name="rebecca_rating"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<SelectInput
							label="Rebecca's Rating"
							id="rebecca_rating"
							required
							options={RATING_OPTIONS}
							value={field.value}
							onChange={field.onChange}
							message={errors.rebecca_rating ? 'Required' : ''}
						/>
					)}
				/>

				{mode === 'add' && (
					<button
						type="button"
						onClick={handleTmdbSearch}
						disabled={isSearching}
						className="button button-secondary"
					>
						{isSearching ? 'Searching...' : 'Search TMDB'}
					</button>
				)}
			</section>

			{showResults && mode === 'add' && (
				<section id="tmdb-results">
					<h2>Search Results</h2>
					<TmdbResultsList
						results={searchResults}
						loading={isSearching}
						onSelect={handleMovieSelect}
						selectedMovieId={selectedMovieId}
					/>
				</section>
			)}

			<section id="tmdb-data" className="form-section">
				<h2>Movie Data</h2>

				<Controller
					name="slug"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput
							label="Slug"
							id="slug"
							required
							value={field.value}
							onChange={field.onChange}
							message={errors.slug ? 'Required' : ''}
						/>
					)}
				/>

				<Controller
					name="imdb_id"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput
							label="IMDB ID"
							id="imdb_id"
							required
							value={field.value}
							onChange={field.onChange}
							message={errors.imdb_id ? 'Required' : ''}
						/>
					)}
				/>

				<Controller
					name="tmdb_id"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput
							label="TMDB ID"
							id="tmdb_id"
							required
							value={field.value}
							onChange={field.onChange}
							message={errors.tmdb_id ? 'Required' : ''}
						/>
					)}
				/>

				<div className="form-control">
					<label htmlFor="release_date">Release Date</label>
					<Controller
						name="release_date"
						control={control}
						rules={{ required: true }}
						render={({ field }) => (
							<>
								<input type="date" id="release_date" required {...field} />
								{errors.release_date && (
									<span className="message">Required</span>
								)}
							</>
						)}
					/>
				</div>

				<Controller
					name="director"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput
							label="Director"
							id="director"
							required
							value={field.value}
							onChange={field.onChange}
							message={errors.director ? 'Required' : ''}
						/>
					)}
				/>

				<Controller
					name="top_cast"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput
							label="Top Cast"
							id="top_cast"
							required
							value={field.value}
							onChange={field.onChange}
							message={errors.top_cast ? 'Required' : ''}
						/>
					)}
				/>

				<Controller
					name="genre"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput
							label="Genre"
							id="genre"
							required
							value={field.value}
							onChange={field.onChange}
							message={errors.genre ? 'Required' : ''}
						/>
					)}
				/>

				<Controller
					name="user_score"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput
							label="User Score"
							id="user_score"
							required
							value={field.value}
							onChange={field.onChange}
							message={errors.user_score ? 'Required' : ''}
						/>
					)}
				/>

				<Controller
					name="poster_path"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput
							label="Poster Path"
							id="poster_path"
							required
							value={field.value}
							onChange={field.onChange}
							message={errors.poster_path ? 'Required' : ''}
						/>
					)}
				/>

				<Controller
					name="backdrop_path"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<TextInput
							label="Backdrop Path"
							id="backdrop_path"
							required
							value={field.value}
							onChange={field.onChange}
							message={errors.backdrop_path ? 'Required' : ''}
						/>
					)}
				/>

				<Controller
					name="overview"
					control={control}
					rules={{ required: true }}
					render={({ field }) => (
						<Textarea
							label="Overview"
							id="overview"
							required
							value={field.value}
							onChange={field.onChange}
							message={errors.overview ? 'Required' : ''}
						/>
					)}
				/>
			</section>

			<div className="form-controls">
				{message && (
					<div className={`message-banner message-${message.type}`}>
						{message.text}
					</div>
				)}

				<button
					type="submit"
					className="button button-primary"
					disabled={isSubmitting}
				>
					{isSubmitting
						? mode === 'edit'
							? 'Updating Movie...'
							: 'Adding Movie...'
						: mode === 'edit'
							? 'Update Movie'
							: 'Add Movie'}
				</button>
			</div>
		</form>
	)
}
