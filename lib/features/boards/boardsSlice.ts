import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"

export interface Board {
  id: string
  name: string
  description?: string
  boardType: "flowchart" | "mindmap" | "wireframe" | "notes" | "diagram"
  createdAt: string
  updatedAt: string
  lastOpenedAt?: string
  thumbnail?: string
  tags?: string[]
  starred: boolean
  isArchived: boolean
}

interface BoardsState {
  boards: Board[]
  searchQuery: string
  sortBy: "name" | "updatedAt" | "createdAt" | "lastOpenedAt"
  sortDirection: "asc" | "desc"
  filterTags: string[]
  filterBoardType: string | null
  filterStarred: boolean
  filterArchived: boolean
}

// Create sample boards for the preview
const createSampleBoards = (): Board[] => {
  const now = new Date().toISOString()
  const yesterday = new Date(Date.now() - 86400000).toISOString()
  const lastWeek = new Date(Date.now() - 604800000).toISOString()

  return [
    {
      id: uuidv4(),
      name: "Product Roadmap",
      description: "Q3 2023 product roadmap and feature planning",
      boardType: "mindmap",
      createdAt: lastWeek,
      updatedAt: yesterday,
      lastOpenedAt: yesterday,
      tags: ["planning", "product", "roadmap"],
      starred: true,
      isArchived: false,
    },
    {
      id: uuidv4(),
      name: "Website Redesign",
      description: "Wireframes for the new marketing website",
      boardType: "wireframe",
      createdAt: lastWeek,
      updatedAt: now,
      lastOpenedAt: now,
      tags: ["design", "website", "marketing"],
      starred: false,
      isArchived: false,
    },
    {
      id: uuidv4(),
      name: "User Onboarding Flow",
      description: "Flowchart for the new user onboarding process",
      boardType: "flowchart",
      createdAt: yesterday,
      updatedAt: yesterday,
      lastOpenedAt: yesterday,
      tags: ["ux", "onboarding", "flow"],
      starred: true,
      isArchived: false,
    },
    {
      id: uuidv4(),
      name: "Team Retrospective",
      description: "Notes from our last sprint retrospective",
      boardType: "notes",
      createdAt: now,
      updatedAt: now,
      lastOpenedAt: now,
      tags: ["team", "retrospective", "agile"],
      starred: false,
      isArchived: false,
    },
    {
      id: uuidv4(),
      name: "System Architecture",
      description: "Diagram of our system architecture",
      boardType: "diagram",
      createdAt: lastWeek,
      updatedAt: lastWeek,
      lastOpenedAt: lastWeek,
      tags: ["architecture", "system", "technical"],
      starred: false,
      isArchived: false,
    },
    {
      id: uuidv4(),
      name: "Archived Project",
      description: "This is an archived project",
      boardType: "flowchart",
      createdAt: lastWeek,
      updatedAt: lastWeek,
      lastOpenedAt: lastWeek,
      tags: ["archived"],
      starred: false,
      isArchived: true,
    },
  ]
}

const initialState: BoardsState = {
  boards: createSampleBoards(),
  searchQuery: "",
  sortBy: "updatedAt",
  sortDirection: "desc",
  filterTags: [],
  filterBoardType: null,
  filterStarred: false,
  filterArchived: false,
}

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    addBoard: (
      state,
      action: PayloadAction<{
        name: string
        description?: string
        boardType: "flowchart" | "mindmap" | "wireframe" | "notes" | "diagram"
        tags?: string[]
      }>,
    ) => {
      const { name, description, boardType, tags } = action.payload
      const now = new Date().toISOString()

      state.boards.push({
        id: uuidv4(),
        name,
        description,
        boardType,
        createdAt: now,
        updatedAt: now,
        lastOpenedAt: now,
        tags,
        starred: false,
        isArchived: false,
      })
    },

    updateBoard: (
      state,
      action: PayloadAction<{
        id: string
        name?: string
        description?: string
        boardType?: "flowchart" | "mindmap" | "wireframe" | "notes" | "diagram"
        tags?: string[]
      }>,
    ) => {
      const { id, name, description, boardType, tags } = action.payload
      const board = state.boards.find((b) => b.id === id)

      if (board) {
        if (name !== undefined) board.name = name
        if (description !== undefined) board.description = description
        if (boardType !== undefined) board.boardType = boardType
        if (tags !== undefined) board.tags = tags
        board.updatedAt = new Date().toISOString()
      }
    },

    deleteBoard: (state, action: PayloadAction<{ id: string }>) => {
      state.boards = state.boards.filter((board) => board.id !== action.payload.id)
    },

    toggleStarBoard: (state, action: PayloadAction<{ id: string }>) => {
      const board = state.boards.find((b) => b.id === action.payload.id)

      if (board) {
        board.starred = !board.starred
      }
    },

    archiveBoard: (state, action: PayloadAction<{ id: string }>) => {
      const board = state.boards.find((b) => b.id === action.payload.id)

      if (board) {
        board.isArchived = true
      }
    },

    restoreBoard: (state, action: PayloadAction<{ id: string }>) => {
      const board = state.boards.find((b) => b.id === action.payload.id)

      if (board) {
        board.isArchived = false
      }
    },

    duplicateBoard: (state, action: PayloadAction<{ id: string }>) => {
      const board = state.boards.find((b) => b.id === action.payload.id)

      if (board) {
        const now = new Date().toISOString()

        state.boards.push({
          ...board,
          id: uuidv4(),
          name: `${board.name} (Copy)`,
          createdAt: now,
          updatedAt: now,
          lastOpenedAt: now,
          starred: false,
        })
      }
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },

    setSortBy: (
      state,
      action: PayloadAction<{
        sortBy: "name" | "updatedAt" | "createdAt" | "lastOpenedAt"
        sortDirection: "asc" | "desc"
      }>,
    ) => {
      state.sortBy = action.payload.sortBy
      state.sortDirection = action.payload.sortDirection
    },

    setFilterTags: (state, action: PayloadAction<string[]>) => {
      state.filterTags = action.payload
    },

    setFilterBoardType: (state, action: PayloadAction<string | null>) => {
      state.filterBoardType = action.payload
    },

    setFilterStarred: (state, action: PayloadAction<boolean>) => {
      state.filterStarred = action.payload
    },

    setFilterArchived: (state, action: PayloadAction<boolean>) => {
      state.filterArchived = action.payload
    },

    clearFilters: (state) => {
      state.searchQuery = ""
      state.filterTags = []
      state.filterBoardType = null
      state.filterStarred = false
    },
  },
})

export const {
  addBoard,
  updateBoard,
  deleteBoard,
  toggleStarBoard,
  archiveBoard,
  restoreBoard,
  duplicateBoard,
  setSearchQuery,
  setSortBy,
  setFilterTags,
  setFilterBoardType,
  setFilterStarred,
  setFilterArchived,
  clearFilters,
} = boardsSlice.actions

export default boardsSlice.reducer
