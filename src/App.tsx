import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import './App.css';
import { GetCountries } from './components/GetCountries';

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        alert(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) alert(`[Network error]: ${networkError}`);
  });

const link = from([
    errorLink,
    new HttpLink({uri: "https://countries.trevorblades.com"})
])

const client = new ApolloClient({
    cache: new InMemoryCache,
    link: link
})
function App() {
  return (
    <ApolloProvider client={client}>
        <GetCountries/>
    </ApolloProvider>
  )
}

export default App
