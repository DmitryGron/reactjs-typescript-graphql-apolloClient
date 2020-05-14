import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import Root from './components/Root';
import './index.css';
import './polyfills';


const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const cache = new InMemoryCache();

const link = ApolloLink.from([
  errorLink,
  new HttpLink({ uri: 'http://localhost:5001/api/' }),
]);



const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
});

ReactDOM.render(<ApolloProvider client={client}><Root /></ApolloProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
