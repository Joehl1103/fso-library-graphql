import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { EDIT_AUTHOR, GET_ALL_AUTHORS } from '../queries'

const BirthYearForm = () => {
  const [year, setYear] = useState('')
  const [name, setName] = useState('')
  const authorResult = useQuery(GET_ALL_AUTHORS)
  const [editBirthYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: GET_ALL_AUTHORS }]
  })

  if (authorResult.loading || !authorResult.data) {
    return null
  }

  const authors = authorResult.data.allAuthors

  async function handleBirthYearChange(event) {
    event.preventDefault()
    let result = undefined
    try {
      result = await editBirthYear({ variables: { name: name, setBornTo: Number(year) } })
    } catch (e) {
      console.warn(`Error: ${e.message}`)
    }
    console.log(`successfully edited ${name}'s birth year`, result.data)
  }

  return (
    <div>
      <form onSubmit={handleBirthYearChange}>
        <label>Author name:</label>
        <select value={name} onChange={({ target }) => setName(target.value)}>
          {authors.map(a =>
            <option key={a.name} value={a.name}>{a.name}</option>
          )}
        </select>
        <br />
        <label>new birth year:</label>
        <input
          value={year}
          onChange={({ target }) => setYear(target.value)} />
        <br />
        <button type='submit'>Change</button>
      </form>
    </div >
  )
}

export default BirthYearForm
