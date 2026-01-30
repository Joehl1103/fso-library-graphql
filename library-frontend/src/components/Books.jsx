import { useQuery } from '@apollo/client/react'
import { GET_ALL_BOOKS } from '../queries'
import { useDispatch } from 'react-redux'
import { setPage } from '../reducers/pageSlice'
import { useEffect, useState } from 'react'
import NewBook from './NewBook.jsx'

const Books = () => {
  const [genreFilter, setGenreFilter] = useState()
  const [allBooks, setAllBooks] = useState([])
  const [genres, setGenres] = useState([])
  const dispatch = useDispatch()
  const { loading, error, data } = useQuery(GET_ALL_BOOKS)

  useEffect(() => {
    dispatch(setPage('books'))
    if (data && !loading) {
      setAllBooks(data.allBooks)
      const genreSet = new Set()
      data.allBooks.forEach(b => {
        b.genres.forEach(g => {
          genreSet.add(g)
        })
      })
      setGenres(Array.from(genreSet))
    }
  }, [data, dispatch, loading])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.error(error)
    let errorMessage = ''
    if (error.errors) {
      errorMessage = error.errors[0].message
    } else {
      errorMessage = error.message
    }
    return <div style={{ color: 'red' }}> Error... {errorMessage}</div >
  }

  if (!data) {
    return <div>...books are undefined</div>
  }

  let booksToDisplay = allBooks
  if (booksToDisplay.length === 0) {
    return (
      <>
        <div>No books to display</div>
        <NewBook />
      </>
    )
  }
  const booksRow = (books) => books.map((a) => (
    <tr key={a.title}>
      <td>{a.title}</td>
      <td>{a.author.name}</td>
      <td>{a.published}</td>
    </tr>
  ))
  const baseGenreArray = ['all']
  return (
    <div>
      <h2>books</h2>
      {allBooks.length > 0 ?
        <div>
          <table>
            <tbody>
              <tr>
                <th>title</th>
                <th>author</th>
                <th>published</th>
              </tr>
              {!genreFilter || genreFilter === 'all' ?
                booksRow(booksToDisplay) :
                booksRow(booksToDisplay.filter(b => {
                  let containsGenre = false
                  b.genres.forEach(g => {
                    g === genreFilter ? containsGenre = true : null
                  })
                  if (containsGenre) {
                    return b
                  }
                  return
                }))}
            </tbody>
          </table>
          <div>
            <label>Select book genre </label>
            <select
              value={genreFilter}
              onChange={({ target }) => {
                setGenreFilter(target.value)
              }}>
              {genres ? baseGenreArray
                .concat(genres)
                .map(g => {
                  return (
                    <option key={g}>{g}</option>
                  )
                }
                ) : <option>all</option>
              }
            </select>
          </div>
        </div> :
        <div>No books to display. Add one below. </div>}
      <h2>Add a new book</h2>
      <NewBook />
    </div >
  )
}

export default Books
