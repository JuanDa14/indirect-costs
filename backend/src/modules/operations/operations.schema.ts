import { gql } from 'apollo-server';

export const operationTypeDefs = gql`
	type Operation {
		id: ID!
		plantId: ID!
		name: String!
		costs: [IndirectCost!]!
		plant: Plant!
		createdAt: Date!
		updatedAt: Date!
	}

	type IndirectCost {
		id: ID!
		operationId: ID!
		volumeThresholdKg: Float!
		costPerKg: Float!
	}

	input IndirectCostInput {
		volumeThresholdKg: Float!
		costPerKg: Float!
	}

	extend type Query {
		operations(plantId: ID!): [Operation!]!
		operation(id: ID!): Operation
		allOperations: [Operation!]!
	}

	extend type Mutation {
		createOperation(plantId: ID!, name: String!, costs: [IndirectCostInput!]): Operation!
		upsertOperation(plantId: ID!, name: String!, costs: [IndirectCostInput!]!): Operation!
		updateOperation(id: ID!, name: String, costs: [IndirectCostInput!]): Operation!
		updateOperationCosts(operationId: ID!, costs: [IndirectCostInput!]!): Operation!
		deleteOperation(operationId: ID!): Boolean!
	}
`;
