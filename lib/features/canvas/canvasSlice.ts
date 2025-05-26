import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// Simplified canvas slice for the board preview
export type Position = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}

export type ElementStyle = {
  backgroundColor?: string
  color?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  textAlign?: "left" | "center" | "right"
  verticalAlign?: "top" | "middle" | "bottom"
  lineStyle?: "solid" | "dashed" | "dotted"
  opacity?: number
  rotation?: number
  shadow?: boolean
  zIndex?: number
  padding?: number
}

export type ElementType =
  | "rectangle"
  | "circle"
  | "diamond"
  | "sticky"
  | "text"
  | "button"
  | "input"
  | "modal"
  | "navbar"
  | "start"
  | "process"
  | "decision"
  | "document"
  | "data"
  | "database"
  | "internal-storage"

export type CanvasElement = {
  id: string
  type: ElementType
  position: Position
  size: Size
  content?: string
  style: ElementStyle
  connectorPoints?: any[]
  properties?: Record<string, any>
}

export type Connector = {
  id: string
  fromId: string
  toId: string
  fromPoint: Position
  toPoint: Position
  label?: string
  style: ElementStyle
}

export type CanvasMode = "select" | "pan" | "draw" | "connect" | "text" | "shape" | "erase"
export type BoardMode = "flowchart" | "mindmap" | "wireframe" | "notes"

interface CanvasState {
  boardId: string | null
  elements: Record<string, CanvasElement>
  connectors: Record<string, Connector>
  selectedElementIds: string[]
  hoveredElementId: string | null
  mode: CanvasMode
  boardMode: BoardMode
  zoom: number
  pan: Position
}

const initialState: CanvasState = {
  boardId: null,
  elements: {},
  connectors: {},
  selectedElementIds: [],
  hoveredElementId: null,
  mode: "select",
  boardMode: "flowchart",
  zoom: 1,
  pan: { x: 0, y: 0 },
}

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setBoardId: (state, action: PayloadAction<{ boardId: string }>) => {
      state.boardId = action.payload.boardId
    },
    clearCanvas: (state) => {
      state.elements = {}
      state.connectors = {}
      state.selectedElementIds = []
      state.hoveredElementId = null
    },
    addElement: (
      state,
      action: PayloadAction<{
        id: string
        type: ElementType
        position: Position
        size: Size
        content?: string
        style: ElementStyle
      }>,
    ) => {
      const { id, type, position, size, content, style } = action.payload
      state.elements[id] = {
        id,
        type,
        position,
        size,
        content: content || "",
        style,
      }
      state.selectedElementIds = [id]
    },
    updateElement: (
      state,
      action: PayloadAction<{
        id: string
        position?: Position
        size?: Size
        content?: string
        style?: Partial<ElementStyle>
      }>,
    ) => {
      const { id, position, size, content, style } = action.payload
      const element = state.elements[id]

      if (element) {
        if (position) element.position = position
        if (size) element.size = size
        if (content !== undefined) element.content = content
        if (style) element.style = { ...element.style, ...style }
      }
    },
    deleteElement: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload
      delete state.elements[id]
      state.selectedElementIds = state.selectedElementIds.filter((selectedId) => selectedId !== id)
      if (state.hoveredElementId === id) {
        state.hoveredElementId = null
      }
    },
    selectElements: (state, action: PayloadAction<{ ids: string[] }>) => {
      state.selectedElementIds = action.payload.ids
    },
    clearSelection: (state) => {
      state.selectedElementIds = []
    },
    setHoveredElement: (state, action: PayloadAction<{ id: string | null }>) => {
      state.hoveredElementId = action.payload.id
    },
    setCanvasMode: (state, action: PayloadAction<{ mode: CanvasMode }>) => {
      state.mode = action.payload.mode
    },
    setBoardMode: (state, action: PayloadAction<{ mode: BoardMode }>) => {
      state.boardMode = action.payload.mode
    },
    setZoom: (state, action: PayloadAction<{ zoom: number }>) => {
      state.zoom = action.payload.zoom
    },
    setPan: (state, action: PayloadAction<{ pan: Position }>) => {
      state.pan = action.payload.pan
    },
  },
})

export const {
  setBoardId,
  clearCanvas,
  addElement,
  updateElement,
  deleteElement,
  selectElements,
  clearSelection,
  setHoveredElement,
  setCanvasMode,
  setBoardMode,
  setZoom,
  setPan,
} = canvasSlice.actions

export default canvasSlice.reducer
