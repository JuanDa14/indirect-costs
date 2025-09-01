import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { APP_CONFIG } from './lib/constants';

export const client = new ApolloClient({
	link: new HttpLink({ uri: APP_CONFIG.GRAPHQL_ENDPOINT, fetch }),
	cache: new InMemoryCache(),
});
