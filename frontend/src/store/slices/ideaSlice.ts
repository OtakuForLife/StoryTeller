
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '../../lib/api'
import { Idea } from '../../models'

interface IdeaState {
  ideas: Record<string, Idea>
  isLoading: boolean
  error: string | null,
}

const initialState: IdeaState = {
  ideas: {},
  isLoading: false,
  error: null,
}

export const fetchIdeas = createAsyncThunk('idea/fetchIdeas', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/ideas/')
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to fetch ideas')
  }
})

export const createIdea = createAsyncThunk('idea/createIdea', async (ideaData: Partial<Idea>, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/ideas/', ideaData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to create idea')
  }
})

export const updateIdea = createAsyncThunk('idea/updateIdea', async (ideaData: { id: number; ideaData: Partial<Idea> }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/ideas/${ideaData.id}/`, ideaData.ideaData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to update idea')
  }
})

export const deleteIdea = createAsyncThunk('idea/deleteIdea', async (ideaId: number, { rejectWithValue }) => {
  try {
    await api.delete(`/api/ideas/${ideaId}/`)
    return ideaId
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to delete idea')
  }
})

const ideaSlice = createSlice({
  name: 'idea',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIdeas.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchIdeas.fulfilled, (state, action: PayloadAction<Idea[]>) => {
        state.isLoading = false
        state.ideas = action.payload.reduce((acc, idea) => {
          acc[idea.id] = idea
          return acc
        }, {} as Record<string, Idea>)
        state.error = null
      })
      .addCase(fetchIdeas.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createIdea.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createIdea.fulfilled, (state, action: PayloadAction<Idea>) => {
        state.isLoading = false
        state.ideas[action.payload.id] = action.payload
        state.error = null
      })
      .addCase(createIdea.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateIdea.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateIdea.fulfilled, (state, action: PayloadAction<Idea>) => {
        state.isLoading = false
        state.ideas[action.payload.id] = action.payload
        state.error = null

      })
      .addCase(updateIdea.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteIdea.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteIdea.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false
        delete state.ideas[action.payload]
        state.error = null
      })
      .addCase(deleteIdea.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = ideaSlice.actions
export default ideaSlice.reducer