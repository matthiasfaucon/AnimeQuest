import { FastifyRequest, FastifyReply } from 'fastify';
import { AppDataSource } from '../data-source';
import { Category } from '../entity/Categories';

// Récupérer toutes les catégories
export async function getCategories(request: FastifyRequest, reply: FastifyReply) {
	try {
		const categories = await AppDataSource.getRepository('Category').find();
		return reply.send(categories);
	} catch (error) {
		return reply.status(500).send({ error: (error as Error).message });
	}
}

// Récupération d'une catégorie by ID
export async function getCategoryById(request: FastifyRequest, reply: FastifyReply) {
	try {
		const { id } = request.params as { id: string };
		const category = await AppDataSource.getRepository('Category').findOne({ where: { id } });
		if (!category) {
			return reply.status(404).send({ message: 'Catégorie non trouvée' });
		}
		return reply.send(category);
	} catch (error) {
		return reply.status(500).send({ error: (error as Error).message });
	}
}

// On récupère les films par catégorie
export async function getMoviesByCategory(request: FastifyRequest, reply: FastifyReply) {
	try {
		const { id } = request.params as { id: string };
		const category = await AppDataSource.getRepository('Category').findOne({ where: { id }, relations: ['movies'] });
		if (!category) {
			return reply.status(404).send({ message: 'Catégorie non trouvée' });
		}
		return reply.send(category.movies);
	} catch (error) {
		return reply.status(500).send({ error: (error as Error).message });
	}
}

// Créer une categorie
export async function createCategory(request: FastifyRequest, reply: FastifyReply) {
	try {
		const { body } = request as { body: Partial<Category> };
		const category = await AppDataSource.getRepository('Category').save(body);
		return reply.send(category);
	} catch (error) {
		return reply.status(500).send({ error: (error as Error).message });
	}
}
