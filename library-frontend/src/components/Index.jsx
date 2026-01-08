import Nav from "./Nav"
import { useDispatch } from "react-redux"
import { setPage } from '../reducers/pageSlice.js'
import { useEffect } from 'react'

const Index = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setPage('index'))
  }, [])

  return (
    <>
      <h1>Welcome to my app!</h1>
      <p>Where would you like to go?</p>
      <Nav />
    </>
  )
}

export default Index
