import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { ApolloProvider } from "@apollo/client/react"
import { SetContextLink } from "@apollo/client/link/context";
import { BrowserRouter } from "react-router";
import { Provider } from 'react-redux'
import store from './store.js'

import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws/client'

const authLink = new SetContextLink(({ headers }) => {
  let token = null
  const itemInLocalStorage = JSON.parse(localStorage.getItem("loggedinUser"))
  if (itemInLocalStorage) {
    token = itemInLocalStorage.token
  }
  const newHeaders = {
    ...headers,
    authorization: token ? `Bearer ${token}` : null
  }
  return { headers: newHeaders }
})

const httpLink = new HttpLink({
  uri: 'http://localhost:4000'
})

const wsLink = new GraphQLWsLink(
  createClient({ url: 'ws://localhost:4000' })
)

const splitLink = split(({ query }) => {
  const definition = getMainDefinition(query)
  return (
    definition.kind === 'OperationDefinition' &&
    definition.operation == 'subscription'
  )
},
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

ReactDOM.createRoot(document.getElementById("root")).render(

  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ApolloProvider>
);
