import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client/react'
import { ADD_BOOK, GET_ALL_AUTHORS, GET_ALL_BOOKS } from '../queries'
import { useDispatch } from 'react-redux'
import { setError } from '../reducers/errorSlice.js'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const dispatch = useDispatch()

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_ALL_BOOKS }, { query: GET_ALL_AUTHORS }],
    onError: (e) => dispatch(setError(e.message))
  })


  const submit = async (event) => {
    event.preventDefault()

    try {
      if (typeof published === 'string') {
        const numberPub = Number(published)
        setPublished(Number(numberPub))
      }
      const variables = { title, published, author, genres }
      await addBook({ variables: variables })
      // addToGenreArray(genres)
      setTitle('')
      setPublished('')
      setAuthor('')
      setGenres([])
      setGenre('')
    } catch (e) {
      console.log('error while adding book', e)
      throw new Error('Error while adding book')
    }
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>Add a book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
