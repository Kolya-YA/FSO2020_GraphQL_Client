import React from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS, ALL_GENRES } from '../queries'
import { useState } from 'react'

const Books = () => {

  const [genresFilter, setGenresFilter] = useState(null)

  const { loading: allBooksLoading, error: allBooksError, data: allBooksData } = useQuery(ALL_BOOKS)
  const { loading: allGenresLoading, error: allGenresError, data: allGenresData } = useQuery(ALL_GENRES)

  const BookList = () => {

    if (allBooksLoading) return <div>Loading books...</div>
    if (allBooksError) {
      console.log('allBooksError: ', allBooksError)
      return <div>Books error: {allBooksError.data}</div>
    }
      
      const books = genresFilter ? 
        allBooksData.allBooks.filter(b => b.genres.includes(genresFilter)) :
        allBooksData.allBooks

      return (
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      )
  }

  const GenreList = () => {

    if (allGenresLoading) return <div>Loading genres...</div>
    if (allGenresError) {
      console.log('allBooksError: ', allGenresError)
      return <div>Genres error: {allGenresError.data}</div>
    }
    const genres = ['All books'].concat(allGenresData.allGenres)

    const genresSelectorHandler = event => {
      const filter = event.target.value === 'All books' ? null : event.target.value
      setGenresFilter(filter) 
    }

    return (
      <p>
      {genres.map(g => 
        <button
          key={g}
          value={g}
          onClick={genresSelectorHandler}
        >
          {g}
        </button>
      )}
      </p>
    )
  }

  return (
    <section>
      <h2>Books{genresFilter && ` fltred by genre ${genresFilter}`}</h2>
      <BookList />
      <hr />
      <GenreList />
    </section>
  )
}

export default Books