import { FastifyInstance } from 'fastify';
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie, searchMovie } from '../controllers/moviesController';

export default async function movieRoutes(fastify: FastifyInstance) {
	fastify.get('/api/movies', getMovies);
	fastify.get('/api/movies/search', searchMovie);
	fastify.get('/api/movies/:id', getMovieById);
	fastify.post('/api/movies', createMovie);
	fastify.put('/api/movies/:id', updateMovie);
	fastify.delete('/api/movies/:id', deleteMovie);
}
