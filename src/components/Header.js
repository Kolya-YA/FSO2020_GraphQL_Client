import React, { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { NavLink } from 'react-router-dom'

import LoginForm from './LoginForm'

const Header = props => {
  const { user, setUser } = props

  const [showLoginForm, setShowLoginForm] = useState(true)
  const client = useApolloClient()

  const logoutHandler = event => {
    console.log('Logout')
    setUser({})
    localStorage.clear()
    client.resetStore()
    event.preventDefault()
  }

  const loginHandler = event => {
    setShowLoginForm(!showLoginForm)
    event.preventDefault()
  }

  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink to='/'>Authors</NavLink>
          </li>
          <li>
            <NavLink to='/books'>Books</NavLink>
          </li>
          {user.token &&
            <li>
              <NavLink to='/add_book'>Add book</NavLink>
            </li>
          }
        </ul>
      </nav>
      <div>
        {user.token ?
          <button onClick={logoutHandler}>Logout</button> :
          <button to='#' onClick={loginHandler}>Login</button>
        }
      </div>
      <hr />
      {!user.token && showLoginForm &&
        <LoginForm
          loginHandler={loginHandler}
          setUser={setUser}
        />
      }
      </header>
  )
}

export default Header
