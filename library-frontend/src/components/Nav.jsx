import { Link } from 'react-router'
import { setToken } from '../reducers/tokenSlice'
import { useSelector, useDispatch } from 'react-redux'

const Nav = () => {
  const page = useSelector(state => state.page)
  const dispatch = useDispatch()

  function handleLogout(event) {
    event.preventDefault()
    dispatch(setToken(''))
    localStorage.clear()
  }

  const navItemStyle = {
    margin: "2px",
  }

  return (
    <nav style={{ background: "lightblue" }}>
      {page !== 'index' ? <Link style={navItemStyle} to="/">index</Link> : null}
      {page !== 'authors' ? <Link style={navItemStyle} to="/authors">authors</Link> : null}
      {page !== 'books' ? <Link style={navItemStyle} to="/books">books</Link> : null}
      {page !== 'recommend' ? <Link style={navItemStyle} to="/recommend">recommend</Link> : null}
      {page !== 'profile' ? <Link style={navItemStyle} to="/profile">profile</Link> : null}
      <button style={navItemStyle} onClick={handleLogout}>logout</button>
    </nav>

  )
}

export default Nav
