import { createSlice } from '@reduxjs/toolkit'

export const pageSlice = createSlice({
  name: 'page',
  initialState: null,
  reducers: {
    setPage: (state, actions) => actions.payload
  }
})

export const { setPage } = pageSlice.actions


export default pageSlice.reducer
