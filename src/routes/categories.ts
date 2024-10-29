import { FastifyInstance } from 'fastify';
import { getCategories, getCategoryById, getMoviesByCategory, createCategory } from '../controllers/categoriesController';

export default async function categoryRoutes(fastify: FastifyInstance) {
	fastify.get('/api/categories', getCategories);
	fastify.get('/api/categories/:id', getCategoryById);
	fastify.get('/api/categories/:id/movies', getMoviesByCategory);
	fastify.post('/api/categories', createCategory);
}
