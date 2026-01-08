import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { EDIT_AUTHOR, GET_ALL_AUTHORS } from '../queries'

const BirthYearForm = () => {
  const [year, setYear] = useState('')
  const [name, setName] = useState('')
  const authorResult = useQuery(GET_ALL_AUTHORS)
  const authors = authorResult.data.allAuthors
  const [editBirthYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: GET_ALL_AUTHORS }]
  })

  async function handleBirthYearChange(event) {
    event.preventDefault()
    typeof year === 'string' ? () => {
      const yearToString = Number(year)
      setYear(yearToString)
    } : null
    let result = undefined
    try {
      result = await editBirthYear({ variables: { name: name, setBornTo: year } })
    } catch (e) {
      console.warn(`Error: ${e.message}`)
    }
    console.log(`successfully edited ${name}'s birth year`, result.data)
  }

  const options = authors.map(a => ({ value: a.name, label: a.name }))
  return (
    <div>
      <form onSubmit={handleBirthYearChange}>
        <label>Author name:</label>
        <select value={name} onChange={({ target }) => setName(target.value)}>
          {authors.map(a =>
            <option key={a.name}>{a.name}</option>
          )}
        </select>
        <br />
        <label>new birth year:</label>
        <input
          value={year}
          onChange={({ target }) => setYear(Number(target.value))} />
        <br />
        <button type='submit'>Change</button>
      </form>
    </div >
  )
}

export default BirthYearForm
