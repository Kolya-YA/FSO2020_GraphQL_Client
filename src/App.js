import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import TopNav from './components/TopNav'

const App = () => {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const loggedUserToken = localStorage.getItem('books-user-token')
    if (loggedUserToken && !token) setToken(loggedUserToken)
  }, [token])

  return (
    <div>
      <TopNav token={token} setToken={setToken} />
      <Switch>
        <Route path='/add_book'>
          <NewBook />
        </Route>
        <Route path='/books'>
          <Books />
        </Route>
        <Route path='/'>
          <Authors />
        </Route>
      </Switch>
    </div>
  )
}

export default App