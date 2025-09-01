import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { Toaster } from 'sonner';
import { client } from './apollo';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<App />
			<Toaster position='top-right' richColors expand={true} duration={3000} closeButton />
		</ApolloProvider>
	</React.StrictMode>
);
