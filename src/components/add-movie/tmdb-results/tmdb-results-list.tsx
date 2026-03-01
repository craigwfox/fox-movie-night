'use client'

import { TMDBMovieDetails } from '@/src/types/tmdb'
import { TmdbResultItem } from './tmdb-result-item'

interface TMDBResultsListProps {
	results: TMDBMovieDetails[]
	loading?: boolean
	onSelect: (movie: TMDBMovieDetails) => void
	selectedMovieId?: number
}

export function TmdbResultsList({
	results,
	loading,
	onSelect,
	selectedMovieId,
}: TMDBResultsListProps) {
	if (loading) {
		return <div className="tmdb-results-loading">Searching TMDB...</div>
	}

	if (!results || results.length === 0) {
		return <div className="tmdb-results-empty">No results found</div>
	}

	return (
		<div className="tmdb-results-list">
			{results.map((movie) => (
				<TmdbResultItem
					key={movie.id}
					movie={movie}
					onSelect={onSelect}
					isSelected={selectedMovieId === movie.id}
				/>
			))}
		</div>
	)
}
