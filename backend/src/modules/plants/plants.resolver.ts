import { PlantService } from './plants.service.js';
import type { CreatePlantDto, UpdatePlantDto } from './dto/index.js';

const plantService = new PlantService();

export const plantResolvers = {
	Query: {
		plants: async () => {
			return await plantService.findAll();
		},

		plant: async (_: any, { id }: { id: string }) => {
			return await plantService.findOne(id);
		},

		plantsWithOperations: async () => {
			return await plantService.findAllWithOperations();
		},
	},

	Mutation: {
		createPlant: async (_: any, args: CreatePlantDto) => {
			return await plantService.create(args);
		},

		updatePlant: async (_: any, { id, ...updateData }: { id: string } & UpdatePlantDto) => {
			// filtrar propiedades undefined para exactOptionalPropertyTypes
			const cleanUpdateData: UpdatePlantDto = {};
			if (updateData.name !== undefined) cleanUpdateData.name = updateData.name;
			if (updateData.code !== undefined) cleanUpdateData.code = updateData.code;

			return await plantService.update(id, cleanUpdateData);
		},

		deletePlant: async (_: any, { id }: { id: string }) => {
			await plantService.remove(id);
			return true;
		},
	},

	Plant: {
		operations: async (plant: any) => {
			const plantWithOps = await plantService.findOneWithOperations(plant.id);
			return plantWithOps?.operations || [];
		},
	},
};
