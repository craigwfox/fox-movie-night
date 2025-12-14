'use client'

import React from 'react'

interface TMDBResult {
	id: number
	title: string
	poster_path: string | null
	release_date: string
	overview: string
	vote_average: number
	backdrop_path: string | null
}

interface TMDBResultItemProps {
	result: TMDBResult
	onSelect: (result: TMDBResult) => void
}

export default function TMDBResultItem({
	result,
	onSelect,
}: TMDBResultItemProps) {
	const posterUrl = result.poster_path
		? `https://image.tmdb.org/t/p/w342${result.poster_path}`
		: '/placeholder-poster.jpg'

	const releaseYear = result.release_date
		? new Date(result.release_date).getFullYear()
		: 'N/A'

	return (
		<div className="tmdb-result-item">
			<img src={posterUrl} alt={result.title} className="poster-image" />
			<div className="result-info">
				<h3>{result.title}</h3>
				<p className="release-date">Release Date: {releaseYear}</p>
				<button
					type="button"
					onClick={() => onSelect(result)}
					className="select-button"
				>
					Select Movie
				</button>
			</div>
		</div>
	)
}
