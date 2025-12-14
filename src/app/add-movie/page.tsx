'use client'

import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SelectInput from '@/src/components/common/form-inputs/select-input/select-input'
import TextInput from '@/src/components/common/form-inputs/text-input/text-input'
import Textarea from '@/src/components/common/form-inputs/textarea/textarea'
import TMDBResultsList from '@/src/components/add-movie/tmdb-results/tmdb-results-list'
import { DateItem } from '@/src/utils/formatting/dates'
import { createClient } from '@/src/utils/supabase/client'
import { useEffect } from 'react'

interface TMDBResult {
	id: number
	title: string
	poster_path: string | null
	release_date: string
	overview: string
	vote_average: number
	backdrop_path: string | null
}

interface TMDBMovieDetails {
	id: number
	title: string
	poster_path: string | null
	release_date: string
	overview: string
	vote_average: number
	backdrop_path: string | null
	imdb_id: string | null
	director: string[]
	top_cast: string[]
	genre: string[]
}

interface AddMovieFormData {
	// Watching info
	movieName: string
	watchDate: string
	picked: string
	craigsRating: string
	rebeccasRating: string
	// Movie info
	slug: string
	imdbId: string
	tmdbId: string
	releaseDate: string
	director: string
	topCast: string
	genre: string
	userScore: string
	posterPath: string
	backdropPath: string
	overview: string
}

export default function AddMovie() {
	const router = useRouter()
	const supabase = createClient()
	const {
		control,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<AddMovieFormData>({
		defaultValues: {
			movieName: '',
			watchDate: '',
			picked: '',
			craigsRating: '',
			rebeccasRating: '',
			slug: '',
			imdbId: '',
			tmdbId: '',
			releaseDate: '',
			director: '',
			topCast: '',
			genre: '',
			userScore: '',
			posterPath: '',
			backdropPath: '',
			overview: '',
		},
		mode: 'onBlur',
	})

	const [tmdbResults, setTmdbResults] = useState<TMDBResult[]>([])
	const [isLoadingResults, setIsLoadingResults] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)

	const movieName = watch('movieName')

	const ratingOptions = [
		{ value: '', label: '-- Select a rating --' },
		{ value: 'Great', label: 'Great' },
		{ value: 'Good', label: 'Good' },
		{ value: 'Ok', label: 'Ok' },
		{ value: 'Bad', label: 'Bad' },
		{ value: 'Absolute trash', label: 'Absolute trash' },
	]

	const pickedOptions = [
		{ value: '', label: '-- Select who picked it --' },
		{ value: 'None', label: 'None' },
		{ value: 'Craig', label: 'Craig' },
		{ value: 'Rebecca', label: 'Rebecca' },
	]

	const onSubmit = async (data: AddMovieFormData) => {
		setIsSubmitting(true)
		setSubmitError(null)

		try {
			// Check authentication
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser()

			if (userError || !user) {
				setSubmitError('You must be logged in to add a movie')
				router.push('/login')
				return
			}

			// Parse comma-separated strings into arrays
			const parseArray = (value: string) => {
				if (!value || typeof value !== 'string') return null
				const parsed = value
					.split(',')
					.map((item) => item.trim())
					.filter((item) => item.length > 0)
				return parsed.length > 0 ? parsed : null
			}

			// Prepare data for Supabase
			const movieData = {
				name: data.movieName,
				watch_date: data.watchDate,
				picked: data.picked || null,
				rating_craig: data.craigsRating || null,
				rating_rebecca: data.rebeccasRating || null,
				slug: data.slug || null,
				imdb_id: data.imdbId || null,
				tmdb_id: data.tmdbId || null,
				release_date: data.releaseDate || null,
				director: parseArray(data.director),
				top_cast: parseArray(data.topCast),
				genre: parseArray(data.genre),
				tmdb_user_score: data.userScore || null,
				poster_path: data.posterPath || null,
				backdrop_path: data.backdropPath || null,
				overview: data.overview || null,
			}

			// Insert into Supabase
			const { error: insertError } = await supabase
				.from('movies')
				.insert([movieData])

			if (insertError) {
				console.error('Database error:', insertError)
				setSubmitError('Failed to add movie to database')
				return
			}

			// Success - reset form and redirect
			reset()
			setTmdbResults([])
			router.push(`/movie/${data.slug}`)
		} catch (error) {
			console.error('Error submitting form:', error)
			setSubmitError('An unexpected error occurred')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleReset = () => {
		reset()
		setTmdbResults([])
		setSubmitError(null)
	}

	const handleSearchTMDB = async () => {
		const query = movieName.trim()
		if (!query) {
			return
		}

		setIsLoadingResults(true)
		try {
			const response = await fetch(
				`/api/tmdb/search?query=${encodeURIComponent(query)}`
			)
			if (!response.ok) {
				throw new Error('Failed to fetch TMDB results')
			}
			const data = await response.json()
			setTmdbResults(data.results || [])
		} catch (error) {
			console.error('Error searching TMDB:', error)
			setTmdbResults([])
		} finally {
			setIsLoadingResults(false)
		}
	}

	const handleSelectResult = async (result: TMDBResult) => {
		// Generate slug from title
		const slug = result.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')

		// Populate basic fields immediately
		setValue('tmdbId', result.id.toString())
		setValue('posterPath', result.poster_path || '')
		setValue('backdropPath', result.backdrop_path || '')
		setValue('releaseDate', result.release_date || '')
		setValue('userScore', result.vote_average.toString())
		setValue('overview', result.overview)
		setValue('slug', slug)

		// Fetch full movie details from our API endpoint
		try {
			const response = await fetch(`/api/tmdb/movie?id=${result.id}`)

			if (response.ok) {
				const data = await response.json()
				const movieDetails = data.movie

				// Update form with additional details
				if (movieDetails.imdb_id) {
					setValue('imdbId', movieDetails.imdb_id)
				}
				if (movieDetails.director && movieDetails.director.length > 0) {
					setValue('director', movieDetails.director.join(', '))
				}
				if (movieDetails.top_cast && movieDetails.top_cast.length > 0) {
					setValue('topCast', movieDetails.top_cast.join(', '))
				}
				if (movieDetails.genre && movieDetails.genre.length > 0) {
					setValue('genre', movieDetails.genre.join(', '))
				}
			}
		} catch (error) {
			console.error('Error fetching full movie details:', error)
			// Continue anyway - we have the basic info already
		}
	}

	// set dynamic defaults on mount
	useEffect(() => {
		const today = new Date()
		setValue('watchDate', new DateItem(today).YYYYMMDD)
	}, [setValue])

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="add-movie-container">
			{submitError && (
				<div className="error-message" role="alert">
					{submitError}
				</div>
			)}

			{/* Section for Watching info */}
			<section className="watching-info-section">
				<h2>Watching Info</h2>
				<Controller
					name="movieName"
					control={control}
					rules={{ required: 'Movie name is required' }}
					render={({ field }) => (
						<TextInput
							id="movieName"
							label="Movie Name"
							placeholder="Enter movie name"
							error={errors.movieName?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="watchDate"
					control={control}
					rules={{ required: 'Watch date is required' }}
					render={({ field }) => (
						<TextInput
							id="watchDate"
							label="Watch Date"
							type="date"
							error={errors.watchDate?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="picked"
					control={control}
					rules={{ required: 'Picked selection is required' }}
					render={({ field }) => (
						<SelectInput
							id="picked"
							label="Picked"
							options={pickedOptions}
							error={errors.picked?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="craigsRating"
					control={control}
					rules={{ required: "Craig's rating is required" }}
					render={({ field }) => (
						<SelectInput
							id="craigsRating"
							label="Craig's Rating"
							options={ratingOptions}
							error={errors.craigsRating?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="rebeccasRating"
					control={control}
					rules={{ required: "Rebecca's rating is required" }}
					render={({ field }) => (
						<SelectInput
							id="rebeccasRating"
							label="Rebecca's Rating"
							options={ratingOptions}
							error={errors.rebeccasRating?.message}
							{...field}
						/>
					)}
				/>
			</section>

			{/* Section to display TMDB api call results */}
			<section className="tmdb-results-section">
				<h2>TMDB Search Results</h2>
				<button
					type="button"
					onClick={handleSearchTMDB}
					disabled={isLoadingResults || !movieName.trim()}
				>
					{isLoadingResults ? 'Searching...' : 'Search TMDB'}
				</button>
				<TMDBResultsList
					results={tmdbResults}
					isLoading={isLoadingResults}
					onSelectResult={handleSelectResult}
				/>
			</section>

			{/* Section for Movie info */}
			<section className="movie-info-section">
				<h2>Movie Info</h2>
				<Controller
					name="slug"
					control={control}
					rules={{ required: 'Slug is required' }}
					render={({ field }) => (
						<TextInput
							id="slug"
							label="Slug"
							placeholder="Enter slug"
							error={errors.slug?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="imdbId"
					control={control}
					rules={{ required: 'IMDB ID is required' }}
					render={({ field }) => (
						<TextInput
							id="imdbId"
							label="IMDB ID"
							placeholder="e.g., tt0111161"
							error={errors.imdbId?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="tmdbId"
					control={control}
					rules={{ required: 'TMDB ID is required' }}
					render={({ field }) => (
						<TextInput
							id="tmdbId"
							label="TMDB ID"
							placeholder="e.g., 278"
							error={errors.tmdbId?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="releaseDate"
					control={control}
					rules={{ required: 'Release date is required' }}
					render={({ field }) => (
						<TextInput
							id="releaseDate"
							label="Release Date"
							placeholder="e.g., 1994-09-23"
							error={errors.releaseDate?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="director"
					control={control}
					rules={{ required: 'Director is required' }}
					render={({ field }) => (
						<TextInput
							id="director"
							label="Director"
							placeholder="e.g., Frank Darabont, Steven Spielberg"
							error={errors.director?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="topCast"
					control={control}
					rules={{ required: 'Top cast is required' }}
					render={({ field }) => (
						<TextInput
							id="topCast"
							label="Top Cast"
							placeholder="e.g., Tim Robbins, Morgan Freeman"
							error={errors.topCast?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="genre"
					control={control}
					rules={{ required: 'Genre is required' }}
					render={({ field }) => (
						<TextInput
							id="genre"
							label="Genre"
							placeholder="e.g., Drama, Crime, Thriller"
							error={errors.genre?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="userScore"
					control={control}
					rules={{
						required: 'User score is required',
						min: { value: 0, message: 'Score must be at least 0' },
						max: { value: 10, message: 'Score must not exceed 10' },
					}}
					render={({ field }) => (
						<TextInput
							id="userScore"
							label="User Score"
							type="number"
							placeholder="e.g., 9.3"
							error={errors.userScore?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="posterPath"
					control={control}
					rules={{ required: 'Poster path is required' }}
					render={({ field }) => (
						<TextInput
							id="posterPath"
							label="Poster Path"
							placeholder="e.g., /6goVv2sConjKgKV3yYvDAJIk4da.jpg"
							error={errors.posterPath?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="backdropPath"
					control={control}
					rules={{ required: 'Backdrop path is required' }}
					render={({ field }) => (
						<TextInput
							id="backdropPath"
							label="Backdrop Path"
							placeholder="e.g., /fCayJrkfRaCo5LWs6i5V8GkMugs.jpg"
							error={errors.backdropPath?.message}
							{...field}
						/>
					)}
				/>
				<Controller
					name="overview"
					control={control}
					rules={{ required: 'Overview is required' }}
					render={({ field }) => (
						<Textarea
							id="overview"
							label="Overview"
							placeholder="Enter movie overview"
							rows={6}
							error={errors.overview?.message}
							{...field}
						/>
					)}
				/>
			</section>

			{/* Form actions */}
			<div className="form-actions">
				<button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Submitting...' : 'Submit'}
				</button>
				<button type="button" onClick={handleReset} disabled={isSubmitting}>
					Reset
				</button>
			</div>
		</form>
	)
}
