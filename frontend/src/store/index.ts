import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import storyReducer from './slices/storySlice'
import ideaReducer from './slices/ideaSlice'
import characterReducer from './slices/characterSlice'
import placeReducer from './slices/placeSlice'
import itemReducer from './slices/itemSlice'
import eventReducer from './slices/eventSlice'
import themeReducer from './slices/themeSlice'
import raceReducer from './slices/raceSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  stories: storyReducer,
  ideas: ideaReducer,
  characters: characterReducer,
  places: placeReducer,
  items: itemReducer,
  events: eventReducer,
  theme: themeReducer,
  races: raceReducer,
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
