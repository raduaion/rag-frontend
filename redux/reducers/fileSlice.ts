import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { FileDetails } from "@/libs/FileDetails"
import PagedResult from "@/libs/PagedResult"
import { DEFAULT_NAV_PAGE, DEFAULT_NAV_SIZE_25 } from "@/libs/helpers"
 
const initialState: PagedResult<FileDetails> = {

  content: [],

  currentPage: DEFAULT_NAV_PAGE,

  pageSize: DEFAULT_NAV_SIZE_25,

  hasNext: false,

  totalElements: 0,
}

export const fileSlice = createSlice({

  name: "files",

  initialState,

  reducers: create => ({

    setOriginalFiles: create.reducer((_, action : PayloadAction<PagedResult<FileDetails>>) => action.payload),

    addFiles: create.reducer((state, action: PayloadAction<FileDetails[]>) => {
      state.content.push(...action.payload)
      state.totalElements = state.totalElements + 1
    }),

    updateFile: create.reducer((state,  { payload: file }: PayloadAction<FileDetails>) => {

      const elt = state.content.findIndex(({ name }) => name === file.name)
      if (elt > -1) {
        state.content[elt] = file
      }
    }),

    removeFile: create.reducer((state, action: PayloadAction<string>) => {
      state.content = state.content.filter(item => item.name !== action.payload)
    }),

    resetFilesData: () => initialState
  }),

  selectors: {
    selectByName: (state, name: string) => state.content.filter(item => item.name === name)
  }
})

export const { setOriginalFiles, addFiles, removeFile, updateFile, resetFilesData } = fileSlice.actions

export const { selectByName } = fileSlice.selectors
