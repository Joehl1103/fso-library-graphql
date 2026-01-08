const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]
    id: ID!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    books: [Book]
  }

  type User {
    username: String!
    favoriteGenre: String
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int! 
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
    allUsers: [User]!
    user(username: String): User
    me: User
  }

  type Mutation {
    addBook( 
      title: String!
      published: Int!
      author: String!
      genres: [String!]
      ):Book
    
    deleteBook(
      title: String!
    ):Book
    
    addAuthor(
      name: String!
      born: Int
    ): Author

    editAuthor(
      name: String!
      setBornTo: Int!
    ):Author
    
    createUser(
      username: String!
      favoriteGenre: String
    ): User
    
    editUser(
      username: String
      favoriteGenre: String
      changeType: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
  
  type Subscription {
    bookAdded: Book!
  }
`

module.exports = typeDefs
