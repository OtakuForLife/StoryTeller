import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '../../lib/api'
import { Race } from '../../models'

interface RaceState {
  races: Record<string, Race>
  isLoading: boolean
  error: string | null,
}

const initialState: RaceState = {
  races: {},
  isLoading: false,
  error: null,
}

export const fetchRaces = createAsyncThunk('race/fetchRaces', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/races/')
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to fetch races')
  }
})

export const createRace = createAsyncThunk('race/createRace', async (raceData: Partial<Race>, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/races/', raceData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to create race')
  }
})

export const updateRace = createAsyncThunk('race/updateRace', async (raceData: { id: string; raceData: Partial<Race> }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/races/${raceData.id}/`, raceData.raceData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to update race')
  }
})

export const deleteRace = createAsyncThunk('race/deleteRace', async (raceId: string, { rejectWithValue }) => {
  try {
    await api.delete(`/api/races/${raceId}/`)
    return raceId
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to delete race')
  }
})

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRaces.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRaces.fulfilled, (state, action: PayloadAction<Race[]>) => {
        state.isLoading = false
        state.races = action.payload.reduce((acc, race) => {
          acc[race.id] = race
          return acc
        }, {} as Record<string, Race>)
        state.error = null
      })
      .addCase(fetchRaces.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createRace.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createRace.fulfilled, (state, action: PayloadAction<Race>) => {
        state.isLoading = false
        state.races[action.payload.id] = action.payload
        state.error = null
      })
      .addCase(createRace.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateRace.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateRace.fulfilled, (state, action: PayloadAction<Race>) => {
        state.isLoading = false
        state.races[action.payload.id] = action.payload
        state.error = null
      })
      .addCase(updateRace.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteRace.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteRace.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        delete state.races[action.payload]
        state.error = null
      })
      .addCase(deleteRace.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = raceSlice.actions
export default raceSlice.reducer
