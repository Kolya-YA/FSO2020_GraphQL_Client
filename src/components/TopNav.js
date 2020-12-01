import React, { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { NavLink } from 'react-router-dom'

import LoginForm from './LoginForm'

const TopNav = props => {
  const { token, setToken } = props

  const [showLoginForm, setShowLoginForm] = useState(true)
  const client = useApolloClient()

  const logoutHandler = event => {
    console.log('Logout')
    setToken(null)
    localStorage.clear()
    client.resetStore()
    event.preventDefault()
  }

  const loginHandler = event => {
    setShowLoginForm(!showLoginForm)
    event.preventDefault()
  }

  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/'>Authors</NavLink>
        </li>
        <li>
          <NavLink to='/books'>Books</NavLink>
        </li>
        {token ?
          <>
            <li>
              <NavLink to='/add_book'>Add book</NavLink>
            </li>
            <li>
              <NavLink to='/' onClick={logoutHandler}>Logout</NavLink>
            </li>
          </>
        :
          <li>
            <NavLink to='#' onClick={loginHandler}>Login</NavLink>
          </li>
        }
      </ul>
      <hr />
      {!token && showLoginForm &&
        <LoginForm
          loginHandler={loginHandler}
          setToken={setToken}
        />
      }
    </nav>
  )
}

export default TopNav
