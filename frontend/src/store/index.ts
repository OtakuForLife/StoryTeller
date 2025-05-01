import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import storyReducer from './slices/dataSlice'
import themeReducer from './slices/themeSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  stories: storyReducer,
  theme: themeReducer,
})

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}


export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
