import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
        name
      }
    published
    genres
  }
`

export const GET_BOOKS = gql`
query allBooks($genreFilter: String) {
  allBooks(genre: $genreFilter) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
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
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
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

export const BOOKS_SUBSCRIPTION = gql`
  subscription {
    bookAdded{
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`