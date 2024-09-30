import { FastifyInstance } from 'fastify';
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } from '../controllers/moviesController';

export default async function movieRoutes(fastify: FastifyInstance) {
	fastify.get('/movies', getMovies);
	fastify.get('/movies/:id', getMovieById);
	fastify.post('/movies', createMovie);
	fastify.put('/movies/:id', updateMovie);
	fastify.delete('/movies/:id', deleteMovie);
}
