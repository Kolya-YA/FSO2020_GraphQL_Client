import React, { useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'

import { GET_BOOKS, ALL_GENRES } from '../queries'
import { useEffect } from 'react'

const Books = ({ user }) => {
  
  const [getFiltredBooks, {
    loading: filtredBooksLoading,
    error: filtredBooksError,
    data: filtredBooksData
  }] = useLazyQuery(GET_BOOKS)

  const {
    loading: allGenresLoading,
    error: allGenresError,
    data: allGenresData
  } = useQuery(ALL_GENRES)

  const [books, setBooks] = useState([])
  const [genresFilter, setGenresFilter] = useState(null)

  useEffect(() => {
    genresFilter ?
      getFiltredBooks({ variables: { genreFilter: genresFilter }}) :
      getFiltredBooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [genresFilter])

  const BookList = () => {
    if (filtredBooksLoading) return <div>Loading books...</div>
    if (filtredBooksError) {
      console.log('filtredBooksError: ', filtredBooksError)
      return <div>Filtred bBooks error: {filtredBooksError.data}</div>
    }
      
    filtredBooksData && setBooks(filtredBooksData.allBooks)

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
    const genres = user.token ?
      ['Recomended', 'All books'].concat(allGenresData.allGenres) :
      ['All books'].concat(allGenresData.allGenres)

    const genresSelectorHandler = event => {
      switch (event.target.value) {
        case 'All books':
          setGenresFilter(null)
          break
        case 'Recomended':
          setGenresFilter(user.favoriteGenre)
          break      
        default:
          setGenresFilter(event.target.value)
          break
      }
    }

    return (
      <div>
        {}
        {genres.map(g => 
          <button
            key={g}
            value={g}
            onClick={genresSelectorHandler}
          >
            {g}
          </button>
        )}
      </div>
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