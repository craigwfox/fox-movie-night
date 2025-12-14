/* Main landing page
 * ------------------------
 * - List all movies listed in supabase
 * - Default to current year, with filters for all and each year
 * - Movie card component for each card
 */

import React, { Suspense } from 'react'
import { MovieGrid } from '../components/movie-list/movie-grid/movie-grid'
import BaseLoader from '../components/loaders/base-loader'

export default function Home() {
	return (
		<main className="movie-list section-wrapper">
			<div className="movie-list__header">
				<h1>Watch list</h1>
			</div>
			<div className="movie-list__grid">
				<Suspense fallback={<BaseLoader message="⏳ Loading Movies..." />}>
					<MovieGrid />
				</Suspense>
			</div>
		</main>
	)
}
