import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Document {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  tags: string[]
}

interface DocumentsState {
  documents: Document[]
  selectedDocument: string | null
}

const initialState: DocumentsState = {
  documents: [
    {
      id: "doc1",
      title: "Study Notes",
      content: "Content for study notes",
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000,
      tags: ["academic", "notes"],
    },
    {
      id: "doc2",
      title: "Project Plan",
      content: "Content for project plan",
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 86400000,
      tags: ["work", "project"],
    },
  ],
  selectedDocument: null,
}

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.push(action.payload)
    },
    updateDocument: (state, action: PayloadAction<Document>) => {
      const index = state.documents.findIndex((doc) => doc.id === action.payload.id)
      if (index !== -1) {
        state.documents[index] = {
          ...action.payload,
          updatedAt: Date.now(),
        }
      }
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter((doc) => doc.id !== action.payload)
      if (state.selectedDocument === action.payload) {
        state.selectedDocument = null
      }
    },
    setSelectedDocument: (state, action: PayloadAction<string | null>) => {
      state.selectedDocument = action.payload
    },
  },
})

export const { addDocument, updateDocument, deleteDocument, setSelectedDocument } = documentsSlice.actions

export default documentsSlice.reducer
