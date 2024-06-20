export interface Account {
    accountId: string
    email: string
    password: string
    avatarUrl: string
    username: string
    name: string
    phoneNumber: string
    gender: boolean
    createdAt: Date
    updatedAt: Date
}

import { createSlice, configureStore } from '@reduxjs/toolkit'

interface AuthSliceState {
  value: Account | null
}

const initialState: AuthSliceState = {
  value: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.value = action.payload
    },
  }
})

export const { setAuth } = authSlice.actions
export const authReducer = authSlice.reducer