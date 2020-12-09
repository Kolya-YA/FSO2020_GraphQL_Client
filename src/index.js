import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {
  ApolloClient, HttpLink, InMemoryCache,
  ApolloProvider, ApolloLink, concat, split,
 } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { BrowserRouter as Router } from 'react-router-dom'
import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = new HttpLink({ uri: 'http://localhost:4000/' })

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: { reconnect: true }
})

const authMiddleware = new ApolloLink((operation, forward) => {
  const user = JSON.parse(localStorage.getItem('books-user'))
  
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: user?.token ? `bearer ${user.token}` : null
    }
  }))
  
  return forward(operation)
})

const splitLink = split(
  ({ query }) => {
    const defenition = getMainDefinition(query)
    return (
      defenition.kind === 'OperationDefinition' &&
      defenition.operation === 'subscription'
    )
  },
  wsLink,
  concat(authMiddleware, httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById('root'))