import Image from 'next/image'
import { Suspense } from 'react'
import { createClient } from '@/src/utils/supabase/server'
import { DateItem } from '@/src/utils/formatting/dates'

function stringCommaList(str: string): string {
	const strArry = JSON.parse(str)
	return strArry.length > 1 ? strArry.join(', ') : strArry.join('')
}

function stringToArry(str: string): string[] {
	return JSON.parse(str)
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
	const { slug } = await params
	const supabase = await createClient()
	const { data: movies, error } = await supabase
		.from('movies')
		.select()
		.eq('slug', slug)
		.limit(1)
	const movie: Movie = movies?.[0]
	const watchDate = new DateItem(
		new Date(movie.watch_date.replaceAll('-', '/'))
	)
	const releaseDate = new DateItem(
		new Date(movie.release_date.replaceAll('-', '/'))
	)

	return movie ? (
		<div>
			<h1>Name: {movie.name}</h1>

			<section>
				<h2>Watch info</h2>
				<ul>
					<li>
						<strong>Watched:</strong> {watchDate.MMMDYYYY}
					</li>
					{movie.picked && movie.picked != 'none' ? (
						<li>
							<strong>Picked:</strong> {movie.picked}
						</li>
					) : (
						''
					)}
				</ul>
				{movie.rating_craig && !movie.rating_rebecca ? (
					<p>
						<strong>Rating: </strong>
						{movie.rating_craig}
					</p>
				) : (
					<table>
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

				<div>
					<Image
						src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
						alt={`Movie poster for ${movie.name}`}
						width={500}
						height={500}
						loading="lazy"
						className="object-contain"
					/>
				</div>
			</section>
			<section>
				<h2>Movie info</h2>
				<h3>Released Date</h3>
				<p>{releaseDate.MMMDYYYY}</p>

				<h3>Genres</h3>
				<p>{stringCommaList(movie.genre)}</p>

				<h3>Cast and Crew</h3>
				<div>
					<h4>Directors</h4>
					<ul>
						{stringToArry(movie.director).map((director) => (
							<li key={director}>{director}</li>
						))}
					</ul>
				</div>
				<div>
					<h4>Writer</h4>
					<ul>
						{stringToArry(movie.director).map((writer) => (
							<li key={writer}>{writer}</li>
						))}
					</ul>
				</div>
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
	) : (
		<p>This movie does not exist</p>
	)
}
