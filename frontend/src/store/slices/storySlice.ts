import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface Character {
  id: number
  name: string
  description: string
  story: number
  created_at: string
  updated_at: string
}

interface Chapter {
  id: number
  title: string
  content: string
  story: number
  order: number
  created_at: string
  updated_at: string
}

export interface Story {
  id: number
  title: string
  description: string
  author: {
    id: number
    username: string
    email: string
  }
  characters: Character[]
  chapters: Chapter[]
  created_at: string
  updated_at: string
}

interface StoryState {
  stories: Story[]
  currentStory: Story | null
  isLoading: boolean
  error: string | null
}

const initialState: StoryState = {
  stories: [],
  currentStory: null,
  isLoading: false,
  error: null,
}

export const fetchStories = createAsyncThunk('stories/fetchStories', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth: { token: string } }
    const config = {
      headers: {
        Authorization: `Token ${state.auth.token}`,
      },
    }
    const response = await axios.get('/api/stories/', config)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to fetch stories')
  }
})

export const fetchStory = createAsyncThunk(
  'stories/fetchStory',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const config = {
        headers: {
          Authorization: `Token ${state.auth.token}`,
        },
      }
      const response = await axios.get(`/api/stories/${id}/`, config)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch story')
    }
  }
)

export const createStory = createAsyncThunk(
  'stories/createStory',
  async (storyData: { title: string; description: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const config = {
        headers: {
          Authorization: `Token ${state.auth.token}`,
        },
      }
      const response = await axios.post('/api/stories/', storyData, config)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create story')
    }
  }
)

export const updateStory = createAsyncThunk(
  'stories/updateStory',
  async (
    { id, storyData }: { id: number; storyData: { title: string; description: string } },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { auth: { token: string } }
      const config = {
        headers: {
          Authorization: `Token ${state.auth.token}`,
        },
      }
      const response = await axios.put(`/api/stories/${id}/`, storyData, config)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update story')
    }
  }
)

export const deleteStory = createAsyncThunk(
  'stories/deleteStory',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string } }
      const config = {
        headers: {
          Authorization: `Token ${state.auth.token}`,
        },
      }
      await axios.delete(`/api/stories/${id}/`, config)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete story')
    }
  }
)

const storySlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    clearCurrentStory: (state) => {
      state.currentStory = null
    },
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
        state.stories = action.payload
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchStory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStory.fulfilled, (state, action: PayloadAction<Story>) => {
        state.isLoading = false
        state.currentStory = action.payload
      })
      .addCase(fetchStory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createStory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createStory.fulfilled, (state, action: PayloadAction<Story>) => {
        state.isLoading = false
        state.stories.push(action.payload)
      })
      .addCase(createStory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateStory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateStory.fulfilled, (state, action: PayloadAction<Story>) => {
        state.isLoading = false
        const index = state.stories.findIndex((story) => story.id === action.payload.id)
        if (index !== -1) {
          state.stories[index] = action.payload
        }
        if (state.currentStory && state.currentStory.id === action.payload.id) {
          state.currentStory = action.payload
        }
      })
      .addCase(updateStory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteStory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteStory.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false
        state.stories = state.stories.filter((story) => story.id !== action.payload)
        if (state.currentStory && state.currentStory.id === action.payload) {
          state.currentStory = null
        }
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentStory, clearError } = storySlice.actions
export default storySlice.reducer
