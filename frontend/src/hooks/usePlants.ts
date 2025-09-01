import { useQuery, useMutation } from '@apollo/client';
import {
	GET_PLANTS,
	GET_PLANTS_WITH_OPERATIONS,
	GET_PLANT_OPERATIONS,
	CREATE_PLANT,
	UPDATE_PLANT,
	DELETE_PLANT,
} from '../services/graphql';
import type { Plant, CreatePlantInput, UpdatePlantInput } from '../types';

export const usePlants = () => {
	const { data, loading, error, refetch } = useQuery(GET_PLANTS);

	return {
		plants: data?.plants || [],
		loading,
		error,
		refetch,
	};
};

export const usePlantsWithOperations = () => {
	const { data, loading, error, refetch } = useQuery(GET_PLANTS_WITH_OPERATIONS);

	return {
		plants: data?.plantsWithOperations || [],
		loading,
		error,
		refetch,
	};
};

export const usePlantOperations = (plantId: string) => {
	const { data, loading, error, refetch } = useQuery(GET_PLANT_OPERATIONS, {
		variables: { plantId },
		skip: !plantId,
	});

	return {
		operations: data?.operations || [],
		loading,
		error,
		refetch,
	};
};

export const useCreatePlant = () => {
	const [createPlantMutation, { loading, error }] = useMutation(CREATE_PLANT);

	const createPlant = async (input: CreatePlantInput) => {
		try {
			const result = await createPlantMutation({
				variables: input,
				update: (cache: any, { data }: any) => {
					if (data?.createPlant) {
						const existingPlants = cache.readQuery({ query: GET_PLANTS });
						if (existingPlants) {
							cache.writeQuery({
								query: GET_PLANTS,
								data: {
									plants: [...existingPlants.plants, data.createPlant],
								},
							});
						}
					}
				},
			});
			return result.data?.createPlant;
		} catch (err) {
			console.error('Error creating plant:', err);
			throw err;
		}
	};

	return {
		createPlant,
		loading,
		error,
	};
};

export const useUpdatePlant = () => {
	const [updatePlantMutation, { loading, error }] = useMutation(UPDATE_PLANT);

	const updatePlant = async (input: UpdatePlantInput) => {
		try {
			const result = await updatePlantMutation({
				variables: input,
			});
			return result.data?.updatePlant;
		} catch (err) {
			console.error('Error updating plant:', err);
			throw err;
		}
	};

	return {
		updatePlant,
		loading,
		error,
	};
};

export const useDeletePlant = () => {
	const [deletePlantMutation, { loading, error }] = useMutation(DELETE_PLANT);

	const deletePlant = async (id: string) => {
		try {
			await deletePlantMutation({
				variables: { id },
				update: (cache: any) => {
					// Remove from plants cache
					const existingPlants = cache.readQuery({ query: GET_PLANTS });
					if (existingPlants) {
						cache.writeQuery({
							query: GET_PLANTS,
							data: {
								plants: existingPlants.plants.filter((plant: Plant) => plant.id !== id),
							},
						});
					}
				},
			});
		} catch (err) {
			console.error('Error deleting plant:', err);
			throw err;
		}
	};

	return {
		deletePlant,
		loading,
		error,
	};
};
