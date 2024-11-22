import { FastifyRequest, FastifyReply } from 'fastify';
import { AppDataSource } from '../data-source';
import { In } from 'typeorm';
import { Category } from '../entity/Categories';
import { Movie } from '../entity/Movie';
import { Like } from 'typeorm';

// Get tout les films
export async function getMovies(request: FastifyRequest, reply: FastifyReply) {
	const movies = await AppDataSource.getRepository('Movie').find({ relations: ['categories'] });
	return reply.send(movies);
}

// Recherche de films par titre
export async function searchMovie(request: FastifyRequest, reply: FastifyReply) {
	try {
		const { title } = request.query as { title: string };
		
		if (!title) {
			return reply.status(400).send({ error: 'Title query parameter is required.' });
		}

		// https://github.com/typeorm/typeorm/blob/master/docs/find-options.md#advanced-options
		const movies = await AppDataSource.getRepository(Movie).find({ 
			where: { 
				original_name: Like(`%${title}%`)
			},
			relations: ['categories']
		});

		if (movies.length === 0) {
			return reply.status(404).send({ message: 'No movies found with that title.' });
		}

		return reply.send(movies);
	} catch (error) {
		console.error('Error searching for movie:', error);
		return reply.status(500).send({ error: 'Internal Server Error', details: (error as Error).message });
	}
}

// Get un film par son ID
export async function getMovieById(request: FastifyRequest, reply: FastifyReply) {
	try {
		const { id } = request.params as { id: string };
		const movie = await AppDataSource.getRepository('Movie').findOne({ where: { id } });
		if (!movie) {
			return reply.status(404).send({ message: 'Film non trouvé' });
		}
		return reply.send(movie);
	} catch (error) {
		return reply.status(500).send({ error: (error as Error).message });
	}
}

// Création d'un film
export async function createMovie(request: FastifyRequest, reply: FastifyReply) {
	try {
		const { body } = request as { body: { categories?: number[] } };
		let categories: Category[] = [];
		if (body.categories) {
			categories = await AppDataSource.getRepository(Category).find({ where: { id: In(body.categories) } }) as Category[];
		}
		const movie = await AppDataSource.getRepository('Movie').save({ ...body, categories });
		return reply.send(movie);
	} catch (error) {
		return reply.status(500).send({ error: (error as Error).message });
	}
}

// Update un film par son ID
export async function updateMovie(request: FastifyRequest, reply: FastifyReply) {
	const { id } = request.params as { id: string };
	const { body } = request as { body: Partial<Movie> };
	await AppDataSource.getRepository('Movie').update(id, body);
	return reply.send({ message: 'Film mis à jour avec succès' });
}

// Supprimer un film par son ID
export async function deleteMovie(request: FastifyRequest, reply: FastifyReply) {
	const { id } = request.params as { id: string };
	const movie = await AppDataSource.getRepository('Movie').findOne({ where: { id } });
	if (movie) {
		await AppDataSource.getRepository('Movie').delete(id);
		return reply.send({ message: 'Film supprimé avec succès', status: 200 });
	} else {
		return reply.status(404).send({ message: 'Film non trouvé' });
	}
}
