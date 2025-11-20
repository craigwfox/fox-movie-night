"use_cache";

import { createClient } from "@/src/utils/supabase/server";
import MovieCard from "../components/feature/movie-card";

export default async function Home() {
	const supabase = await createClient();
	const { data: movies, error } = await supabase
		.from("movies")
		.select()
		.limit(5);

	if (error) console.log("❗ supabase error:", error);

	return (
		<div className="">
			<main className="">
				{movies && movies.length > 0 ? (
					<section className="">
						{[...movies].reverse().map((movie: Movie) => (
							<MovieCard key={movie.id} movie={movie} />
						))}
					</section>
				) : (
					<section>
						<p>No movies yet.</p>
					</section>
				)}
			</main>
		</div>
	);
}
