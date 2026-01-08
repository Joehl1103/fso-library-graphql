import { useQuery } from '@apollo/client/react'
import { GET_ALL_AUTHORS } from '../queries'
import BirthYearForm from './BirthYearForm.jsx'
import { setPage } from '../reducers/pageSlice.js'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setErrorAndTimeout } from '../reducers/errorSlice.js'
import { Link } from 'react-router'

const Authors = () => {
  const { data, loading, error } = useQuery(GET_ALL_AUTHORS)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('authors'))
  }, [dispatch])

  useEffect(() => {
    if (error) {
      dispatch(setErrorAndTimeout(error))
    }
  }, [dispatch, error])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>...Error...</div>
  }

  if (!data) {
    return <div>No data to display</div>
  }
  const authors = data.allAuthors

  if (authors.length === 0) {
    return <>There are currently no books in the database. Add one by visiting <Link to='/books'>this page.</Link></>
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{!a.born ? "unknown" : a.born}</td>
              <td>{a.books.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set author birth year</h3>
      <BirthYearForm />
    </div>
  )
}

export default Authors
