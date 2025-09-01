import { prismaService } from '../../common/database/index.js';
import { PrismaErrorHandler } from '../../common/utils/index.js';
import type { Plant } from '@prisma/client';
import type { CreatePlantDto, UpdatePlantDto, PlantFilterDto } from './dto/index.js';
import type { PlantWithOperations } from './types/plant.types.js';

export class PlantService {
	private readonly prisma = prismaService;

	async create(createPlantDto: CreatePlantDto): Promise<Plant> {
		try {
			return await this.prisma.plant.create({
				data: createPlantDto,
			});
		} catch (error: any) {
			PrismaErrorHandler.handleError(error);
		}
	}

	async findAll(): Promise<Plant[]> {
		return await this.prisma.plant.findMany({
			orderBy: { name: 'asc' },
		});
	}

	async findAllWithOperations(): Promise<PlantWithOperations[]> {
		return await this.prisma.plant.findMany({
			include: {
				operations: {
					include: {
						costs: true,
					},
					orderBy: { name: 'asc' },
				},
			},
			orderBy: { name: 'asc' },
		});
	}

	async findOne(id: string): Promise<Plant | null> {
		return await this.prisma.plant.findUnique({
			where: { id },
		});
	}

	async findByCode(code: string): Promise<Plant | null> {
		return await this.prisma.plant.findUnique({
			where: { code },
		});
	}

	async findOneWithOperations(id: string): Promise<PlantWithOperations | null> {
		return await this.prisma.plant.findUnique({
			where: { id },
			include: {
				operations: {
					include: {
						costs: true,
					},
					orderBy: { name: 'asc' },
				},
			},
		});
	}

	async update(id: string, updatePlantDto: UpdatePlantDto): Promise<Plant> {
		try {
			return await this.prisma.plant.update({
				where: { id },
				data: updatePlantDto,
			});
		} catch (error: any) {
			PrismaErrorHandler.handleError(error);
		}
	}

	async remove(id: string): Promise<Plant> {
		try {
			return await this.prisma.plant.delete({
				where: { id },
			});
		} catch (error: any) {
			PrismaErrorHandler.handleError(error);
		}
	}

	async exists(filter: PlantFilterDto): Promise<boolean> {
		const plant = await this.prisma.plant.findFirst({
			where: filter,
		});
		return !!plant;
	}

	async count(): Promise<number> {
		return await this.prisma.plant.count();
	}
}
