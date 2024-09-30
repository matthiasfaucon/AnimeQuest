import { FastifyInstance } from 'fastify';
import { getCategories, getCategoryById, getMoviesByCategory, createCategory } from '../controllers/categoriesController';

export default async function categoryRoutes(fastify: FastifyInstance) {
	fastify.get('/categories', getCategories);
	fastify.get('/categories/:id', getCategoryById);
	fastify.get('/categories/:id/movies', getMoviesByCategory);
	fastify.post('/categories', createCategory);
}
