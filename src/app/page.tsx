import React, { Suspense } from "react";
import { createClient } from "@/src/utils/supabase/server";
import MovieCard from "../components/feature/movie-card";

export default function Home() {
	return (
		<div className="">
			<main className="">
				<Suspense
					fallback={
						<section>
							<p>Loading movies…</p>
						</section>
					}
				>
					{/* MoviesList is an async Server Component that does the supabase/cookies work */}
					<MoviesList />
				</Suspense>
			</main>
		</div>
	);
}

async function MoviesList() {
	const supabase = await createClient();
	const { data: movies, error } = await supabase
		.from("movies")
		.select()
		.limit(5);

	if (error) console.log("❗ supabase error:", error);

	return movies && movies.length > 0 ? (
		<section className="">
			{[...movies].reverse().map((movie: Movie) => (
				<MovieCard key={movie.id} movie={movie} />
			))}
		</section>
	) : (
		<section>
			<p>No movies yet.</p>
		</section>
	);
}
