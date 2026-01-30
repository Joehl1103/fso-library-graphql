const Author = require('./models/authorModel.js')
const Book = require('./models/bookModel.js')

async function checkForAuthorAndReturnAuthorId(authorName, newBookId) {
  let res = null
  try {
    res = await Author.findOne({ name: authorName })
  } catch (e) {
    console.warn(`Error while finding author: ${e.message}`)
  }
  const foundAuthor = !(res === null)
  if (!foundAuthor) {
    res = await Author.create({ name: authorName, books: [newBookId] })
  }
  return res._id
}

async function addBookIdToAuthor(bookId, authorId) {
  const bookRes = await Author.findById({ _id: authorId })

  let bookArrayNotNull = bookRes.books.filter(i => i !== null)
  bookArrayNotNull.push(bookId)
  bookRes.books = bookArrayNotNull
  await Author.findOneAndUpdate({ _id: authorId }, bookRes)
}

module.exports = { checkForAuthorAndReturnAuthorId, addBookIdToAuthor }
