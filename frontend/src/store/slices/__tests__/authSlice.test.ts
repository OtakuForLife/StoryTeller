import { expect, test } from "vitest"
import reducer, { AuthState, clearError } from "../authSlice"



test('should clear the current error message', () => {
  const previousState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: 'Error message',
  }

  expect(reducer(previousState, clearError())).toEqual(
    { user: null, isAuthenticated: false, isLoading: false, error: null },
  )
})