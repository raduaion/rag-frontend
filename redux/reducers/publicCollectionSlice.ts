import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IndexDetails } from "@/libs/IndexDetails"
import { DEFAULT_NAV_PAGE, DEFAULT_NAV_SIZE } from "@/libs/helpers"
import CollectionPagedResult from "@/libs/CollectionPagedResult"

const initialState: CollectionPagedResult<IndexDetails> = {

  content: [],

  currentPage: DEFAULT_NAV_PAGE,

  pageSize: DEFAULT_NAV_SIZE,

  hasNext: false,

  totalElements: 0,

  files: [],
}

export const publicCollectionSlice = createSlice({

  name: "publicCollections",

  initialState,

  reducers: create => ({

    setPublicCollections: create.reducer((_, action : PayloadAction<CollectionPagedResult<IndexDetails>>) => action.payload),

    resetPublicCollectionsData: () => initialState
  })
})

export const { setPublicCollections, resetPublicCollectionsData } = publicCollectionSlice.actions
