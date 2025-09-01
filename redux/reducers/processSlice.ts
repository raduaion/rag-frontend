import StoreProcess from "@/libs/StoreProcess"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: Record<string, StoreProcess> = {}

export interface ActionItem {
  name: string
  success: boolean
  error: string | null
}

export const processSlice = createSlice({

	name: 'process',

	initialState,

  reducers: create => ({

    startProcess: create.reducer((state, action: PayloadAction<string>) => {

      const data: StoreProcess = {
        running: true,
        success: false,
        error: null,
      }

			state[action.payload] = data
		}),

    stopProcess: create.reducer((state, action: PayloadAction<ActionItem>) => {

      const data: StoreProcess = {
        running: false,
        success: action.payload.success,
        error: action.payload.error,
      }

			state[action.payload.name] = data
		}),

    resetProcess: create.reducer((state, action: PayloadAction<string>) => {

      const data: StoreProcess = {
        running: false,
        success: false,
        error: null,
      }

			state[action.payload] = data
		}),
  }),

  selectors: {
    selectByName: (state, name: string) => state[name]
  }
})

export const { startProcess, stopProcess, resetProcess } = processSlice.actions

export const { selectByName } = processSlice.selectors
