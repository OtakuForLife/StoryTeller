import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/lib/api'
import { Character } from '@/models'

interface CharacterState {
  characters: Record<string, Character>
  isLoading: boolean
  error: string | null,
}

const initialState: CharacterState = {
  characters: {},
  isLoading: false,
  error: null,
}

export const fetchCharacters = createAsyncThunk('character/fetchCharacters', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/characters/')
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to fetch characters')
  }
})

export const createCharacter = createAsyncThunk('character/createCharacter', async (characterData: Partial<Character>, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/characters/', characterData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to create character')
  }
})

export const updateCharacter = createAsyncThunk('character/updateCharacter', async (characterData: { id: string; characterData: Partial<Character> }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/characters/${characterData.id}/`, characterData.characterData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to update character')
  }
})

export const deleteCharacter = createAsyncThunk('character/deleteCharacter', async (characterId: string, { rejectWithValue }) => {
  try {
    await api.delete(`/api/characters/${characterId}/`)
    return characterId
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to delete character')
  }
})

const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCharacters.fulfilled, (state, action: PayloadAction<Character[]>) => {
        state.isLoading = false
        state.characters = action.payload.reduce((acc, character) => {
          acc[character.id] = character
          return acc
        }, {} as Record<string, Character>)
        state.error = null
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createCharacter.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createCharacter.fulfilled, (state, action: PayloadAction<Character>) => {
        state.isLoading = false
        state.characters[action.payload.id] = action.payload
        state.error = null
      })
      .addCase(createCharacter.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(updateCharacter.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCharacter.fulfilled, (state, action: PayloadAction<Character>) => {
        state.isLoading = false
        state.characters[action.payload.id] = action.payload
        state.error = null

      })
      .addCase(updateCharacter.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteCharacter.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteCharacter.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        delete state.characters[action.payload]
        state.error = null
      })
      .addCase(deleteCharacter.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = characterSlice.actions
export default characterSlice.reducer