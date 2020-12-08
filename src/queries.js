import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
query allBooks($genreFilter: String) {
  allBooks(genre: $genreFilter) {
    title,
    author {
      name
    }
    published,
    genres
  }
}
`

export const ALL_GENRES = gql`
query {
  allGenres
}
`


export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name,
    born,
    booksCount
  }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    ) {
      value,
      user {
        username
        favoriteGenre
      }
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int, $genres: [String]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author {
          name
        }
      published
      id
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name
      setBornTo: $setBornTo
    ) {
      name
      born
      id
    }
  }
`