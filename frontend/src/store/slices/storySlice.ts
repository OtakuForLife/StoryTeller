import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '../../lib/api'
import { Story } from '../../models'

interface DataState {
  stories: Record<string, Story>
  isLoading: boolean
  error: string | null,
}

const initialState: DataState = {
  stories: {},

  isLoading: false,
  error: null,
}

export const fetchStories = createAsyncThunk('story/fetchStories', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/stories/')
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to fetch stories')
  }
})

export const updateStory = createAsyncThunk('story/updateStory', async (storyData: { id: string; storyData: Partial<Story> }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/stories/${storyData.id}/`, storyData.storyData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to update story')
  }
})

export const createStory = createAsyncThunk('story/createStory', async (storyData: Partial<Story>, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/stories/', storyData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to create story')
  }
})

export const deleteStory = createAsyncThunk('story/deleteStory', async (storyId: string, { rejectWithValue }) => {
  try {
    await api.delete(`/api/stories/${storyId}/`)
    return storyId
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to delete story')
  }
})

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStories.fulfilled, (state, action: PayloadAction<Story[]>) => {
        state.isLoading = false
        state.stories = action.payload.reduce((acc, story) => {
          acc[story.id] = story
          return acc
        }, {} as Record<string, Story>)
        state.error = null
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateStory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateStory.fulfilled, (state, action: PayloadAction<Story>) => {
        state.isLoading = false
        state.stories[action.payload.id] = action.payload
        state.error = null
      })
      .addCase(updateStory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createStory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createStory.fulfilled, (state, action: PayloadAction<Story>) => {
        state.isLoading = false
        state.stories[action.payload.id] = action.payload
        state.error = null
      })
      .addCase(createStory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteStory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteStory.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        delete state.stories[action.payload]
        state.error = null
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = storySlice.actions
export default storySlice.reducer
