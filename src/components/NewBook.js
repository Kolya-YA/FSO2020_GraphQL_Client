import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import { CREATE_BOOK } from '../queries'

const NewBook = () => {
  const [title, setTitle] = useState('Poor Folk (Бедные люди)')
  const [author, setAuhtor] = useState('Fyodor Dostoevsky')
  const [published, setPublished] = useState('1846')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState(['epistolary novel'])

  const [addBook, { loading, error }] = useMutation(CREATE_BOOK, {
    onError: error => {
      console.log('Add book error: ', error.graphQLErrors[0])
    },
  })

  const submit = (event) => {
    event.preventDefault()
    const dPublished = Number.parseInt(published, 10)
    addBook({ variables: { title, author, published: dPublished, genres }})

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
  if (error?.length) return (
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