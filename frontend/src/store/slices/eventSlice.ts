import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '../../lib/api'
import { Event } from '../../models'

interface EventState {
  events: Record<string, Event>
  isLoading: boolean
  error: string | null,
}

const initialState: EventState = {
  events: {},
  isLoading: false,
  error: null,
}

export const fetchEvents = createAsyncThunk('event/fetchEvents', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/events/')
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to fetch events')
  }
})

export const createEvent = createAsyncThunk('event/createEvent', async (eventData: Partial<Event>, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/events/', eventData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to create event')
  }
})

export const updateEvent = createAsyncThunk('event/updateEvent', async (eventData: { id: string; eventData: Partial<Event> }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/events/${eventData.id}/`, eventData.eventData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to update event')
  }
})

export const deleteEvent = createAsyncThunk('event/deleteEvent', async (eventId: string, { rejectWithValue }) => {
  try {
    await api.delete(`/api/events/${eventId}/`)
    return eventId
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to delete event')
  }
})

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.isLoading = false
        state.events = action.payload.reduce((acc, event) => {
          acc[event.id] = event
          return acc
        }, {} as Record<string, Event>)
        state.error = null
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoading = false
        state.events[action.payload.id] = action.payload
        state.error = null
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoading = false
        state.events[action.payload.id] = action.payload
        state.error = null
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        delete state.events[action.payload]
        state.error = null
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = eventSlice.actions
export default eventSlice.reducer
