export type {
	Plant,
	Operation,
	IndirectCost,
	IndirectCostInput,
	CreatePlantMutationVariables as CreatePlantInput,
	UpdatePlantMutationVariables as UpdatePlantInput,
	CreateOperationMutationVariables as CreateOperationInput,
	UpdateOperationCostsMutationVariables as UpdateOperationCostsInput,
} from '../graphql/graphql.types';

import type { Plant, Operation } from '../graphql/graphql.types';

export type PlantWithOperations = Plant & {
	operations: Operation[];
};
