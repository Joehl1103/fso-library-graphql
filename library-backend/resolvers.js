const Author = require('./models/authorModel.js')
const User = require('./models/userModel.js')
const Book = require('./models/bookModel.js')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { checkForAuthorAndReturnAuthorId, addBookIdToAuthor } = require('./helpers.js')

const resolvers = {
  Query: {
    authorCount: () => Author.collection.countDocuments({}),
    allBooks: async (root, args) => {
      let books = null
      const isEmpty = Object.keys(args).length === 0
      const isAuthor = !(args.author === undefined)
      let authorIdToString = null
      let author = null
      if (isAuthor) {
        author = await Author.find({ name: args.author })
        if (author.length === 0) {
          throw new GraphQLError('author does not exist', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author
            }
          })
        }
        authorIdToString = author[0]._id.toString()
      }

      const isGenre = !(args.genre === undefined)
      if (isGenre) {
        const allGenres = await Book.distinct('genres')
        const genreExists = allGenres.some(g => g === args.genre)
        if (!genreExists) {
          throw new GraphQLError('genre does not exist', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.genre
            }
          })
        }
      }
      const popObj = { path: 'author', populate: { path: 'books' } }
      switch (true) {
        case isEmpty:
          books = await Book
            .find({})
            .populate(popObj)
          return books
        case isAuthor && !isGenre:
          return await Book
            .find({ author: authorIdToString })
            .populate(popObj)
        case !isAuthor && isGenre:
          const res = await Book
            .find({ genres: args.genre })
            .populate(popObj)
          return res
        case isAuthor && isGenre:
          return await Book
            .find({ author: authorIdToString, genres: args.genre })
            .populate(popObj)
        default:
          return null
      }
    },
    allAuthors: async (root, args) => {
      let authors = []
      try {
        authors = await Author.find({}).populate('books')
      } catch (e) {
        throw new Error(`Error: ${e.message}`)
      }
      return authors
    },
    allUsers: async (root, args) => {
      return await User.find({})
    },
    me: (root, args, contextValue) => {
      if (!contextValue) {
        throw new GraphQLError('no context value', {
          extensions: {
            code: 'NO_CONTEXT_VALUE',
            args: contextValue
          }
        })
      }
      return contextValue.currentUser
    }
  },
  // Author: {
  //   bookCount: async (root, args) => {
  //     const authorId = root._id.toString()
  //     const res = await Author.find({ _id: authorId })
  //     const author = res[0]
  //     const { books } = author
  //     return books.length
  //   }
  // },
  Mutation: {
    /*
     * addBook( 
      title: String!
      published: Int!
      author: String!
      genres: [String!]
      ):Book  */
    addBook: async (root, args, contextValue) => {
      if (!contextValue.currentUser) {
        throw new GraphQLError('must be logged in', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR'
          }
        })
      }
      const book = { ...args }
      const { author, title } = args
      const titleExists = await Book.find({ title: title })
      if (titleExists.length > 0) {
        throw new GraphQLError('title already exists', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: title
          }
        })
      }
      if (!author) {
        throw new GraphQLError('name of athor does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      if (book.title.length < 4) {
        throw new GraphQLError('title must be at least 5 characters long', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      // TODO add checkForAuthorAndAct
      // TODO get the author id by checking and if necessary, creating
      const authorId = await checkForAuthorAndReturnAuthorId(author)
      book.author = authorId
      // modify the book object by adding the author id
      // create the book and get the book id
      const { _id } = await Book.create(book)
      const bookId = _id
      // modify the author
      addBookIdToAuthor(bookId, authorId)
      await Author.findOneAndUpdate({ _id: _id }, {})
      // const [bookWithAuthor] = await Book.find({ title: book.title }).populate('author')
      // pubsub.publish('BOOK_ADDED', { bookAdded: bookWithAuthor })
      // return bookWithAuthor
    },
    deleteBook: async (root, args, contextValue) => {
      if (!contextValue.currentUser) {
        throw new GraphQLError('must be logged in', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR'
          }
        })
      }

      const book = await Book.findOne({ title: args.title })
      if (!book) {
        throw new GraphQLError('this title does not correspond to any book', {
          estensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }
      await Book.findOneAndDelete({ title: args.title })
      return book
    },
    addAuthor: async (root, args, contextValue) => {
      if (!contextValue.currentUser) {
        throw new GraphQLError('must be logged in', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR'
          }
        })
      }

      if (args.name.length < 4) {
        throw new GraphQLError("author's name must be at least 4 characters long", {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (author) {
        throw new GraphQLError('author already exists', {
          extensions: 'BAD_USER_INPUT',
          invalidArgs: args.name
        })
      }
      let newAuthor = { ...args }
      if (!args.born) {
        newAuthor.born = null
      }
      await Author.create(newAuthor)
      return newAuthor
    }
    ,
    /*
     * takes the following arguments:
     * editAuthor(
      * name: String!
      * setBornTo: Int!
     * ):Author
     *
     * type Author {
      name: String!
      born: Int
      bookCount: Int!
      }
     * */
    editAuthor: async (root, args, contextValue) => {
      if (!contextValue.currentUser) {
        throw new GraphQLError('must be logged in', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR'
          }
        })
      }

      const author = await Author.exists({ name: args.name })
      if (!author) {
        throw new GraphQLError('author does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      const updatedAuthor = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      ).populate('books')
      return updatedAuthor
    },
    createUser: async (root, args) => {
      const { username } = args
      const userExists = await User.find({ username: username })
      if (userExists.length > 0) {
        throw new GraphQLError('user already exists', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: username
          }
        })
      }
      const userObject = { username: username }
      await User.create(userObject)
      return userObject
    },
    editUser: async (root, args, contextValue) => {
      const userId = contextValue.currentUser._id
      const user = await User.findById(userId)
      if (!user) {
        throw new GraphQLError('no user exists', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username
          }
        })
      }
      switch (args.changeType) {
        case 'both':
          await User.findByIdAndUpdate(userId, { username: args.username, favoriteGenre: args.favoriteGenre })
        case 'un':
          await User.findByIdAndUpdate(userId, { username: args.username })
        case 'gen':
          await User.findByIdAndUpdate(userId, { favoriteGenre: args.favoriteGenre }, { new: true }).lean()
        default:
          return
      }
    },
    login: async (root, args) => {
      const { username } = args
      const user = await User.findOne({ username: username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }

  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers
