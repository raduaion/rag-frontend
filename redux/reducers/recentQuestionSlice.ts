import RecentQuestion from "@/libs/RecentQuestion"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: RecentQuestion [] = []

export const recentQuestionSlice = createSlice({

  name: "recentQuestions",

  initialState,

  reducers: create => ({

    addQuestion: create.reducer((state, { payload: question }: PayloadAction<RecentQuestion>) => {
      state.unshift(question)
    }),

    deleteQuestion: create.reducer((state, action: PayloadAction<string>) =>
      state.filter(item => item.id !== action.payload)),

    resetRecentQuestionData: () => initialState
  }),
})

export const { addQuestion, deleteQuestion, resetRecentQuestionData } = recentQuestionSlice.actions
