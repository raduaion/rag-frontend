import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserApproval } from "@/libs/UserApproval"

const initialState: UserApproval [] = []

export const userSlice = createSlice({

  name: "users",

  initialState,

  reducers: create => ({

    setOriginalUsers: create.reducer((state, { payload: approvals }: PayloadAction<UserApproval[]>) => {

      approvals.sort((a, b) => (b.createdOn || 0) - (a.createdOn || 0))
      state.splice(0, state.length, ...approvals)
    }),

    addUsers: create.reducer((state, action: PayloadAction<UserApproval[]>) => {
      state.push(...action.payload)
    }),

    addUser: create.reducer((state, action: PayloadAction<UserApproval>) => {
      state.push(action.payload)
    }),

    removeUser: create.reducer((state, action: PayloadAction<string>) =>
      state.filter(item => item.id !== action.payload)),

    resetUsersData: () => initialState
  }),

  selectors: {
    selectById: (state, id: string) => state.filter(item => item.id === id)
  }
})

export const { setOriginalUsers, addUser, addUsers, removeUser, resetUsersData } = userSlice.actions

export const { selectById } = userSlice.selectors
