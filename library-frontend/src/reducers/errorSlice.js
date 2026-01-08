import { createSlice } from '@reduxjs/toolkit'

export const errorSlice = createSlice({
  name: 'error',
  initialState: '',
  reducers: {
    setError: (state, actions) => actions.payload
  }
})

export const { setError } = errorSlice.actions

export function setErrorAndTimeout(errorObject) {
  console.log('returning setErrorAndTimeoutThunk', errorObject)
  return async function setErrorAndTimeoutThunk(dispatch) {
    dispatch(setError(errorObject.message))
    setTimeout(() => {
      dispatch(setError(null))
    }, 5000)
  }
}

export default errorSlice.reducer

