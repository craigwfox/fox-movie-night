import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { getMovieBySlug, getMovies } from '@/src/utils/supabase/queries'
import { DateItem } from '@/src/utils/formatting/dates'
import { notFound } from 'next/navigation'
import { isUserLoggedIn } from '@/src/utils/supabase/auth'

export async function generateStaticParams() {
	const movies = await getMovies()
	return (movies ?? []).map((movie) => ({ slug: movie.slug }))
}

function stringCommaList(str: string): string {
	try {
		const strArray = JSON.parse(str)
		return Array.isArray(strArray) ? strArray.join(', ') : str
	} catch {
		// Fallback for non-JSON strings
		return str
	}
}

function stringToArry(str: string): string[] {
	try {
		const parsed = JSON.parse(str)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		// Fallback for comma-separated strings
		return str.split(',').map((item) => item.trim())
	}
}

export default async function MovieSingle({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	return (
		<div className="movie-single">
			<Suspense
				fallback={
					<section>
						<p>Loading movie…</p>
					</section>
				}
			>
				<MovieItem params={params} />
			</Suspense>
		</div>
	)
}

async function MovieItem({ params }: { params: Promise<{ slug: string }> }) {
	const loggedIn = await isUserLoggedIn()
	const { slug } = await params
	const movieData = await getMovieBySlug(slug)

	if (!movieData) {
		notFound()
	}

	const movie: Movie = movieData
	const watchDate = new DateItem(
		new Date(movie.watch_date.replaceAll('-', '/')),
	)
	const releaseDate = new DateItem(
		new Date(movie.release_date.replaceAll('-', '/')),
	)

	return (
		<div className="section-wrapper movie-single">
			<div className="movie-single__header">
				<h1 className="title-page">{movie.name}</h1>
				<Suspense fallback={null}>
					<UpdateButton slug={slug} loggedIn={loggedIn} />
				</Suspense>
			</div>
			<div className="movie-single__content">
				<section className="movie-single__watch">
					<h2 className="title-section">Watch info</h2>
					<p>
						<strong>Watched:</strong> {watchDate.MMMDYYYY}
					</p>
					{movie.picked && movie.picked != 'none' ? (
						<p>
							<strong>Picked:</strong> {movie.picked}
						</p>
					) : (
						''
					)}
					<div>
						<p>
							<strong>Our Ratings</strong>
						</p>
						{movie.rating_craig && !movie.rating_rebecca ? (
							<p>
								<strong>Rating: </strong>
								{movie.rating_craig}
							</p>
						) : (
							<table className="table-basic">
								<thead>
									<tr>
										<th>Craig</th>
										<th>Rebecca</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>{movie.rating_craig}</td>
										<td>{movie.rating_rebecca}</td>
									</tr>
								</tbody>
							</table>
						)}
					</div>

					<div>
						<Image
							src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
							alt={`Movie poster for ${movie.name}`}
							width={500}
							height={750}
							className="object-contain"
							loading="eager"
						/>
					</div>
				</section>
				<section className="movie-single__info">
					<h2 className="title-section">Movie info</h2>
					<h3 className="title-subheading">Released Date</h3>
					<p>{releaseDate.MMMDYYYY}</p>

					<h3 className="title-subheading">Genres</h3>
					<p>{stringCommaList(movie.genre)}</p>

					<h3 className="title-subheading">Cast and Crew</h3>
					<div>
						<h4>Directors</h4>
						<ul>
							{stringToArry(movie.director).map((director) => (
								<li key={director}>{director}</li>
							))}
						</ul>
					</div>
					{movie.writer ? (
						<div>
							<h4>Writer</h4>
							<ul>
								{stringToArry(movie.writer).map((writer) => (
									<li key={writer}>{writer}</li>
								))}
							</ul>
						</div>
					) : (
						''
					)}
					<div>
						<h4>Top Casts</h4>
						<ul>
							{stringToArry(movie.top_cast).map((member) => (
								<li key={member}>{member}</li>
							))}
						</ul>
					</div>
				</section>
			</div>
		</div>
	)
}

async function UpdateButton({
	slug,
	loggedIn,
}: {
	slug: string
	loggedIn: boolean
}) {
	if (!loggedIn) return null

	return (
		<Link href={`/edit-movie/${slug}`} className="button button--primary">
			Update movie
		</Link>
	)
}
