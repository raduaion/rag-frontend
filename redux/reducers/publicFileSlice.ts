import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { FileDetails } from "@/libs/FileDetails"

const initialState: FileDetails [] = []

export const publicFileSlice = createSlice({

  name: "publicFiles",

  initialState,

  reducers: create => ({

    addOrUpdateFiles: create.reducer((state, { payload: files }: PayloadAction<FileDetails[]>) => {
      files.forEach(file => {
        const index = state.findIndex(({ name }) => name === file.name)
        if (index > -1) {
          state[index] = file
        }
        else {
          state.push(file)
        }
      })
    }),

    removeFile: create.reducer((state, action: PayloadAction<string>) =>
      state.filter(item => item.name !== action.payload)),

    resetPublicFileData: () => initialState
  }),
})

export const { addOrUpdateFiles, removeFile, resetPublicFileData } = publicFileSlice.actions
