import { GraphQLScalarType, Kind } from 'graphql';

export const DateScalar = new GraphQLScalarType({
	name: 'Date',
	description: 'Date custom scalar type',
	serialize: (value: unknown) => {
		if (value instanceof Date) {
			return value.toISOString();
		}
		return value;
	},
	parseValue: (value: unknown) => {
		if (typeof value === 'string') {
			return new Date(value);
		}
		return null;
	},
	parseLiteral: (ast) => {
		if (ast.kind === Kind.STRING) {
			return new Date(ast.value);
		}
		return null;
	},
});
