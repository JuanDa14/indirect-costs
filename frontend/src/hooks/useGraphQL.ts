export {
	useGetPlantsQuery,
	useGetPlantOperationsQuery,
	useCreatePlantMutation,
	useUpdatePlantMutation,
	useDeletePlantMutation,
	useCreateOperationMutation,
	useUpdateOperationCostsMutation,
	useDeleteOperationMutation,
} from '../graphql/graphql.types';

import { useGetPlantsQuery, useGetPlantOperationsQuery } from '../graphql/graphql.types';

export const usePlants = () => {
	const { data, loading, error, refetch } = useGetPlantsQuery();

	return {
		plants: data?.plants || [],
		loading,
		error,
		refetch,
	};
};

export const usePlantOperations = (plantId: string) => {
	const { data, loading, error, refetch } = useGetPlantOperationsQuery({
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
