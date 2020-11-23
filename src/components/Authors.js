import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = () => {
  const { loading, error, data } = useQuery(ALL_AUTHORS)
  const [bornYear, setBornYear] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const selectHandler = event => {
    setSelectedAuthor(event.target.value)
    const bornInput = data.allAuthors.find(a => a.name === event.target.value).born
    setBornYear(bornInput || '')
  }

  const updateHandler = async (event) => {
    editAuthor({ variables: { name: selectedAuthor, setBornTo: bornYear }})
    event.preventDefault()
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error</div>
  
  return (
    <div>
      <section>
        <h2>Authors</h2>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Born</th>
              <th>Books</th>
            </tr>
            {data.allAuthors.map(a =>
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.booksCount}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      <section>
        <h3>Set birthyear</h3>
        <form onSubmit={updateHandler}>
          <select value={selectedAuthor} onChange={selectHandler}>
            <option value=''>Select author</option>
            {data.allAuthors.map(a =>
              <option key={a.name}>{a.name}</option>
            )}
          </select><br/>
          <label>Born:
            <input
              type='number'
              value={bornYear}
              onChange={({ target }) => setBornYear(+target.value)}
            />
          </label><br/>
          <button>Update author</button>
        </form>
      </section>
    </div>
  )
}

export default Authors
