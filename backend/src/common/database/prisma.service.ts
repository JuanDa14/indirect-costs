import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient {
	constructor() {
		super();
	}

	async connect(): Promise<void> {
		try {
			await this.$connect();
			console.log('Connected to database via Prisma');
		} catch (error) {
			console.error('Failed to connect to database:', error);
			throw error;
		}
	}

	async disconnect(): Promise<void> {
		try {
			await this.$disconnect();
			console.log('Disconnected from database');
		} catch (error) {
			console.error('Error disconnecting from database:', error);
		}
	}

	async onModuleInit(): Promise<void> {
		await this.connect();
	}

	async onModuleDestroy(): Promise<void> {
		await this.disconnect();
	}
}

export const prismaService = new PrismaService();
