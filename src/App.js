import React, { useState, useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Header from './components/Header'
import { useSubscription } from '@apollo/client'
import { BOOKS_SUBSCRIPTION } from './queries'

const App = () => {
  const [user, setUser] = useState({})

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('books-user'))
    if (loggedUser && !user.token) {
      setUser(loggedUser)
    }
  }, [user])


  useSubscription(BOOKS_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('SD: ', subscriptionData.data.bookAdded)
      window.alert(`Book added: ${subscriptionData.data.bookAdded.title}`)
    }
  })

  return (
    <div>
      <Header
        user={user}
        setUser={setUser}
      />
      <Switch>
        <Route path='/add_book'>
          <NewBook />
        </Route>
        <Route path='/books'>
          <Books
            user={user}
          />
        </Route>
        <Route path='/'>
          <Authors />
        </Route>
      </Switch>
    </div>
  )
}

export default App