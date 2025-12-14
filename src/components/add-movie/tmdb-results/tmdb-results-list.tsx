'use client'

import React from 'react'
import TMDBResultItem from './tmdb-result-item'

interface TMDBResult {
	id: number
	title: string
	poster_path: string | null
	release_date: string
	overview: string
	vote_average: number
	backdrop_path: string | null
}

interface TMDBResultsListProps {
	results: TMDBResult[]
	isLoading: boolean
	onSelectResult: (result: TMDBResult) => void
}

export default function TMDBResultsList({
	results,
	isLoading,
	onSelectResult,
}: TMDBResultsListProps) {
	if (isLoading) {
		return (
			<div className="tmdb-results-container">
				<p>Searching...</p>
			</div>
		)
	}

	if (results.length === 0) {
		return (
			<div className="tmdb-results-container">
				<p>No results found. Enter a movie name to search.</p>
			</div>
		)
	}

	return (
		<div className="tmdb-results-container">
			<div className="results-grid">
				{results.map((result) => (
					<TMDBResultItem
						key={result.id}
						result={result}
						onSelect={onSelectResult}
					/>
				))}
			</div>
		</div>
	)
}
