import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setToken } from '../reducers/tokenSlice'
import { setErrorAndTimeout } from '../reducers/errorSlice'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const [login, { loading }] = useMutation(LOGIN, {
    onError: (e) => {
      dispatch(setErrorAndTimeout(e))
    }
  })

  async function handleLogin(event) {
    event.preventDefault()
    const result = await login({ variables: { username: username, password: password } })
    let token = null
    if (result) {
      token = result.data.login.value
    }
    if (token) {
      const loggedInUser = { username: username, token: token }
      localStorage.setItem("loggedinUser", JSON.stringify(loggedInUser))
      dispatch(setToken(token))
      return
    }
  }
  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>username</label>
          <input value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          <label>password</label>
          <input value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'logging in...' : 'login'}
        </button>
      </form>
      <div style={{ border: '1px solid black', display: 'inline-block', padding: '2px 5px', marginTop: '10px' }}>
        <h3>Demo credentials</h3>
        <p style={{ marginBottom: '5px' }}>username: test username</p>
        <p style={{ marginTop: '0' }}>password: secret</p>
      </div>
    </div>
  )
}

export default LoginForm
