import { combineSlices } from '@reduxjs/toolkit'
import { accountSlice } from './accountSlice'
import { conversationSlice } from './conversationSlice'
import { fileSlice } from './fileSlice'
import { collectionSlice } from './collectionSlice'
import { notificationSlice } from './notificationSlice'
import { processSlice } from './processSlice'
import { publicCollectionSlice } from './publicCollectionSlice'
import { userSlice } from './userSlice'
import { publicFileSlice } from './publicFileSlice'
import { recentQuestionSlice } from './recentQuestionSlice'

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const reducer = combineSlices(
  fileSlice,
  collectionSlice,
  notificationSlice,
  processSlice,
  accountSlice,
  userSlice,
  conversationSlice,
  publicCollectionSlice,
  publicFileSlice,
  recentQuestionSlice,
)

export default reducer
