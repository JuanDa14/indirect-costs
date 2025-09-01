import { OperationService } from './operations.service.js';
import type {
	CreateOperationDto,
	UpdateOperationDto,
	UpsertOperationDto,
	IndirectCostDto,
} from './dto/index.js';

const operationService = new OperationService();

export const operationResolvers = {
	Query: {
		operations: async (_: any, { plantId }: { plantId: string }) => {
			return await operationService.findByPlant(plantId);
		},

		operation: async (_: any, { id }: { id: string }) => {
			return await operationService.findOne(id);
		},

		allOperations: async () => {
			return await operationService.findAll();
		},
	},

	Mutation: {
		createOperation: async (_: any, args: CreateOperationDto) => {
			// filtrar propiedades undefined para exactOptionalPropertyTypes
			const createData: CreateOperationDto = {
				plantId: args.plantId,
				name: args.name,
			};
			if (args.costs !== undefined) {
				createData.costs = args.costs;
			}

			return await operationService.create(createData);
		},

		upsertOperation: async (_: any, args: UpsertOperationDto) => {
			return await operationService.upsert(args);
		},

		updateOperation: async (
			_: any,
			{ id, ...updateData }: { id: string } & UpdateOperationDto
		) => {
			// filtrar propiedades undefined para exactOptionalPropertyTypes
			const cleanUpdateData: UpdateOperationDto = {};
			if (updateData.name !== undefined) cleanUpdateData.name = updateData.name;
			if (updateData.costs !== undefined) cleanUpdateData.costs = updateData.costs;

			return await operationService.update(id, cleanUpdateData);
		},

		updateOperationCosts: async (
			_: any,
			{ operationId, costs }: { operationId: string; costs: IndirectCostDto[] }
		) => {
			return await operationService.update(operationId, { costs });
		},

		deleteOperation: async (_: any, { operationId }: { operationId: string }) => {
			await operationService.remove(operationId);
			return true;
		},
	},
};
