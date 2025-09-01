import { gql } from 'apollo-server';

export const plantTypeDefs = gql`
	type Plant {
		id: ID!
		name: String!
		code: String!
		operations: [Operation!]!
		createdAt: Date!
		updatedAt: Date!
	}

	extend type Query {
		plants: [Plant!]!
		plant(id: ID!): Plant
		plantsWithOperations: [Plant!]!
	}

	extend type Mutation {
		createPlant(name: String!, code: String!): Plant!
		updatePlant(id: ID!, name: String, code: String): Plant!
		deletePlant(id: ID!): Boolean!
	}
`;
