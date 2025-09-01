import { prismaService } from '../../common/database/index.js';
import { PrismaErrorHandler } from '../../common/utils/index.js';
import type { Operation, IndirectCost } from '@prisma/client';
import type {
	CreateOperationDto,
	UpdateOperationDto,
	OperationFilterDto,
	UpsertOperationDto,
	IndirectCostDto,
} from './dto/index.js';
import type { OperationWithCosts, OperationWithCostsOnly } from './types/index.js';

export class OperationService {
	private readonly prisma = prismaService;

	async create(createOperationDto: CreateOperationDto): Promise<OperationWithCosts> {
		const { plantId, name, costs = [] } = createOperationDto;

		try {
			return await this.prisma.operation.create({
				data: {
					plantId,
					name,
					costs: {
						create: costs.map((cost) => ({
							volumeThresholdKg: cost.volumeThresholdKg,
							costPerKg: cost.costPerKg,
						})),
					},
				},
				include: {
					costs: true,
					plant: true,
				},
			});
		} catch (error: any) {
			PrismaErrorHandler.handleError(error);
		}
	}
	async findByPlant(plantId: string): Promise<OperationWithCostsOnly[]> {
		return await this.prisma.operation.findMany({
			where: { plantId },
			include: {
				costs: true,
			},
			orderBy: { name: 'asc' },
		});
	}

	async findOne(id: string): Promise<OperationWithCosts | null> {
		return await this.prisma.operation.findUnique({
			where: { id },
			include: {
				costs: true,
				plant: true,
			},
		});
	}

	async findByPlantAndName(plantId: string, name: string): Promise<OperationWithCosts | null> {
		return await this.prisma.operation.findUnique({
			where: {
				plantId_name: {
					plantId,
					name,
				},
			},
			include: {
				costs: true,
				plant: true,
			},
		});
	}

	async update(id: string, updateOperationDto: UpdateOperationDto): Promise<OperationWithCosts> {
		const { name, costs } = updateOperationDto;

		const updateData: any = {};
		if (name !== undefined) {
			updateData.name = name;
		}

		if (costs !== undefined) {
			// primero eliminar todos los costos existentes
			await this.prisma.indirectCost.deleteMany({
				where: { operationId: id },
			});

			// luego crear los nuevos costos
			updateData.costs = {
				create: costs.map((cost) => ({
					volumeThresholdKg: cost.volumeThresholdKg,
					costPerKg: cost.costPerKg,
				})),
			};
		}

		try {
			return await this.prisma.operation.update({
				where: { id },
				data: updateData,
				include: {
					costs: true,
					plant: true,
				},
			});
		} catch (error: any) {
			PrismaErrorHandler.handleError(error);
		}
	}

	async upsert(upsertOperationDto: UpsertOperationDto): Promise<OperationWithCosts> {
		const { plantId, name, costs } = upsertOperationDto;

		const existing = await this.findByPlantAndName(plantId, name);

		if (existing) {
			return await this.update(existing.id, { costs });
		} else {
			return await this.create({ plantId, name, costs });
		}
	}

	async remove(id: string): Promise<Operation> {
		try {
			return await this.prisma.operation.delete({
				where: { id },
			});
		} catch (error: any) {
			PrismaErrorHandler.handleError(error);
		}
	}

	async addIndirectCosts(operationId: string, costs: IndirectCostDto[]): Promise<IndirectCost[]> {
		try {
			const createdCosts = await Promise.all(
				costs.map((cost) =>
					this.prisma.indirectCost.create({
						data: {
							operationId,
							volumeThresholdKg: cost.volumeThresholdKg,
							costPerKg: cost.costPerKg,
						},
					})
				)
			);

			return createdCosts;
		} catch (error: any) {
			PrismaErrorHandler.handleError(error);
		}
	}

	async findAll(): Promise<OperationWithCosts[]> {
		return await this.prisma.operation.findMany({
			include: {
				costs: true,
				plant: true,
			},
			orderBy: [{ plant: { name: 'asc' } }, { name: 'asc' }],
		});
	}

	async exists(filter: OperationFilterDto): Promise<boolean> {
		const operation = await this.prisma.operation.findFirst({
			where: filter,
		});
		return !!operation;
	}

	async countByPlant(plantId: string): Promise<number> {
		return await this.prisma.operation.count({
			where: { plantId },
		});
	}

	async count(): Promise<number> {
		return await this.prisma.operation.count();
	}
}
