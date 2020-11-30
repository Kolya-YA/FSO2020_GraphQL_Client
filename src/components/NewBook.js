import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from '../queries'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook, { loading, error }] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
  })

  const submit = async (event) => {
    event.preventDefault()
    const dPublished = Number.parseInt(published, 10)
    try {
      await addBook({ variables: { title, author, published: dPublished, genres }})
    } catch (error) {
      console.log('Add book error: ', error.graphQLErrors)
    }

    setTitle('')
    setAuhtor('')
    setPublished('')
    setGenre('')
    setGenres([])
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  if (loading) return <div>Loading...</div>
  if (error) return (
    <div>
      <pre>Error: {error.graphQLErrors.map(({ message }, i) => (
          <span key={i}>{message}</span>
        ))}
        </pre>
    </div>
  )

  return (
    <div>
      <form onSubmit={submit}>
        <label>Title 
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label><br />
        <label>Author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </label><br />
        <label>
          Published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </label><br />
        <input
          value={genre}
          onChange={({ target }) => setGenre(target.value)}
        />
        <button onClick={addGenre} type="button">Add genre</button><br />
        <div>Genres: {genres.join(', ')}</div>
        <button type='submit'>Create book</button>
      </form>
    </div>
  )
}

export default NewBook