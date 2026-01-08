import { configureStore } from '@reduxjs/toolkit'
import pageReducer from './reducers/pageSlice.js'
import tokenReducer from './reducers/tokenSlice.js'
import errorReducer from './reducers/errorSlice.js'
import meReducer from './reducers/meSlice.js'

export default configureStore({
  reducer: {
    page: pageReducer,
    token: tokenReducer,
    error: errorReducer,
    me: meReducer
  }
})
