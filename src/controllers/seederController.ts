import { stringifyQuery } from "ufo";
import { AppDataSource } from "../data-source";

// Seeder pour remplir la db
//? Normalement, on devrait l'utiliser qu'une seule fois sauf si on get tous les jours les updates
export async function seedDatabase() {
	const api_key = process.env.API_KEY;
	const filtersFormattedMovie = stringifyQuery({
		include_adult: false,
		include_null_first_air_dates: false,
		language: 'fr-FR',
		page: 1,
		sort_by: 'popularity.desc',
		with_keywords: '210024-anime',
	})

	const filtersFormattedCategory = stringifyQuery({
		language: 'fr-FR',
	})

	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
		}
	};

	const urlMovie = `https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&${filtersFormattedMovie}`;
	const urlCategory = `https://api.themoviedb.org/3/genre/tv/list?api_key=${api_key}&${filtersFormattedCategory}`;

	const responseMovie = await fetch(urlMovie, options);
	const responseCategory = await fetch(urlCategory, options);
	const dataMovies = await responseMovie.json();
	const dataCategories = await responseCategory.json();

	const categories = dataCategories.genres.map((category: any) => {
		return {
			id: category.id,
			name: category.name,
		}
	});
	await AppDataSource.getRepository('Category').save(categories);

	const categoriesEntities = await AppDataSource.getRepository('Category').find();

	const movies = dataMovies.results.map((movie: any) => {
		console.log(movie)
		return {
			original_name: movie.original_name,
			overview: movie.overview,
			original_language: movie.original_language,
			origin_country: movie.origin_country,
			first_air_date: movie.first_air_date,
			vote_average: movie.vote_average,
			vote_count: movie.vote_count,
			popularity: movie.popularity,
			adult: movie.adult,
			backdrop_path: `https://image.tmdb.org/t/p/w200${movie.backdrop_path}`,
			poster_path: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
			categories: categoriesEntities.filter((category: any) => movie.genre_ids.includes(category.id)),
		}
	});
	await AppDataSource.getRepository('Movie').save(movies);

	const moviesEntities = await AppDataSource.getRepository('Movie').find({ relations: ['categories'] });

	for (const category of categoriesEntities) {
		category.movies = moviesEntities.filter((movie: any) => movie.categories.some((cat: any) => cat.id === category.id));
		await AppDataSource.getRepository('Category').save(category);
	}

	return { movies, categories };
}