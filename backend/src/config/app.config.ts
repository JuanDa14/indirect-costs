import { config } from 'dotenv';

config();

export const appConfig = {
	port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
	corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
	databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
	nodeEnv: process.env.NODE_ENV || 'development',

	graphql: {
		playground: process.env.NODE_ENV !== 'production',
		introspection: process.env.NODE_ENV !== 'production',
		csrfPrevention: true,
	},
};
