import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Whiteboard {
  id: string
  title: string
  content: any // This would typically be a complex object representing the whiteboard state
  createdAt: number
  updatedAt: number
  tags: string[]
}

interface WhiteboardState {
  whiteboards: Whiteboard[]
  selectedWhiteboard: string | null
}

const initialState: WhiteboardState = {
  whiteboards: [
    {
      id: "wb1",
      title: "Brainstorming Session",
      content: {},
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
      tags: ["ideas", "project"],
    },
    {
      id: "wb2",
      title: "System Architecture",
      content: {},
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 86400000,
      tags: ["technical", "design"],
    },
  ],
  selectedWhiteboard: null,
}

const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    addWhiteboard: (state, action: PayloadAction<Whiteboard>) => {
      state.whiteboards.push(action.payload)
    },
    updateWhiteboard: (state, action: PayloadAction<Whiteboard>) => {
      const index = state.whiteboards.findIndex((wb) => wb.id === action.payload.id)
      if (index !== -1) {
        state.whiteboards[index] = {
          ...action.payload,
          updatedAt: Date.now(),
        }
      }
    },
    deleteWhiteboard: (state, action: PayloadAction<string>) => {
      state.whiteboards = state.whiteboards.filter((wb) => wb.id !== action.payload)
      if (state.selectedWhiteboard === action.payload) {
        state.selectedWhiteboard = null
      }
    },
    setSelectedWhiteboard: (state, action: PayloadAction<string | null>) => {
      state.selectedWhiteboard = action.payload
    },
  },
})

export const { addWhiteboard, updateWhiteboard, deleteWhiteboard, setSelectedWhiteboard } = whiteboardSlice.actions

export default whiteboardSlice.reducer
