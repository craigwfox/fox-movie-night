'use client'

import Image from 'next/image'
import { TMDBMovieDetails } from '@/src/types/tmdb'

interface TMDBResultItemProps {
	movie: TMDBMovieDetails
	onSelect: (movie: TMDBMovieDetails) => void
	isSelected?: boolean
}

export function TmdbResultItem({
	movie,
	onSelect,
	isSelected,
}: TMDBResultItemProps) {
	const year = movie.release_date
		? new Date(movie.release_date).getFullYear()
		: 'Unknown'

	return (
		<div className="tmdb-result-item">
			<div className="tmdb-result-poster">
				{movie.poster_path && (
					<Image
						src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
						alt={movie.title}
						width={150}
						height={225}
					/>
				)}
			</div>
			<div className="tmdb-result-content">
				<h3 className="tmdb-result-title">{movie.title}</h3>
				<p className="tmdb-result-date">{String(year)}</p>
				<p className="tmdb-result-score">Rating: {movie.vote_average}/10</p>
				<button
					type="button"
					onClick={() => onSelect(movie)}
					className={`button ${isSelected ? 'button-primary' : 'button-secondary'}`}
				>
					Select movie
				</button>
			</div>
		</div>
	)
}
