import { gql } from '@apollo/client';

// fragments
export const INDIRECT_COST_FRAGMENT = gql`
	fragment IndirectCostFragment on IndirectCost {
		id
		operationId
		volumeThresholdKg
		costPerKg
	}
`;

export const OPERATION_FRAGMENT = gql`
	fragment OperationFragment on Operation {
		id
		plantId
		name
		createdAt
		updatedAt
		costs {
			...IndirectCostFragment
		}
	}
	${INDIRECT_COST_FRAGMENT}
`;

export const PLANT_FRAGMENT = gql`
	fragment PlantFragment on Plant {
		id
		name
		code
		createdAt
		updatedAt
	}
`;

// queries
export const GET_PLANTS = gql`
	query GetPlants {
		plants {
			...PlantFragment
		}
	}
	${PLANT_FRAGMENT}
`;

export const GET_PLANTS_WITH_OPERATIONS = gql`
	query GetPlantsWithOperations {
		plantsWithOperations {
			...PlantFragment
			operations {
				...OperationFragment
			}
		}
	}
	${PLANT_FRAGMENT}
	${OPERATION_FRAGMENT}
`;

export const GET_PLANT_OPERATIONS = gql`
	query GetPlantOperations($plantId: ID!) {
		operations(plantId: $plantId) {
			...OperationFragment
		}
	}
	${OPERATION_FRAGMENT}
`;

// mutaciones
export const CREATE_PLANT = gql`
	mutation CreatePlant($name: String!, $code: String!) {
		createPlant(name: $name, code: $code) {
			...PlantFragment
		}
	}
	${PLANT_FRAGMENT}
`;

export const UPDATE_PLANT = gql`
	mutation UpdatePlant($id: ID!, $name: String, $code: String) {
		updatePlant(id: $id, name: $name, code: $code) {
			...PlantFragment
		}
	}
	${PLANT_FRAGMENT}
`;

export const DELETE_PLANT = gql`
	mutation DeletePlant($id: ID!) {
		deletePlant(id: $id)
	}
`;

export const CREATE_OPERATION = gql`
	mutation CreateOperation($plantId: ID!, $name: String!, $costs: [IndirectCostInput!]) {
		createOperation(plantId: $plantId, name: $name, costs: $costs) {
			...OperationFragment
		}
	}
	${OPERATION_FRAGMENT}
`;

export const UPDATE_OPERATION_COSTS = gql`
	mutation UpdateOperationCosts($operationId: ID!, $costs: [IndirectCostInput!]!) {
		updateOperationCosts(operationId: $operationId, costs: $costs) {
			...OperationFragment
		}
	}
	${OPERATION_FRAGMENT}
`;

export const DELETE_OPERATION = gql`
	mutation DeleteOperation($operationId: ID!) {
		deleteOperation(operationId: $operationId)
	}
`;
