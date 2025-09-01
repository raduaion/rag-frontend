import Notification from "@/libs/Notification"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: Notification [] = []

export const notificationSlice = createSlice({

  name: 'notifications',

  initialState,

  reducers: create => ({

    setNotifications: create.reducer((state, action: PayloadAction<Notification[]>) => {
      state.splice(0, state.length, ...action.payload)
    }),

    addNotifications: create.reducer((state, action: PayloadAction<Notification[]>) => {
      state.push(...action.payload)
    }),

    markAsread: create.reducer((state, action: PayloadAction<string>) => {

      const item = state.find(elt => elt.id === action.payload)
      if (item) {
        item.read = true
      }
    }),

    markAsUnread: create.reducer((state, action: PayloadAction<string>) => {

      const item = state.find(elt => elt.id === action.payload)
      if (item) {
        item.read = false
      }
    }),

    removeNotification: create.reducer((state, action: PayloadAction<string>) => 
      state.filter(item => item.id !== action.payload))
  }),
  
  selectors: {
    selectById: (state, id: string) => state.filter(item => item.id === id),
  }
})

export const { setNotifications, addNotifications, markAsread, markAsUnread } = notificationSlice.actions

export const { selectById } = notificationSlice.selectors
