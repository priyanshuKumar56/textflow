import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  sidebarOpen: boolean
  rightPanelOpen: boolean
  rightPanelContent: "properties" | "layers" | "comments" | null
  theme: "light" | "dark" | "system"
  zoomLevel: number
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
  showRulers: boolean
  showMinimap: boolean
}

const initialState: UiState = {
  sidebarOpen: true,
  rightPanelOpen: false,
  rightPanelContent: null,
  theme: "system",
  zoomLevel: 100,
  showGrid: true,
  snapToGrid: true,
  gridSize: 10,
  showRulers: true,
  showMinimap: false,
}

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleRightPanel: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen
    },
    setRightPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.rightPanelOpen = action.payload
    },
    setRightPanelContent: (state, action: PayloadAction<"properties" | "layers" | "comments" | null>) => {
      state.rightPanelContent = action.payload
      if (action.payload !== null) {
        state.rightPanelOpen = true
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload
    },
    setZoomLevel: (state, action: PayloadAction<number>) => {
      state.zoomLevel = action.payload
    },
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid
    },
    toggleSnapToGrid: (state) => {
      state.snapToGrid = !state.snapToGrid
    },
    setGridSize: (state, action: PayloadAction<number>) => {
      state.gridSize = action.payload
    },
    toggleRulers: (state) => {
      state.showRulers = !state.showRulers
    },
    toggleMinimap: (state) => {
      state.showMinimap = !state.showMinimap
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleRightPanel,
  setRightPanelOpen,
  setRightPanelContent,
  setTheme,
  setZoomLevel,
  toggleGrid,
  toggleSnapToGrid,
  setGridSize,
  toggleRulers,
  toggleMinimap,
} = uiSlice.actions

export default uiSlice.reducer
