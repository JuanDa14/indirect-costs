import { ApolloServer } from 'apollo-server';
import { appConfig } from './config/index.js';
import { prismaService } from './common/database/index.js';
import { typeDefs, resolvers } from './graphql.js';

async function startServer() {
	await prismaService.connect();

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		...appConfig.graphql,
	});

	const { url } = await server.listen({ port: appConfig.port });
	console.log(`GraphQL server ready at ${url}`);

	const gracefulShutdown = async (signal: string) => {
		console.log(`Received ${signal}, shutting down gracefully...`);
		try {
			await server.stop();
			await prismaService.disconnect();
			console.log('Server stopped successfully');
			process.exit(0);
		} catch (error) {
			console.error('Error during shutdown:', error);
			process.exit(1);
		}
	};

	process.on('SIGINT', () => gracefulShutdown('SIGINT'));
	process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

startServer().catch((error) => {
	console.error('Server startup failed:', error);
	process.exit(1);
});
