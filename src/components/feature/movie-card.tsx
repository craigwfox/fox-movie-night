import Image from "next/image";

export default function MovieCard({ movie }: { movie: Movie }) {
	return (
		<article className="" aria-labelledby={movie.id} id="">
			<h2 className="" id={movie.id}>
				{movie.name}
			</h2>
			<Image
				src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
				alt={`Movie poster for ${movie.name}`}
				width={500}
				height={500}
				loading="lazy"
				className="object-contain"
			/>
		</article>
	);
}
