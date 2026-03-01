'use client'

import { useState } from 'react'
import MovieCard from '../movie-card/movie-card'
import { TextInput } from '../../common/form-inputs/text-input/text-input'

type MovieGridClientPropsYears = number | 'All'

interface MovieGridClientProps {
	movies: Movie[]
	yearList: MovieGridClientPropsYears[]
}

export default function MovieGridClient({
	movies,
	yearList,
}: MovieGridClientProps) {
	const [selectedYear, setSelectedYear] = useState<MovieGridClientPropsYears>(
		yearList[1]
	)
	const [movieTitle, setMovieTitle] = useState('')

	function yearMatch(dateStr: string, year: number) {
		return new Date(dateStr).getFullYear() === year
	}

	function titleMatch(title: string, searchTerm: string) {
		return title.toLowerCase().includes(searchTerm.toLowerCase())
	}

	const filteredMovies = movies.filter((m) => {
		const yearFilter =
			selectedYear === 'All' || yearMatch(m.watch_date, selectedYear)
		const titleFilter = titleMatch(m.name, movieTitle)
		// return movieTitle.length > 0 ? titleFilter : yearFilter
		return titleFilter && yearFilter
	})

	return (
		<>
			<div className="movie-grid__header">
				<h2 id="movie-grid">{'Movie Grid'}</h2>
				<p>
					Showing {filteredMovies.length} of {movies.length}
				</p>
			</div>
			<div className="movie-grid__controls">
				<ul>
					{yearList.map((year) => (
						<li key={year}>
							<button
								className="pill"
								type="button"
								onClick={() =>
									setSelectedYear(selectedYear === year ? 'All' : year)
								}
								aria-pressed={selectedYear === year}
							>
								{year}
							</button>
						</li>
					))}
				</ul>

				<div>
					<TextInput
						label="Search"
						id="search-input"
						value={movieTitle}
						onChange={setMovieTitle}
						message="Searches by movie name"
					/>
				</div>
			</div>
			<div className="movie-grid">
				{filteredMovies?.map((movie) => (
					<MovieCard movie={movie} key={movie.id} />
				))}
			</div>
		</>
	)
}
