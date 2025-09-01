import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import Conversation from "@/libs/Conversation"
import { UserRole } from "@/libs/UserRole"
import Message from "@/libs/Message"
import { IndexDetails } from "@/libs/IndexDetails"
import { MessageStatusEnum } from "@/libs/MessageStatusEnum"

const initialState: Conversation [] = []

export interface UserQuestion {
  convId: string
  content: string
  collections?: IndexDetails[]
}

export interface QuestionAnswer {
  convId: string
  content: string
  status: MessageStatusEnum
}

export interface UpdateConversationId {
  oldId: string
  newId: string
}

export const conversationSlice = createSlice({

  name: "conversations",

  initialState,

  reducers: create => ({

    setOriginalConversations: create.reducer((state, { payload: conversations }: PayloadAction<Conversation[]>) => {

      conversations.sort((c1, c2) => (c2.updatedAt || 0) - (c1.updatedAt || 0))
      state.splice(0, state.length, ...conversations)
    }),

    addConversations: create.reducer((state, action: PayloadAction<Conversation[]>) => {
      state.unshift(...action.payload)
    }),

    updateConversation: create.reducer((state, { payload: conversaton }: PayloadAction<Conversation>) => {
      const index = state.findIndex(({ id }) => id === conversaton.id)
      if (index > -1) {
        state[index] = conversaton
      }
    }),

    addUserQuestion: create.reducer((state, { payload: { content, convId, collections }}: PayloadAction<UserQuestion>) => {

      const timestamp = Math.round(Date.now() / 1000) - 5,
      hist: Message = { content, rephrased: content, role: UserRole.USER, timestamp },
      index = state.findIndex(({ id }) => id === convId)

      if (index > -1) {
        state[index].history?.push(hist)
        state[index].updatedAt = timestamp
      }
      else {

        // New message in new conversation
        const data: Conversation = {
          id: convId,
          title: content,
          history: [ hist ],
          userId: "",
          updatedAt: timestamp
        }

        if (convId.startsWith("new_") && collections?.length) {

          data.collections = collections.map(item => item.id)
          data.collectionData = collections

          const pluralStr = collections.length > 1 ? "s" : "",
          content = `Conversation started with ${collections.length} collection${pluralStr}: ${
            collections.map(item => item.name).join(', ')}`

          data.history.unshift(
            { role: UserRole.SYSTEM, content, rephrased: '', timestamp }
          )
        }

        state.unshift(data)
      }
    }),

    updateDefaultId: create.reducer((state, { payload: { oldId, newId }}: PayloadAction<UpdateConversationId>) => {

      const index = state.findIndex(({ id }) => id === oldId)
      if (index > -1) {
        state[index].id = newId
        state[index].history.push({
          role: UserRole.ASSISTANT,
          status: MessageStatusEnum.STARTED,
          timestamp: Math.round(Date.now() / 1000),
        })
      }
    }),

    setLastAnswer: create.reducer((state, { payload: { convId, content, status }}: PayloadAction<QuestionAnswer>) => {

      const trimedContent = content.trim(),
      conv = state.find(({ id }) => id === convId)
      if (conv) {

        const history = conv.history,
        timestamp = Math.round(Date.now() / 1000) - 5
        let lastMessage = history && history.length ? history[history.length - 1] : null

        conv.updatedAt = timestamp

        if (lastMessage?.role === UserRole.ASSISTANT) {
          lastMessage.content = trimedContent
          lastMessage.status = status
          history[history.length - 1] = lastMessage
        }
        else {
          lastMessage = {
            role: UserRole.ASSISTANT,
            content: trimedContent,
            rephrased: trimedContent,
            timestamp,
            status,
          }
          history.push(lastMessage)
        }
      }
    }),

    removeConversation: create.reducer((state, action: PayloadAction<string>) =>
      state.filter(item => item.id !== action.payload)),

    resetConversationsData: () => initialState
  }),

  selectors: {
    selectByUserId: (state, userId: string) => state.filter(item => item.userId === userId),
  }
})

export const { setOriginalConversations, addConversations,
  addUserQuestion, setLastAnswer, updateConversation, updateDefaultId,
  removeConversation, resetConversationsData } = conversationSlice.actions

export const { selectByUserId } = conversationSlice.selectors
