import { createSlice } from '@reduxjs/toolkit'

const meSlice = createSlice({
  name: 'me',
  initialState: {},
  reducers: {
    setMe: (state, actions) => actions.payload
  }
})

export const { setMe } = meSlice.actions

export default meSlice.reducer
