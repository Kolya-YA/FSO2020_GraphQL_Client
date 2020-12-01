import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider, ApolloLink, concat } from '@apollo/client'
import { BrowserRouter as Router } from 'react-router-dom'

const httpLink = new HttpLink({ uri: 'http://localhost:4000/' })

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('books-user-token')
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null
    }
  }))
  
  return forward(operation)
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink)
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById('root'))