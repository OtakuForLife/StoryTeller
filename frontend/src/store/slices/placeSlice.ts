
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '../../lib/api'
import { Place } from '../../models'

interface PlaceState {
  places: Record<string, Place>
  isLoading: boolean
  error: string | null,
}

const initialState: PlaceState = {
  places: {},
  isLoading: false,
  error: null,
}

export const fetchPlaces = createAsyncThunk('place/fetchPlaces', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/places/')
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to fetch places')
  }
})

export const createPlace = createAsyncThunk('place/createPlace', async (placeData: Partial<Place>, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/places/', placeData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to create place')
  }
})

export const updatePlace = createAsyncThunk('place/updatePlace', async (placeData: { id: string; placeData: Partial<Place> }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/places/${placeData.id}/`, placeData.placeData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to update place')
  }
})

export const deletePlace = createAsyncThunk('place/deletePlace', async (placeId: string, { rejectWithValue }) => {
  try {
    await api.delete(`/api/places/${placeId}/`)
    return placeId
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to delete place')
  }
})

const placeSlice = createSlice({
  name: 'place',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPlaces.fulfilled, (state, action: PayloadAction<Place[]>) => {
        state.isLoading = false
        state.places = action.payload.reduce((acc, place) => {
          acc[place.id] = place
          return acc
        }, {} as Record<string, Place>)
        state.error = null
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createPlace.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPlace.fulfilled, (state, action: PayloadAction<Place>) => {
        state.isLoading = false
        state.places[action.payload.id] = action.payload
        state.error = null
      })
      .addCase(createPlace.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updatePlace.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePlace.fulfilled, (state, action: PayloadAction<Place>) => {
        state.isLoading = false
        state.places[action.payload.id] = action.payload
        state.error = null

      })
      .addCase(updatePlace.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deletePlace.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deletePlace.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        delete state.places[action.payload]
        state.error = null
      })
      .addCase(deletePlace.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = placeSlice.actions
export default placeSlice.reducer



