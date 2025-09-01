import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	overwrite: true,
	schema: 'schema.graphql',
	documents: 'src/**/*.{ts,tsx}',
	generates: {
		'src/graphql/graphql.types.ts': {
			plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
			config: {
				withHooks: true,
				withComponent: false,
				withHOC: false,
				reactApolloVersion: 3,
				skipTypename: false,
				namingConvention: 'keep',
			},
		},
		'src/graphql/introspection.json': {
			plugins: ['introspection'],
		},
	},
};

export default config;
