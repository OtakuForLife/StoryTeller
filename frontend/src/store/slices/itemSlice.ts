import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/lib/api'
import { Item } from '@/models'

interface ItemState {
  items: Record<string, Item>
  isLoading: boolean
  error: string | null,
}

const initialState: ItemState = {
  items: {},
  isLoading: false,
  error: null,
}

export const fetchItems = createAsyncThunk('item/fetchItems', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/items/')
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to fetch items')
  }
})

export const createItem = createAsyncThunk('item/createItem', async (itemData: Partial<Item>, { rejectWithValue }) => {
  try {
    const response = await api.post('/api/items/', itemData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to create item')
  }
})

export const updateItem = createAsyncThunk('item/updateItem', async ({ id, data }: { id: string, data: Partial<Item> }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/items/${id}/`, data)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to update item')
  }
})

export const deleteItem = createAsyncThunk('item/deleteItem', async (itemId: string, { rejectWithValue }) => {
  try {
    await api.delete(`/api/items/${itemId}/`)
    return itemId
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.detail || 'Failed to delete item')
  }
})

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch items
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.isLoading = false
        state.items = action.payload.reduce((acc, item) => {
          acc[item.id] = item
          return acc
        }, {} as Record<string, Item>)
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Create item
      .addCase(createItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createItem.fulfilled, (state, action: PayloadAction<Item>) => {
        state.isLoading = false
        state.items[action.payload.id] = action.payload
      })
      .addCase(createItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Update item
      .addCase(updateItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateItem.fulfilled, (state, action: PayloadAction<Item>) => {
        state.isLoading = false
        state.items[action.payload.id] = action.payload
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        delete state.items[action.payload]
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = itemSlice.actions
export default itemSlice.reducer
