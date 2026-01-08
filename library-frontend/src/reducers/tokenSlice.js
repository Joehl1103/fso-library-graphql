import { createSlice } from '@reduxjs/toolkit'

export const tokenSlice = createSlice({
  name: 'token',
  initialState: '',
  reducers: {
    setToken: (state, actions) => actions.payload
  }
})

export const { setToken } = tokenSlice.actions

export default tokenSlice.reducer
