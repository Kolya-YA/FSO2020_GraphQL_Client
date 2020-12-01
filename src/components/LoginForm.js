import { useMutation } from '@apollo/client'
import React from 'react'
import { useState, useEffect } from 'react'
import { LOGIN } from '../queries'

const LoginForm = props => {
  const { loginHandler, setToken } = props
  const [input, setInput] = useState({ login: 'James Bond', password: 'secret' })

  const [loginReq, loginRes] = useMutation(LOGIN, {
    onError: error => {
      console.log('Error: ', error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (loginRes.data) {
      const token = loginRes.data.login.value
      setToken(token)
      localStorage.setItem('books-user-token', token)
      console.log('logRes', token)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginRes.data])


  const handleInputsChange = event => {
    setInput({
      ...input,
     [event.target.name]: event.target.value
    })
  }

  const handleSubmit = event => {
    loginReq({ variables: {
      username: input.login,
      password: input.password
    }})
    event.preventDefault()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">
          Login:
          <input 
            type='text'
            name='login'
            value={input.login}
            onChange={handleInputsChange}
            />
        </label>
        <br />
        <label htmlFor="">
          Password:
          <input
            type='password'
            name='password'
            value={input.password}
            onChange={handleInputsChange}
            />
        </label>
        <br />
        <button type='submit'>Login</button>
        <button type='button' onClick={loginHandler}>Cancel</button>
      </form>
      <hr />
    </div>
  )
}

export default LoginForm