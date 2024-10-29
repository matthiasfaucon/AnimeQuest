import Fastify from 'fastify'
import cors from '@fastify/cors'
import 'dotenv/config'
import { AppDataSource } from './data-source';
import movieRoutes from './routes/movies';
import categoryRoutes from './routes/categories';
import seederRoutes from './routes/seeder';

const startServer = async () => {
	const fastify = Fastify({
		logger: true,
	})

	await fastify.register(cors, {
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	});

	await fastify.register(movieRoutes);
	await fastify.register(categoryRoutes);
	await fastify.register(seederRoutes)

	try {
		await fastify.listen({ port: 3001 });
		await AppDataSource.initialize();
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

startServer();