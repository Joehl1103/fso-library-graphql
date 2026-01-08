import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPage } from '../reducers/pageSlice'
import { useQuery } from '@apollo/client/react'
import { GET_ALL_BOOKS } from '../queries'
import { Link } from 'react-router'

const Recommend = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('recommend'))
  })
  const me = useSelector(state => state.me)
  const { favoriteGenre } = me
  const { data, loading, error } = useQuery(GET_ALL_BOOKS, {
    variables: { genre: favoriteGenre }
  })
  if (error) {
    if (error.message === 'genre does not exist') {
      return (
        <div>Genre does not exist. I cannot make any recommendations. Visit your <Link to="/profile">profile</Link> to change your favorite genre.</div>
      )
    }
    return <div style={{ color: "red" }}>Error: ${error.message}</div>
  }
  if (loading) {
    return <>...loading</>
  }
  if (!data) {
    return <div>No books to display...</div>
  }
  const recommendedBooks = data.allBooks

  return (
    <>
      <h2>Your favorite Genre: <i>{favoriteGenre}</i></h2>
      {recommendedBooks.length > 0
        ? <div>
          <h3>Titles recommended based on your favorite genre:</h3>
          <ul>
            {recommendedBooks.map(b => {
              return (
                <li key={b.id}>{b.title} by {b.author.name}</li>
              )
            })
            }
          </ul>
          <div>Edit favorite genre <Link to="/profile">in your profile.</Link></div>
        </div>
        : <p>No titles correspond to your favority genre. You can change your favorite genre <Link to="/profile">here</Link></p>
      }

    </>
  )
}

export default Recommend
