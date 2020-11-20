import React from 'react'
import { useQuery, gql } from '@apollo/client'

const ALL_AUTHORS = gql`
query {
  allAuthors {
    name,
    born,
    booksCount
  }
}
`

const Authors = () => {
  const { loading, error, data } = useQuery(ALL_AUTHORS)
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error</div>
  
  return (
    <div>
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
    </div>
  )
}

export default Authors
