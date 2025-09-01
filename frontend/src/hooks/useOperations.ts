export {
	useCreateOperationMutation,
	useUpdateOperationCostsMutation,
	useDeleteOperationMutation,
} from '../graphql/graphql.types';

import {
	useCreateOperationMutation as useCreateOperationMutationGenerated,
	useUpdateOperationCostsMutation as useUpdateOperationCostsMutationGenerated,
	useDeleteOperationMutation as useDeleteOperationMutationGenerated,
} from '../graphql/graphql.types';

export const useCreateOperation = () => {
	const [createOperationMutation, { loading, error }] = useCreateOperationMutationGenerated({
		refetchQueries: ['GetPlantOperations'],
	});

	const createOperation = async (input: { plantId: string; name: string; costs?: any[] }) => {
		try {
			const result = await createOperationMutation({
				variables: input,
			});
			return result.data?.createOperation;
		} catch (err) {
			console.error('Error creating operation:', err);
			throw err;
		}
	};

	return {
		createOperation,
		loading,
		error,
	};
};

export const useUpdateOperationCosts = () => {
	const [updateCostsMutation, { loading, error }] = useUpdateOperationCostsMutationGenerated();

	const updateOperationCosts = async (input: { operationId: string; costs: any[] }) => {
		try {
			const result = await updateCostsMutation({
				variables: input,
			});
			return result.data?.updateOperationCosts;
		} catch (err) {
			console.error('Error updating operation costs:', err);
			throw err;
		}
	};

	return {
		updateOperationCosts,
		loading,
		error,
	};
};

export const useDeleteOperation = () => {
	const [deleteOperationMutation, { loading, error }] = useDeleteOperationMutationGenerated({
		refetchQueries: ['GetPlantOperations'],
	});

	const deleteOperation = async (operationId: string) => {
		try {
			await deleteOperationMutation({
				variables: { operationId },
			});
		} catch (err) {
			console.error('Error deleting operation:', err);
			throw err;
		}
	};

	return {
		deleteOperation,
		loading,
		error,
	};
};
