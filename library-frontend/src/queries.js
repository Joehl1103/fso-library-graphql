import { gql } from '@apollo/client'

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    id
    name
    born
    books {
      title
    }
  }   
`
const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title 
    published
    author {
      ...AuthorDetails
    }
    genres
  }
  ${AUTHOR_DETAILS}
`

export const GET_ALL_BOOKS = gql`
  query allBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const GET_ALL_AUTHORS = gql`
  query allAuthors {
    allAuthors {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

const USER_DETAILS = gql`
   fragment UserDetails on User {
     username
     favoriteGenre
  }
 `
export const ME = gql`
  query me {
    me {
      ...UserDetails
      id
    }
  }
  ${USER_DETAILS}
 `

export const EDIT_USER = gql`
  mutation editUser($username: String, $favoriteGenre: String, $changeType: String!) {
    editUser(username: $username, favoriteGenre: $favoriteGenre, changeType: $changeType){
      username
      favoriteGenre
      id
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!){
    login(username: $username, password: $password){
      value
    }
  }
`

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!,
    $published: Int!,
    $author: String!,
    $genres: [String!]
    ){
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
      ){
        title
        published
        genres }
  }
`

export const EDIT_AUTHOR = gql`
  mutation EditAuthor(
    $name: String!
    $setBornTo: Int!
    ){
      editAuthor(
        name: $name
        setBornTo: $setBornTo
      ){
        name
        born
      }
    }
`
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

