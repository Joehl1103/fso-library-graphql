import { useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import LoginForm from "./components/LoginForm.jsx"
import Index from "./components/Index.jsx";
import Nav from "./components/Nav.jsx";
import Recommend from "./components/Recommend.jsx";
import Profile from "./components/Profile.jsx";
import { Routes, Route } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { setToken } from './reducers/tokenSlice.js'
import Notification from "./components/Notification.jsx";
import { setMe } from "./reducers/meSlice.js";
import { ME, BOOK_ADDED, GET_ALL_BOOKS } from "./queries.js";
import { updateCache } from "./utils/updateCache.js";

const App = () => {
  const token = useSelector(state => state.token)
  const dispatch = useDispatch()
  const error = useSelector(state => state.error)
  const page = useSelector(state => state.page)

  const { data: meData } = useQuery(ME)

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log('subScription data', data)
      const addedBook = data.data.bookAdded
      window.alert(`A new books was just added: ${addedBook.title} by ${addedBook.author.name}`)
      updateCache(client.cache, { query: GET_ALL_BOOKS }, addedBook)
    }
  })

  useEffect(() => {
    const loggedinUser = JSON.parse(localStorage.getItem('loggedinUser'))
    if (loggedinUser) {
      dispatch(setToken(loggedinUser.token))
    }
  }, [dispatch])

  useEffect(() => {
    if (meData) {
      dispatch(setMe(meData.me))
    }
  }, [dispatch, meData])

  const errorNotification = error ? <Notification error={error} /> : null

  if (!token || token.length === 0) {

    return (
      <>
        {errorNotification}
        <LoginForm />
      </>
    )
  }

  return (
    <div>
      {errorNotification}
      {page !== 'index' ? <Nav /> : null}
      <div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
