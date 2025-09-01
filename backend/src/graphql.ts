import { gql } from 'apollo-server';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import type { IResolvers } from '@graphql-tools/utils';

import { DateScalar } from './common/scalars/index.js';

import { plantTypeDefs, plantResolvers } from './modules/plants/index.js';
import { operationTypeDefs, operationResolvers } from './modules/operations/index.js';

const baseTypeDefs = gql`
	scalar Date

	type Query {
		_empty: String
	}

	type Mutation {
		_empty: String
	}
`;

export const typeDefs = mergeTypeDefs([baseTypeDefs, plantTypeDefs, operationTypeDefs]);

export const resolvers: IResolvers = mergeResolvers([
	{
		Date: DateScalar,
	},
	plantResolvers,
	operationResolvers,
]);
