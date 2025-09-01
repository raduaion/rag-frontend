import User from "@/libs/User"
import UserAccount from "@/libs/UserAccount"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: UserAccount = {}

export const accountSlice = createSlice({

	name: 'account',

	initialState,

	reducers: create => ({

    setAuthenticated: create.reducer((state, { payload }: PayloadAction<boolean | undefined>) => {
      state.authenticated = payload
		}),

    setUserAccount: create.reducer((state, { payload }: PayloadAction<User | null | undefined>) => {
      state.userData = payload
		}),

    setApiAccessible: create.reducer((state, { payload }: PayloadAction<boolean>) => {
      state.apiAccessible = payload
    }),

    initUserSession: create.reducer((state, { payload: { authenticated, userData, lastConnection }}: PayloadAction<UserAccount>) => {
      state.authenticated = authenticated
      state.userData = userData
      state.lastConnection = lastConnection
		}),

    handleFetchStatusCode: create.reducer((state, { payload: statusCode }: PayloadAction<number>) => {
      state.authenticated = !(statusCode === 401 || (statusCode >= 300 && statusCode < 400))
    }),

    resetUserAccount: () => initialState
  }),

  selectors: {
    isAuthenticated: state => state.authenticated
  }
})

export const { initUserSession, setAuthenticated, setUserAccount, setApiAccessible, resetUserAccount, handleFetchStatusCode } = accountSlice.actions

export const { isAuthenticated } = accountSlice.selectors
