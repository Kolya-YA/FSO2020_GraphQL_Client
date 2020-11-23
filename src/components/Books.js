import React from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Books = () => {
  const { loading, error, data } = useQuery(ALL_BOOKS)
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  const books = data.allBooks

  return (
    <section>
      <h2>Books</h2>

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
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>

      
    </section>
  )
}

export default Books