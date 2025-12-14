import { DateItem } from '@/src/utils/formatting/dates'
import Image from 'next/image'
import Link from 'next/link'

export default function MovieCard({ movie }: { movie: Movie }) {
	const watchDate = new DateItem(
		new Date(movie.watch_date.replaceAll('-', '/'))
	)
	return (
		<article className="movie-card" aria-labelledby={movie.id}>
			<div className="movie-card__image">
				<Image
					src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
					alt={`Movie poster for ${movie.name}`}
					width={500}
					height={500}
					loading="lazy"
					className="object-contain"
				/>
			</div>
			<div className="movie-card__content">
				<div className="movie-card__inner">
					<Link href={`/movie/${movie.slug}`}>
						<h2 id={movie.id}>{movie.name}</h2>
					</Link>
					<ul>
						<li>{watchDate.MMMDYYYY}</li>
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
				</div>
			</div>
		</article>
	)
}
