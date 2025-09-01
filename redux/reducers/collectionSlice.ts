import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IndexDetails } from "@/libs/IndexDetails"
import { DEFAULT_NAV_PAGE, DEFAULT_NAV_SIZE } from "@/libs/helpers"
import CollectionPagedResult from "@/libs/CollectionPagedResult"
import { FileDetails } from "@/libs/FileDetails"

const initialState: CollectionPagedResult<IndexDetails> = {

  content: [],

  currentPage: DEFAULT_NAV_PAGE,

  pageSize: DEFAULT_NAV_SIZE,

  hasNext: false,

  totalElements: 0,

  files: [],
}

export const collectionSlice = createSlice({

  name: "collections",

  initialState,

  reducers: create => ({

    setCollections: create.reducer((_, action : PayloadAction<CollectionPagedResult<IndexDetails>>) => action.payload),

    addCollections: create.reducer((state, { payload: items }: PayloadAction<IndexDetails[]>) => {
      state.content.push(...items)
      state.totalElements = state.totalElements + items.length
    }),

    addCollection: create.reducer((state, { payload: index }: PayloadAction<IndexDetails>) => {
      state.content.push(index)
      state.totalElements = state.totalElements + 1
    }),

    updateCollection: create.reducer((state, { payload: index }: PayloadAction<IndexDetails>) => {

      const elt = state.content.findIndex(({ id }) => id === index.id)
      if (elt > -1) {
        state.content[elt] = index
      }
    }),

    removeCollection: create.reducer((state, { payload: indexId }: PayloadAction<string>) => {
      state.content = state.content.filter(item => item.id !== indexId)
    }),

    addFileForCollections: create.reducer((state, { payload: files }: PayloadAction<FileDetails[]>) => {
      for (const file of files) {
        if (state.files.findIndex(item => item.name === file.name) === -1) {
          state.files.push(file)
        }
      }
    }),

    resetCollections: () => initialState
  }),
})

export const { setCollections, addCollections, addCollection, updateCollection, removeCollection,
  resetCollections, addFileForCollections } = collectionSlice.actions
