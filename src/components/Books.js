import React, { useState, useEffect } from 'react'
import { useApolloClient, useLazyQuery, useQuery, useSubscription } from '@apollo/client'

import { GET_BOOKS, ALL_GENRES, ALL_AUTHORS, BOOKS_SUBSCRIPTION } from '../queries'

const Books = ({ user }) => {
  const client = useApolloClient()
  
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

  const updateCacheWith = addedBook => {
    const booksInStore = client.readQuery({ query: GET_BOOKS })
    const genresInStore = client.readQuery({ query: ALL_GENRES })
    const authorsInStore = client.readQuery({ query: ALL_AUTHORS })

    const bookInclude = booksInStore?.allBooks.some(b => b.id === addedBook.id)
    if (!bookInclude) {
      client.writeQuery({
        query: GET_BOOKS,
        data: { allBooks: [...booksInStore.allBooks, addedBook] }
      })
    }
    
    if (genresInStore) {
      const genresNotInclude = addedBook.genres.filter(g => !genresInStore.allGenres.includes(g))
      if (genresNotInclude.length) {
        client.writeQuery({
          query: ALL_GENRES,
          data: { allGenres: [...genresInStore.allGenres, ...genresNotInclude] }
        })
      }
    }

    if (authorsInStore)  {
      const authorInclude = authorsInStore.allAuthors.some(a => a.id === addedBook.author.id)
      if (!authorInclude) {
        client.writeQuery({
          query: ALL_AUTHORS,
          data: { allAuthors: [...authorsInStore.allAuthors, addedBook.author] }
        })
      }
    }
  }

  
  useSubscription(BOOKS_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      updateCacheWith(addedBook)
      window.alert(`Book added: ${addedBook.title}`)
    }
  })

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