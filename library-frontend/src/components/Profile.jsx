import { ME, EDIT_USER, GET_ALL_BOOKS } from "../queries"
import { useQuery, useMutation } from '@apollo/client/react'
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setPage } from "../reducers/pageSlice"
import { setErrorAndTimeout } from "../reducers/errorSlice"

const Profile = () => {
  const dispatch = useDispatch()
  const [userEdit, setUserEdit] = useState(false)
  const [genreEdit, setGenreEdit] = useState(false)
  const [editedUsername, setEditedUsername] = useState('')
  const [editedGenre, setEditedGenre] = useState('')
  const [editUser] = useMutation(EDIT_USER, {
    refetchQueries: [ME],
    onCompleted: () => {
      console.warn('SUCCESS')
    },
    onError: (error) => {
      console.error(error)
      dispatch(setErrorAndTimeout(error))
    }
  })

  useEffect(() => {
    dispatch(setPage('profile'))
  })
  const meResult = useQuery(ME)
  const bookResult = useQuery(GET_ALL_BOOKS)
  if (!meResult.data || !bookResult.data) {
    return "No data"
  }
  const { username, favoriteGenre } = meResult.data.me
  const genreSet = new Set()
  bookResult.data.allBooks.forEach(b => b.genres.forEach(g => genreSet.add(g)))
  const genreArray = [...genreSet]

  function handleSubmit(event) {
    event.preventDefault()
    let variables = {}
    const unLen = editedUsername.length
    const genLen = editedGenre.length
    if (unLen > 0 && genLen > 0) {
      variables = {
        username: editedUsername,
        favoriteGenre: editedGenre,
        changeType: 'both'
      }
      setTimeout(() => {
        setUserEdit(!userEdit)
        setGenreEdit(!genreEdit)
      }, 500)
    } else if (unLen > 0 && genLen === 0) {
      variables = {
        username: editedUsername,
        changeType: 'un'
      }
      setTimeout(() => {
        setUserEdit(!userEdit)
      }, 500)
    } else if (unLen === 0 && genLen > 0) {
      variables = {
        favoriteGenre: editedGenre,
        changeType: 'gen'
      }
      setTimeout(() => {
        setGenreEdit(!genreEdit)
      }, 500)
    } else {
      throw new Error('nothing worked')
    }
    editUser({ variables: variables })
  }

  return (
    <div>
      <div>
        Username:{" "}
        {
          userEdit
            ? <input value={editedUsername} onChange={({ target }) => setEditedUsername(target.value)} />
            : username
        }
        {
          userEdit
            ? <button onClick={() => {
              setUserEdit(!userEdit)
              setEditedUsername('')
            }}>❌</button>
            : <button onClick={() => setUserEdit(!userEdit)}>edit</button>
        }
      </div>
      <div>
        Favorite genre:{" "}
        {
          genreEdit
            ? <select value={editedGenre} onChange={({ target }) => {
              setEditedGenre(target.value)
            }
            }>
              <option></option>
              {genreArray.map(g =>
                <option key={g} value={g}>{g}</option>
              )}
            </select>
            : favoriteGenre
        }
        {
          genreEdit
            ? <button
              onClick={() => {
                setGenreEdit(!genreEdit)
                setEditedGenre('')
              }}>❌</button>
            : <button onClick={() => setGenreEdit(!genreEdit)}> {favoriteGenre ? "edit" : "add"}</button>
        }
      </div>
      {userEdit || genreEdit ? <button onClick={handleSubmit}>Update</button> : null}
    </div>
  )
}

export default Profile
