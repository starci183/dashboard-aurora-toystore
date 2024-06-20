export enum CurentPageKey {
    Users = "users",
    Toys = "Toys",
    Orders = "Orders",
    Analytics = "Analytics"
} 

import { createSlice, configureStore } from '@reduxjs/toolkit'

interface SidebarSliceState {
  value: CurentPageKey
}

const initialState: SidebarSliceState = {
  value: CurentPageKey.Analytics
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setCurretnPageKey: (state, action) => {
      state.value = action.payload
    },
  }
})

export const { setCurretnPageKey } = sidebarSlice.actions
export const sidebarReducer = sidebarSlice.reducer