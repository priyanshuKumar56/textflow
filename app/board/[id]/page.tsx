"use client"

import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Save,
  Undo,
  Redo,
  Grid,
  Square,
  Circle,
  Type,
  StickyNote,
  ImageIcon,
  Diamond,
  ArrowRight,
  Trash2,
  Share2,
  Lock,
  Unlock,
  Plus,
  Minus,
  Maximize,
  Minimize,
  PanelLeft,
  PanelRight,
  X,
  Palette,
  BringToFront,
  SendToBack,
  MousePointer,
  Move,
  Zap,
  HelpCircle,
  ChevronRight,
  Layers,
  ChevronLeft,
  Layout,
  FileText,
  Download,
  Upload,
  CornerDownRight,
  Settings,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import Link from "next/link"
import { setBoardId } from "@/lib/features/canvas/canvasSlice"
import { cn } from "@/lib/utils"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

// Enhanced shape types with better styling
const shapeTypes = {
  start: {
    icon: <Circle className="h-5 w-5" />,
    name: "Start/End",
    style: {
      backgroundColor: "#E8F5E9",
      borderColor: "#388E3C",
      borderWidth: 2,
      borderRadius: 30,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "flowchart",
  },
  process: {
    icon: <Square className="h-5 w-5" />,
    name: "Process",
    style: {
      backgroundColor: "#F3E5F5",
      borderColor: "#8E24AA",
      borderWidth: 2,
      borderRadius: 8,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "flowchart",
  },
  decision: {
    icon: <Diamond className="h-5 w-5" />,
    name: "Decision",
    style: {
      backgroundColor: "#FFF3E0",
      borderColor: "#FF9800",
      borderWidth: 2,
      borderRadius: 0,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "flowchart",
  },
  input: {
    icon: <Square className="h-5 w-5 rotate-12" />,
    name: "Input/Output",
    style: {
      backgroundColor: "#E3F2FD",
      borderColor: "#1E88E5",
      borderWidth: 2,
      borderRadius: 4,
      transform: "skewX(-20deg)",
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "flowchart",
  },
  document: {
    icon: <Square className="h-5 w-5" />,
    name: "Document",
    style: {
      backgroundColor: "#E0F7FA",
      borderColor: "#00ACC1",
      borderWidth: 2,
      borderRadius: 4,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "flowchart",
  },
  rectangle: {
    icon: <Square className="h-5 w-5" />,
    name: "Rectangle",
    style: {
      backgroundColor: "#E3F2FD",
      borderColor: "#2196F3",
      borderWidth: 2,
      borderRadius: 8,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "all",
  },
  circle: {
    icon: <Circle className="h-5 w-5" />,
    name: "Circle",
    style: {
      backgroundColor: "#E8F5E9",
      borderColor: "#4CAF50",
      borderWidth: 2,
      borderRadius: 50,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "all",
  },
  diamond: {
    icon: <Diamond className="h-5 w-5" />,
    name: "Diamond",
    style: {
      backgroundColor: "#FFF3E0",
      borderColor: "#FF9800",
      borderWidth: 2,
      borderRadius: 0,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "all",
  },
  sticky: {
    icon: <StickyNote className="h-5 w-5" />,
    name: "Sticky Note",
    style: {
      backgroundColor: "#FFFDE7",
      borderColor: "#FBC02D",
      borderWidth: 1,
      borderRadius: 4,
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "notes",
  },
  text: {
    icon: <Type className="h-5 w-5" />,
    name: "Text",
    style: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderWidth: 0,
    },
    connectionPoints: [],
    category: "all",
  },
  image: {
    icon: <ImageIcon className="h-5 w-5" />,
    name: "Image",
    style: {
      backgroundColor: "transparent",
      borderColor: "#e2e8f0",
      borderWidth: 1,
      borderRadius: 8,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "all",
  },
  // Mind map specific shapes
  centralTopic: {
    icon: <Circle className="h-5 w-5" />,
    name: "Central Topic",
    style: {
      backgroundColor: "#E3F2FD",
      borderColor: "#2196F3",
      borderWidth: 3,
      borderRadius: 30,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "mindmap",
  },
  mainTopic: {
    icon: <Square className="h-5 w-5" />,
    name: "Main Topic",
    style: {
      backgroundColor: "#F3E5F5",
      borderColor: "#9C27B0",
      borderWidth: 2,
      borderRadius: 15,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "mindmap",
  },
  subTopic: {
    icon: <Square className="h-5 w-5" />,
    name: "Sub Topic",
    style: {
      backgroundColor: "#FFF3E0",
      borderColor: "#FF9800",
      borderWidth: 2,
      borderRadius: 10,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "mindmap",
  },
  // Wireframe specific shapes
  container: {
    icon: <Layout className="h-5 w-5" />,
    name: "Container",
    style: {
      backgroundColor: "#F5F5F5",
      borderColor: "#9E9E9E",
      borderWidth: 1,
      borderRadius: 4,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "wireframe",
  },
  button: {
    icon: <Square className="h-5 w-5" />,
    name: "Button",
    style: {
      backgroundColor: "#E3F2FD",
      borderColor: "#2196F3",
      borderWidth: 1,
      borderRadius: 6,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "wireframe",
  },
  inputField: {
    icon: <Type className="h-5 w-5" />,
    name: "Input Field",
    style: {
      backgroundColor: "#FFFFFF",
      borderColor: "#9E9E9E",
      borderWidth: 1,
      borderRadius: 4,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "wireframe",
  },
  // Diagram specific shapes
  database: {
    icon: <Circle className="h-5 w-5" />,
    name: "Database",
    style: {
      backgroundColor: "#E8F5E9",
      borderColor: "#4CAF50",
      borderWidth: 2,
      borderRadius: 4,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "diagram",
  },
  server: {
    icon: <Square className="h-5 w-5" />,
    name: "Server",
    style: {
      backgroundColor: "#E3F2FD",
      borderColor: "#2196F3",
      borderWidth: 2,
      borderRadius: 4,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "diagram",
  },
  cloud: {
    icon: <Circle className="h-5 w-5" />,
    name: "Cloud",
    style: {
      backgroundColor: "#F3E5F5",
      borderColor: "#9C27B0",
      borderWidth: 2,
      borderRadius: 30,
    },
    connectionPoints: ["top", "right", "bottom", "left"],
    category: "diagram",
  },
}

// Connection types
const connectionTypes = [
  { id: "straight", name: "Direct", icon: <ArrowRight className="h-4 w-4" /> },
  { id: "curved", name: "Curved", icon: <Zap className="h-4 w-4" /> },
  { id: "orthogonal", name: "90°", icon: <CornerDownRight className="h-4 w-4" /> },
]

// Color palette with more colors
const colorPalette = [
  "#E53935", // Red
  "#D81B60", // Pink
  "#8E24AA", // Purple
  "#5E35B1", // Deep Purple
  "#3949AB", // Indigo
  "#1E88E5", // Blue
  "#039BE5", // Light Blue
  "#00ACC1", // Cyan
  "#00897B", // Teal
  "#43A047", // Green
  "#7CB342", // Light Green
  "#C0CA33", // Lime
  "#FDD835", // Yellow
  "#FFB300", // Amber
  "#FB8C00", // Orange
  "#F4511E", // Deep Orange
  "#6D4C41", // Brown
  "#757575", // Grey
  "#546E7A", // Blue Grey
  "#FFFFFF", // White
  "#000000", // Black
]

// Enhanced interfaces for better connection system
interface Point {
  x: number
  y: number
}

interface ConnectionHandle {
  id: string
  elementId: string
  position: "top" | "right" | "bottom" | "left"
  point: Point
}

interface Connection {
  id: string
  fromId: string
  toId: string
  fromHandle: string
  toHandle: string
  type: "straight" | "curved" | "orthogonal"
  style: {
    strokeColor: string
    strokeWidth: number
    strokeDasharray: string
    startArrow: boolean
    endArrow: boolean
  }
  bendPoints?: Point[]
  label?: string
  zIndex: number
}

interface DragState {
  isDragging: boolean
  dragType: "element" | "connection"
  elementId?: string
  handleId?: string
  startPoint?: Point
  currentPoint?: Point
}

// Connection point positions
const getConnectionPointPosition = (element: any, point: string) => {
  if (!element) {
    console.error("Element is undefined in getConnectionPointPosition")
    return { x: 0, y: 0 }
  }

  const { position, size } = element

  if (!position || !size) {
    console.error("Element position or size is undefined", element)
    return { x: 0, y: 0 }
  }

  switch (point) {
    case "top":
      return { x: position.x + size.width / 2, y: position.y }
    case "right":
      return { x: position.x + size.width, y: position.y + size.height / 2 }
    case "bottom":
      return { x: position.x + size.width / 2, y: position.y + size.height }
    case "left":
      return { x: position.x, y: position.y + size.height / 2 }
    case "center":
      return { x: position.x + size.width / 2, y: position.y + size.height / 2 }
    default:
      return { x: position.x + size.width / 2, y: position.y + size.height / 2 }
  }
}

// Enhanced path calculation for connections
const calculateConnectorPath = (startPoint: any, endPoint: any, type: string, bendPoints?: Point[]) => {
  if (!startPoint || !endPoint) {
    console.error("Invalid points in calculateConnectorPath", { startPoint, endPoint })
    return ""
  }

  if (type === "straight") {
    return `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`
  } else if (type === "curved") {
    const dx = Math.abs(endPoint.x - startPoint.x)
    const dy = Math.abs(endPoint.y - startPoint.y)
    const curveFactor = Math.min(dx, dy) * 0.5 + Math.max(dx, dy) * 0.1

    let cp1x, cp1y, cp2x, cp2y
    const isHorizontal = dx > dy

    if (isHorizontal) {
      cp1x = startPoint.x + curveFactor
      cp1y = startPoint.y
      cp2x = endPoint.x - curveFactor
      cp2y = endPoint.y
    } else {
      cp1x = startPoint.x
      cp1y = startPoint.y + curveFactor
      cp2x = endPoint.x
      cp2y = endPoint.y - curveFactor
    }

    return `M ${startPoint.x} ${startPoint.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endPoint.x} ${endPoint.y}`
  } else if (type === "orthogonal") {
    if (bendPoints && bendPoints.length > 0) {
      let path = `M ${startPoint.x} ${startPoint.y}`
      bendPoints.forEach((point) => {
        path += ` L ${point.x} ${point.y}`
      })
      path += ` L ${endPoint.x} ${endPoint.y}`
      return path
    } else {
      const dx = endPoint.x - startPoint.x
      const dy = endPoint.y - startPoint.y
      const isHorizontal = Math.abs(dx) > Math.abs(dy)

      if (isHorizontal) {
        const midX = startPoint.x + dx / 2
        return `M ${startPoint.x} ${startPoint.y} L ${midX} ${startPoint.y} L ${midX} ${endPoint.y} L ${endPoint.x} ${endPoint.y}`
      } else {
        const midY = startPoint.y + dy / 2
        return `M ${startPoint.x} ${startPoint.y} L ${startPoint.x} ${midY} L ${endPoint.x} ${midY} L ${endPoint.x} ${endPoint.y}`
      }
    }
  }

  return `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`
}

// Calculate 90-degree bend points
const calculate90DegBend = (fromPoint: Point, toPoint: Point, fromPosition: string): Point[] => {
  const bendDistance = 50
  let bendPoint: Point

  switch (fromPosition) {
    case "top":
      bendPoint = { x: fromPoint.x, y: fromPoint.y - bendDistance }
      return [bendPoint, { x: toPoint.x, y: bendPoint.y }]
    case "bottom":
      bendPoint = { x: fromPoint.x, y: fromPoint.y + bendDistance }
      return [bendPoint, { x: toPoint.x, y: bendPoint.y }]
    case "left":
      bendPoint = { x: fromPoint.x - bendDistance, y: fromPoint.y }
      return [{ x: bendPoint.x, y: toPoint.y }, bendPoint]
    case "right":
      bendPoint = { x: fromPoint.x + bendDistance, y: fromPoint.y }
      return [bendPoint, { x: bendPoint.x, y: toPoint.y }]
    default:
      return []
  }
}

export default function BoardPage() {
  const params = useParams()
  const router = useRouter()
  const boardId = params.id as string
  const dispatch = useAppDispatch()
  const boards = useAppSelector((state) => state.boards.boards)
  const [board, setBoard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [canvasElements, setCanvasElements] = useState<any[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(100)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState<string>("flowchart")
  const [showLeftPanel, setShowLeftPanel] = useState(true)
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [activeTool, setActiveTool] = useState<string>("select")
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectStart, setConnectStart] = useState<any>(null)
  const [connectors, setConnectors] = useState<Connection[]>([])
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [editingText, setEditingText] = useState<string | null>(null)
  const [textValue, setTextValue] = useState("")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState("#E3F2FD")
  const [selectedBorderColor, setSelectedBorderColor] = useState("#2196F3")
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(20)
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showTips, setShowTips] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hoveredConnectionPoint, setHoveredConnectionPoint] = useState<any>(null)
  const [connectionType, setConnectionType] = useState("orthogonal")
  const [connectionColor, setConnectionColor] = useState("#333333")
  const [showConnectionColorPicker, setShowConnectionColorPicker] = useState(false)
  const [draggedElementType, setDraggedElementType] = useState<string | null>(null)
  const [showGuides, setShowGuides] = useState(true)
  const [activeGuide, setActiveGuide] = useState<number | null>(1)
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const [showRichTextEditor, setShowRichTextEditor] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [calendarTasks, setCalendarTasks] = useState<any[]>([])
  const [newTask, setNewTask] = useState({ title: "", date: "", description: "" })
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Enhanced connection system state
  const [showConnectionHandles, setShowConnectionHandles] = useState(false)
  const [dragState, setDragState] = useState<DragState>({ isDragging: false, dragType: "element" })
  const [connectionMode, setConnectionMode] = useState<"straight" | "curved" | "orthogonal">("orthogonal")

  // Rich text editing state
  const [richTextElement, setRichTextElement] = useState<string | null>(null)
  const [showRichTextDialog, setShowRichTextDialog] = useState(false)
  const [richTextContent, setRichTextContent] = useState("")
  const [textFormatting, setTextFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: "left" as "left" | "center" | "right",
    fontSize: 16,
    fontFamily: "Arial",
    color: "#000000",
  })

  // Image upload state
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [imageUploadPosition, setImageUploadPosition] = useState({ x: 0, y: 0 })

  const canvasRef = useRef<HTMLDivElement>(null)
  const textInputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Find the board with the matching ID
    const foundBoard = boards.find((b) => b.id === boardId)
    setBoard(foundBoard)
    setLoading(false)

    if (foundBoard) {
      // Set the current board ID in the canvas slice
      try {
        dispatch(setBoardId({ boardId }))
        setActiveTab(foundBoard.boardType)
      } catch (error) {
        console.error("Failed to set board ID:", error)
      }
    }
  }, [boardId, boards, dispatch])

  // Record history when elements or connectors change
  useEffect(() => {
    if (canvasElements.length > 0 || connectors.length > 0) {
      // Only record if we're not currently undoing/redoing
      if (historyIndex === history.length - 1 || historyIndex === -1) {
        const newHistory = [
          ...history.slice(0, historyIndex + 1),
          { elements: [...canvasElements], connectors: [...connectors] },
        ]
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
      }
    }
  }, [canvasElements, connectors])

  // Focus text input when editing text
  useEffect(() => {
    if (editingText && textInputRef.current) {
      textInputRef.current.focus()
    }
  }, [editingText])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
        handleUndo()
      }
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((e.ctrlKey && e.shiftKey && e.key === "z") || (e.ctrlKey && e.key === "y")) {
        handleRedo()
      }
      // Delete: Delete or Backspace
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElement && !editingText) {
        handleDeleteElement()
      }
      // Escape to cancel operations
      if (e.key === "Escape") {
        if (editingText) {
          setEditingText(null)
        }
        if (isConnecting) {
          setIsConnecting(false)
          setConnectStart(null)
        }
        if (isResizing) {
          setIsResizing(false)
          setResizeHandle(null)
        }
        setDraggedElementType(null)
        setShowConnectionHandles(false)
      }
      // Space to toggle pan tool temporarily
      if (e.key === " " && !e.repeat && activeTool !== "pan") {
        e.preventDefault()
        setActiveTool("pan")
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      // Release space to go back to previous tool
      if (e.key === " " && activeTool === "pan") {
        setActiveTool("select")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [selectedElement, editingText, isConnecting, isResizing, history, historyIndex, activeTool])

  const handleStartEditing = () => {
    setIsEditing(true)
  }

  // Enhanced connection handle system
  const getConnectionHandles = (element: any): ConnectionHandle[] => {
    if (!element.connectionPoints || element.connectionPoints.length === 0) return []

    const handles: ConnectionHandle[] = []
    const centerX = element.position.x + element.size.width / 2
    const centerY = element.position.y + element.size.height / 2

    if (element.type === "circle" || element.type === "start" || element.type === "centralTopic") {
      const radius = element.size.width / 2
      handles.push(
        { id: `${element.id}-top`, elementId: element.id, position: "top", point: { x: centerX, y: centerY - radius } },
        {
          id: `${element.id}-right`,
          elementId: element.id,
          position: "right",
          point: { x: centerX + radius, y: centerY },
        },
        {
          id: `${element.id}-bottom`,
          elementId: element.id,
          position: "bottom",
          point: { x: centerX, y: centerY + radius },
        },
        {
          id: `${element.id}-left`,
          elementId: element.id,
          position: "left",
          point: { x: centerX - radius, y: centerY },
        },
      )
    } else {
      handles.push(
        {
          id: `${element.id}-top`,
          elementId: element.id,
          position: "top",
          point: { x: centerX, y: element.position.y },
        },
        {
          id: `${element.id}-right`,
          elementId: element.id,
          position: "right",
          point: { x: element.position.x + element.size.width, y: centerY },
        },
        {
          id: `${element.id}-bottom`,
          elementId: element.id,
          position: "bottom",
          point: { x: centerX, y: element.position.y + element.size.height },
        },
        {
          id: `${element.id}-left`,
          elementId: element.id,
          position: "left",
          point: { x: element.position.x, y: centerY },
        },
      )
    }

    return handles
  }

  const getAllHandles = (): ConnectionHandle[] => {
    return canvasElements.flatMap((element) => getConnectionHandles(element))
  }

  const getHandleAtPoint = (x: number, y: number): ConnectionHandle | null => {
    if (!showConnectionHandles || !selectedElement) return null

    const selectedElementObj = canvasElements.find((el) => el.id === selectedElement)
    if (!selectedElementObj) return null

    const handles = getConnectionHandles(selectedElementObj)
    const handleSize = 12

    for (const handle of handles) {
      const distance = Math.sqrt((x - handle.point.x) ** 2 + (y - handle.point.y) ** 2)
      if (distance <= handleSize) {
        return handle
      }
    }
    return null
  }

  // Handle element dragging from sidebar
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("elementType", type)
    setDraggedElementType(type)
  }

  const handleDragEnd = () => {
    setDraggedElementType(null)
  }

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const type = e.dataTransfer.getData("elementType")
    if (!type) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / (zoom / 100) - pan.x
    const y = (e.clientY - rect.top) / (zoom / 100) - pan.y

    // Snap to grid if enabled
    const snappedX = snapToGrid ? Math.round(x / gridSize) * gridSize : x
    const snappedY = snapToGrid ? Math.round(y / gridSize) * gridSize : y

    if (type === "image") {
      setImageUploadPosition({ x: snappedX, y: snappedY })
      setShowImageUpload(true)
    } else {
      handleAddElement(type, { x: snappedX, y: snappedY })
    }
    setDraggedElementType(null)
  }

  const handleAddElement = (type: string, position?: { x: number; y: number }) => {
    const shapeType = shapeTypes[type as keyof typeof shapeTypes]
    const centerX = position ? position.x : window.innerWidth / 2 - 75
    const centerY = position ? position.y : window.innerHeight / 2 - 50

    const newElement = {
      id: `element-${Date.now()}`,
      type,
      position: { x: centerX, y: centerY },
      size: {
        width: type === "circle" || type === "start" || type === "centralTopic" ? 120 : type === "sticky" ? 200 : 160,
        height: type === "circle" || type === "start" || type === "centralTopic" ? 120 : type === "sticky" ? 200 : 80,
      },
      content:
        type === "text"
          ? "Double-click to edit"
          : type === "sticky"
            ? "Sticky Note"
            : type === "start"
              ? "Start"
              : type === "process"
                ? "Process"
                : type === "decision"
                  ? "Decision"
                  : type === "input"
                    ? "Input / Output"
                    : type === "centralTopic"
                      ? "Central Topic"
                      : type === "mainTopic"
                        ? "Main Topic"
                        : type === "subTopic"
                          ? "Sub Topic"
                          : type === "button"
                            ? "Button"
                            : type === "inputField"
                              ? "Input Field"
                              : type === "container"
                                ? "Container"
                                : type === "database"
                                  ? "Database"
                                  : type === "server"
                                    ? "Server"
                                    : type === "cloud"
                                      ? "Cloud"
                                      : "New Element",
      style: { ...shapeType.style },
      zIndex: canvasElements.length + 1,
      rotation: 0,
      locked: false,
      connectionPoints: shapeType.connectionPoints || [],
      richText: false,
      formatting: { ...textFormatting },
    }
    setCanvasElements([...canvasElements, newElement])
    setSelectedElement(newElement.id)
    setActiveTool("select")
  }

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      const newElement = {
        id: `element-${Date.now()}`,
        type: "image",
        position: { x: imageUploadPosition.x, y: imageUploadPosition.y },
        size: { width: 300, height: 200 },
        content: "",
        style: { ...shapeTypes.image.style },
        imageUrl,
        zIndex: canvasElements.length + 1,
        rotation: 0,
        locked: false,
        connectionPoints: ["top", "right", "bottom", "left"],
      }
      setCanvasElements([...canvasElements, newElement])
      setSelectedElement(newElement.id)
      setShowImageUpload(false)
    }
    reader.readAsDataURL(file)
  }

  // Enhanced canvas interaction handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return // Only handle left mouse button

    const target = e.target as HTMLElement
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / (zoom / 100) - pan.x
    const y = (e.clientY - rect.top) / (zoom / 100) - pan.y

    // Check if clicking on a resize handle
    if (target.dataset.handle) {
      setIsResizing(true)
      setResizeHandle(target.dataset.handle)
      setResizeStart({ x, y })
      return
    }

    // Check if clicking on a connection handle
    const clickedHandle = getHandleAtPoint(x, y)
    if (clickedHandle && showConnectionHandles) {
      setDragState({
        isDragging: true,
        dragType: "connection",
        handleId: clickedHandle.id,
        startPoint: clickedHandle.point,
        currentPoint: { x, y },
      })
      e.preventDefault()
      return
    }

    // Get the element ID from the target or its closest parent with data-element-id
    const elementId = target.dataset.elementId || target.closest("[data-element-id]")?.getAttribute("data-element-id")

    if (elementId) {
      // Handle selecting elements
      if (selectedElement === elementId) {
        setShowConnectionHandles(!showConnectionHandles)
      } else {
        setSelectedElement(elementId)
        setShowConnectionHandles(false)
      }

      if (activeTool === "select") {
        const element = canvasElements.find((el) => el.id === elementId)
        if (element && !element.locked) {
          setIsDragging(true)
          setDragStart({ x, y })
        }
      }
    } else {
      // Clicking on empty canvas
      setSelectedElement(null)
      setShowConnectionHandles(false)

      if (activeTool === "select") {
        // Start panning if space is held or middle mouse button
        if (e.altKey || e.button === 1) {
          setIsPanning(true)
          setPanStart({ x: e.clientX, y: e.clientY })
        }
      } else if (activeTool === "pan") {
        setIsPanning(true)
        setPanStart({ x: e.clientX, y: e.clientY })
      }
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / (zoom / 100) - pan.x
    const y = (e.clientY - rect.top) / (zoom / 100) - pan.y

    // Handle panning
    if (isPanning) {
      const deltaX = e.clientX - panStart.x
      const deltaY = e.clientY - panStart.y
      setPan({
        x: pan.x + deltaX / (zoom / 100),
        y: pan.y + deltaY / (zoom / 100),
      })
      setPanStart({ x: e.clientX, y: e.clientY })
      return
    }

    // Handle connection dragging
    if (dragState.isDragging && dragState.dragType === "connection") {
      setDragState((prev) => ({
        ...prev,
        currentPoint: { x, y },
      }))

      // Check if hovering over a potential target element
      const target = e.target as HTMLElement
      const elementId = target.dataset.elementId || target.closest("[data-element-id]")?.getAttribute("data-element-id")

      if (elementId && elementId !== dragState.handleId?.split("-")[0]) {
        setHoveredElement(elementId)
      } else {
        setHoveredElement(null)
      }
      return
    }

    // Handle resizing
    if (isResizing && selectedElement && resizeHandle) {
      const element = canvasElements.find((el) => el.id === selectedElement)
      if (!element || element.locked) return

      const deltaX = x - resizeStart.x
      const deltaY = y - resizeStart.y

      let newWidth = element.size.width
      let newHeight = element.size.height
      let newX = element.position.x
      let newY = element.position.y

      // Apply resizing based on which handle was grabbed
      if (resizeHandle.includes("e")) {
        newWidth = Math.max(20, element.size.width + deltaX)
      }
      if (resizeHandle.includes("w")) {
        const widthChange = Math.min(element.size.width - 20, deltaX)
        newWidth = element.size.width - widthChange
        newX = element.position.x + widthChange
      }
      if (resizeHandle.includes("s")) {
        newHeight = Math.max(20, element.size.height + deltaY)
      }
      if (resizeHandle.includes("n")) {
        const heightChange = Math.min(element.size.height - 20, deltaY)
        newHeight = element.size.height - heightChange
        newY = element.position.y + heightChange
      }

      // Snap to grid if enabled
      if (snapToGrid) {
        newWidth = Math.round(newWidth / gridSize) * gridSize
        newHeight = Math.round(newHeight / gridSize) * gridSize
        newX = Math.round(newX / gridSize) * gridSize
        newY = Math.round(newY / gridSize) * gridSize
      }

      setCanvasElements(
        canvasElements.map((el) => {
          if (el.id === selectedElement) {
            return {
              ...el,
              position: { x: newX, y: newY },
              size: { width: newWidth, height: newHeight },
            }
          }
          return el
        }),
      )

      // Update connectors
      updateConnectorsForElement(selectedElement, { x: newX, y: newY }, { width: newWidth, height: newHeight })

      setResizeStart({ x, y })
      return
    }

    // Handle dragging
    if (isDragging && selectedElement) {
      const element = canvasElements.find((el) => el.id === selectedElement)
      if (!element || element.locked) return

      const deltaX = x - dragStart.x
      const deltaY = y - dragStart.y

      let newX = element.position.x + deltaX
      let newY = element.position.y + deltaY

      // Snap to grid if enabled
      if (snapToGrid) {
        newX = Math.round(newX / gridSize) * gridSize
        newY = Math.round(newY / gridSize) * gridSize
      }

      setCanvasElements(
        canvasElements.map((el) => {
          if (el.id === selectedElement) {
            return {
              ...el,
              position: { x: newX, y: newY },
            }
          }
          return el
        }),
      )

      // Update connectors
      updateConnectorsForElement(selectedElement, { x: newX, y: newY }, element.size)

      setDragStart({ x, y })
    }

    // Handle element hover
    const target = e.target as HTMLElement
    const elementId = target.dataset.elementId || target.closest("[data-element-id]")?.getAttribute("data-element-id")

    if (elementId && !dragState.isDragging) {
      setHoveredElement(elementId)
    } else if (!dragState.isDragging) {
      setHoveredElement(null)
    }
  }

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragState.isDragging && dragState.dragType === "connection" && dragState.handleId) {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / (zoom / 100) - pan.x
      const y = (e.clientY - rect.top) / (zoom / 100) - pan.y

      // Find target element
      const target = e.target as HTMLElement
      const targetElementId =
        target.dataset.elementId || target.closest("[data-element-id]")?.getAttribute("data-element-id")

      if (targetElementId && targetElementId !== dragState.handleId.split("-")[0]) {
        const targetElement = canvasElements.find((el) => el.id === targetElementId)

        if (targetElement) {
          const targetHandles = getConnectionHandles(targetElement)
          let closestHandle = targetHandles[0]
          let minDistance = Math.sqrt((x - closestHandle.point.x) ** 2 + (y - closestHandle.point.y) ** 2)

          targetHandles.forEach((handle) => {
            const distance = Math.sqrt((x - handle.point.x) ** 2 + (y - handle.point.y) ** 2)
            if (distance < minDistance) {
              minDistance = distance
              closestHandle = handle
            }
          })

          // Check if connection already exists
          const connectionExists = connectors.some(
            (conn) =>
              (conn.fromHandle === dragState.handleId && conn.toHandle === closestHandle.id) ||
              (conn.fromHandle === closestHandle.id && conn.toHandle === dragState.handleId),
          )

          if (!connectionExists) {
            const fromHandle = getAllHandles().find((h) => h.id === dragState.handleId)
            const newConnection: Connection = {
              id: `conn-${Date.now()}`,
              fromId: dragState.handleId.split("-")[0],
              toId: targetElementId,
              fromHandle: dragState.handleId,
              toHandle: closestHandle.id,
              type: connectionMode,
              style: {
                strokeColor: connectionColor,
                strokeWidth: 2,
                strokeDasharray: "",
                startArrow: false,
                endArrow: true,
              },
              zIndex: 0,
            }

            if (connectionMode === "orthogonal" && fromHandle) {
              const handlePosition = dragState.handleId.split("-")[1]
              newConnection.bendPoints = calculate90DegBend(fromHandle.point, closestHandle.point, handlePosition)
            }

            setConnectors([...connectors, newConnection])
          }
        }
      }
    }

    setIsDragging(false)
    setIsPanning(false)
    setIsResizing(false)
    setResizeHandle(null)
    setDragState({ isDragging: false, dragType: "element" })
  }

  const updateConnectorsForElement = (elementId: string, position: any, size: any) => {
    setConnectors(
      connectors.map((connector) => {
        const updated = { ...connector }

        if (connector.fromId === elementId) {
          const fromElement = { position, size }
          const startPoint = getConnectionPointPosition(fromElement, connector.fromHandle.split("-")[1])
          // Update connector start position logic here
        }

        if (connector.toId === elementId) {
          const toElement = { position, size }
          const endPoint = getConnectionPointPosition(toElement, connector.toHandle.split("-")[1])
          // Update connector end position logic here
        }

        return updated
      }),
    )
  }

  const handleCanvasDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const elementId = target.dataset.elementId || target.closest("[data-element-id]")?.getAttribute("data-element-id")

    if (elementId) {
      const element = canvasElements.find((el) => el.id === elementId)
      if (element && !element.locked) {
        setRichTextElement(elementId)
        setRichTextContent(element.content || "")
        setShowRichTextDialog(true)
      }
    }
  }

  const handleRichTextSave = () => {
    if (richTextElement) {
      setCanvasElements(
        canvasElements.map((el) => {
          if (el.id === richTextElement) {
            return {
              ...el,
              content: richTextContent,
              richText: true,
              formatting: { ...textFormatting },
            }
          }
          return el
        }),
      )
      setShowRichTextDialog(false)
      setRichTextElement(null)
    }
  }

  const handleDeleteElement = () => {
    if (selectedElement) {
      // Delete the element
      setCanvasElements(canvasElements.filter((el) => el.id !== selectedElement))

      // Delete any connectors attached to this element
      setConnectors(
        connectors.filter((connector) => connector.fromId !== selectedElement && connector.toId !== selectedElement),
      )

      setSelectedElement(null)
      setShowConnectionHandles(false)
    }
  }

  const handleDeleteConnector = (connectorId: string) => {
    setConnectors(connectors.filter((connector) => connector.id !== connectorId))
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    if (selectedElement) {
      setCanvasElements(
        canvasElements.map((el) => {
          if (el.id === selectedElement) {
            return {
              ...el,
              style: {
                ...el.style,
                backgroundColor: color,
              },
            }
          }
          return el
        }),
      )
    }
  }

  const handleBorderColorChange = (color: string) => {
    setSelectedBorderColor(color)
    if (selectedElement) {
      setCanvasElements(
        canvasElements.map((el) => {
          if (el.id === selectedElement) {
            return {
              ...el,
              style: {
                ...el.style,
                borderColor: color,
              },
            }
          }
          return el
        }),
      )
    }
  }

  const handleConnectionColorChange = (color: string) => {
    setConnectionColor(color)
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 10, 30))
  }

  const handleZoomReset = () => {
    setZoom(100)
    setPan({ x: 0, y: 0 })
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const historyState = history[newIndex]
      setCanvasElements(historyState.elements)
      setConnectors(historyState.connectors)
      setHistoryIndex(newIndex)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const historyState = history[newIndex]
      setCanvasElements(historyState.elements)
      setConnectors(historyState.connectors)
      setHistoryIndex(newIndex)
    }
  }

  const handleSave = () => {
    setIsSaving(true)
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  // Enhanced download functionality
  const handleDownloadImage = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const canvasElement = await html2canvas(canvas, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      })

      const link = document.createElement("a")
      link.download = `${board?.name || "whiteboard"}.png`
      link.href = canvasElement.toDataURL()
      link.click()
    } catch (error) {
      console.error("Error downloading image:", error)
    }
  }

  const handleDownloadPDF = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const canvasElement = await html2canvas(canvas, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      })

      const imgData = canvasElement.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: canvasElement.width > canvasElement.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvasElement.width, canvasElement.height],
      })

      pdf.addImage(imgData, "PNG", 0, 0, canvasElement.width, canvasElement.height)
      pdf.save(`${board?.name || "whiteboard"}.pdf`)
    } catch (error) {
      console.error("Error downloading PDF:", error)
    }
  }

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const handleBringToFront = () => {
    if (selectedElement) {
      const maxZIndex = Math.max(...canvasElements.map((el) => el.zIndex || 0)) + 1
      setCanvasElements(
        canvasElements.map((el) => {
          if (el.id === selectedElement) {
            return {
              ...el,
              zIndex: maxZIndex,
            }
          }
          return el
        }),
      )
    }
  }

  const handleSendToBack = () => {
    if (selectedElement) {
      const minZIndex = Math.min(...canvasElements.map((el) => el.zIndex || 0)) - 1
      setCanvasElements(
        canvasElements.map((el) => {
          if (el.id === selectedElement) {
            return {
              ...el,
              zIndex: minZIndex,
            }
          }
          return el
        }),
      )
    }
  }

  const handleLockElement = () => {
    if (selectedElement) {
      setCanvasElements(
        canvasElements.map((el) => {
          if (el.id === selectedElement) {
            return {
              ...el,
              locked: !el.locked,
            }
          }
          return el
        }),
      )
    }
  }

  const handleChangeElementType = (newType: string) => {
    if (selectedElement) {
      const element = canvasElements.find((el) => el.id === selectedElement)
      if (!element) return

      const shapeType = shapeTypes[newType as keyof typeof shapeTypes]

      setCanvasElements(
        canvasElements.map((el) => {
          if (el.id === selectedElement) {
            return {
              ...el,
              type: newType,
              style: { ...el.style, ...shapeType.style },
              connectionPoints: shapeType.connectionPoints || [],
            }
          }
          return el
        }),
      )
    }
  }

  const handleChangeConnectionType = (type: string) => {
    setConnectionMode(type as "straight" | "curved" | "orthogonal")
  }

  const handleNextGuide = () => {
    if (activeGuide === null) {
      setActiveGuide(1)
    } else if (activeGuide < 3) {
      setActiveGuide(activeGuide + 1)
    } else {
      setActiveGuide(null)
      setShowGuides(false)
    }
  }

  const handlePrevGuide = () => {
    if (activeGuide && activeGuide > 1) {
      setActiveGuide(activeGuide - 1)
    }
  }

  const renderResizeHandles = (element: any) => {
    if (selectedElement !== element.id || element.locked) return null

    const handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"]

    return handles.map((handle) => (
      <div
        key={handle}
        data-handle={handle}
        className={`absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-sm z-50 ${
          handle.includes("n") ? "top-0 -mt-1.5" : handle.includes("s") ? "bottom-0 -mb-1.5" : "top-1/2 -mt-1.5"
        } ${
          handle.includes("w") ? "left-0 -ml-1.5" : handle.includes("e") ? "right-0 -mr-1.5" : "left-1/2 -ml-1.5"
        } cursor-${handle}-resize hover:bg-blue-100 transition-colors`}
      />
    ))
  }

  const renderConnectionHandles = (element: any) => {
    if (!showConnectionHandles || selectedElement !== element.id) return null
    if (!element.connectionPoints || element.connectionPoints.length === 0) return null

    const handles = getConnectionHandles(element)

    return handles.map((handle) => {
      let top = "50%"
      let left = "50%"
      let transform = "translate(-50%, -50%)"

      switch (handle.position) {
        case "top":
          top = "0%"
          left = "50%"
          transform = "translate(-50%, -50%)"
          break
        case "right":
          top = "50%"
          left = "100%"
          transform = "translate(-50%, -50%)"
          break
        case "bottom":
          top = "100%"
          left = "50%"
          transform = "translate(-50%, -50%)"
          break
        case "left":
          top = "50%"
          left = "0%"
          transform = "translate(-50%, -50%)"
          break
      }

      return (
        <div
          key={handle.id}
          data-connection-handle={handle.id}
          className={`absolute w-6 h-6 rounded-full border-3 z-40 cursor-crosshair transition-all duration-200 ${
            connectionMode === "orthogonal"
              ? "bg-amber-500 border-white hover:bg-amber-600"
              : connectionMode === "curved"
                ? "bg-purple-500 border-white hover:bg-purple-600"
                : "bg-blue-500 border-white hover:bg-blue-600"
          }`}
          style={{
            top,
            left,
            transform,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      )
    })
  }

  const renderConnector = (connector: Connection) => {
    const startElement = canvasElements.find((el) => el.id === connector.fromId)
    const endElement = canvasElements.find((el) => el.id === connector.toId)

    if (!startElement || !endElement) return null

    // Calculate connector points
    const startPoint = getConnectionPointPosition(startElement, connector.fromHandle.split("-")[1])
    const endPoint = getConnectionPointPosition(endElement, connector.toHandle.split("-")[1])

    // Create path based on connector type
    const path = calculateConnectorPath(startPoint, endPoint, connector.type, connector.bendPoints)

    // Calculate position for arrow
    const dx = endPoint.x - startPoint.x
    const dy = endPoint.y - startPoint.y
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI

    // Calculate midpoint for label
    const midX = (startPoint.x + endPoint.x) / 2
    const midY = (startPoint.y + endPoint.y) / 2

    return (
      <g key={connector.id} className="connector-group">
        <path
          d={path}
          stroke={connector.style.strokeColor}
          strokeWidth={connector.style.strokeWidth}
          strokeDasharray={connector.style.strokeDasharray}
          fill="none"
          className="connector-path hover:stroke-width-3 transition-all cursor-pointer"
          onClick={() => setSelectedElement(null)}
        />
        {connector.style.endArrow && (
          <polygon
            points="0,-6 12,0 0,6"
            transform={`translate(${endPoint.x}, ${endPoint.y}) rotate(${angle})`}
            fill={connector.style.strokeColor}
            className="connector-arrow"
          />
        )}
        {connector.label && (
          <foreignObject x={midX - 40} y={midY - 15} width={80} height={30} className="connector-label">
            <div className="flex items-center justify-center h-full">
              <div className="bg-white px-2 py-1 rounded text-xs border shadow-sm">{connector.label}</div>
            </div>
          </foreignObject>
        )}
        {/* Enhanced delete button */}
        <foreignObject
          x={midX - 12}
          y={midY - 32}
          width={24}
          height={24}
          className="connector-delete opacity-0 hover:opacity-100 transition-opacity"
        >
          <div className="flex items-center justify-center h-full">
            <button
              className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteConnector(connector.id)
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </foreignObject>
      </g>
    )
  }

  const renderGuide = () => {
    if (!showGuides || activeGuide === null) return null

    let guideContent

    if (activeGuide === 1) {
      guideContent = (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 shadow-lg max-w-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-yellow-800 text-lg">Step 1: Add a shape</h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowGuides(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-yellow-700 mb-3">
            Select a shape from the toolbar menu on the left of the screen (you can also drag and drop shapes to the
            canvas).
          </p>
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm" onClick={() => setShowGuides(false)}>
              Skip tutorial
            </Button>
            <Button variant="default" size="sm" onClick={handleNextGuide}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    } else if (activeGuide === 2) {
      guideContent = (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 shadow-lg max-w-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-yellow-800 text-lg">Step 2: Add connectors</h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowGuides(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-yellow-700 mb-3">
            Click on a shape to select it, then click "Show Connection Handles" to see connection points. Drag from one
            handle to another shape to create connections.
          </p>
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm" onClick={handlePrevGuide}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <Button variant="default" size="sm" onClick={handleNextGuide}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    } else if (activeGuide === 3) {
      guideContent = (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 shadow-lg max-w-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-yellow-800 text-lg">Step 3: Rich text editing</h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowGuides(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-yellow-700 mb-3">
            Double-click on any shape to open the rich text editor. You can format text with bold, italic, colors, and
            more.
          </p>
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm" onClick={handlePrevGuide}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <Button variant="default" size="sm" onClick={handleNextGuide}>
              Finish
            </Button>
          </div>
        </div>
      )
    }

    return <div className="absolute bottom-24 right-4 z-50 animate-fadeIn">{guideContent}</div>
  }

  // Filter elements based on active tab
  const getFilteredElements = () => {
    return Object.entries(shapeTypes).filter(([_, data]) => data.category === activeTab || data.category === "all")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!board) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <h1 className="text-2xl font-bold mb-4">Board Not Found</h1>
          <p className="text-muted-foreground mb-6">The board you're looking for doesn't exist or has been deleted.</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-border bg-background z-10">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">{board.name}</h1>

            {isEditing && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="ml-4">
                <TabsList>
                  <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
                  <TabsTrigger value="mindmap">Mind Map</TabsTrigger>
                  <TabsTrigger value="wireframe">Wireframe</TabsTrigger>
                  <TabsTrigger value="notes">Sticky Notes</TabsTrigger>
                  <TabsTrigger value="diagram">Diagram</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" onClick={handleUndo} disabled={historyIndex <= 0}>
                        <Undo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRedo}
                        disabled={historyIndex >= history.length - 1}
                      >
                        <Redo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex items-center border rounded-md">
                  <Button size="sm" variant="ghost" onClick={handleZoomOut} className="px-2">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm px-2">{zoom}%</span>
                  <Button size="sm" variant="ghost" onClick={handleZoomIn} className="px-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" onClick={handleToggleFullscreen}>
                        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle Fullscreen</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button size="sm" variant="default" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </>
                  )}
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="space-y-2">
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleDownloadImage}>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Download as PNG
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleDownloadPDF}>
                        <FileText className="h-4 w-4 mr-2" />
                        Download as PDF
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button size="sm" variant="default" onClick={handleStartEditing}>
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="px-4 py-1 border-t border-border flex items-center justify-between bg-background/95 backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={activeTool === "select" ? "default" : "ghost"}
                      onClick={() => setActiveTool("select")}
                      className="h-8 w-8 p-0"
                    >
                      <MousePointer className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Select (V)</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={activeTool === "pan" ? "default" : "ghost"}
                      onClick={() => setActiveTool("pan")}
                      className="h-8 w-8 p-0"
                    >
                      <Move className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Pan (Space)</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="h-6 border-r border-border mx-1"></div>

              {/* Connection Mode Selector */}
              <div className="flex bg-muted rounded-md overflow-hidden">
                {connectionTypes.map((type) => (
                  <TooltipProvider key={type.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant={connectionMode === type.id ? "default" : "ghost"}
                          onClick={() => handleChangeConnectionType(type.id)}
                          className="h-8 px-2 rounded-none"
                        >
                          {type.icon}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{type.name} Connection</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>

              <div className="h-6 border-r border-border mx-1"></div>

              {/* Tab-specific tools */}
              {activeTab === "flowchart" && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAddElement("process")}
                          className="h-8 w-8 p-0"
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Process</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAddElement("decision")}
                          className="h-8 w-8 p-0"
                        >
                          <Diamond className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Decision</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAddElement("start")}
                          className="h-8 w-8 p-0"
                        >
                          <Circle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Start/End</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}

              {activeTab === "mindmap" && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAddElement("centralTopic")}
                          className="h-8 w-8 p-0"
                        >
                          <Circle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Central Topic</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAddElement("mainTopic")}
                          className="h-8 w-8 p-0"
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Main Topic</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}

              {activeTab === "notes" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddElement("sticky")}
                        className="h-8 w-8 p-0"
                      >
                        <StickyNote className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Sticky Note</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" onClick={() => handleAddElement("text")} className="h-8 w-8 p-0">
                      <Type className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Text</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="h-6 border-r border-border mx-1"></div>

              <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 flex items-center gap-1"
                    disabled={!selectedElement}
                  >
                    <div
                      className="w-4 h-4 rounded-sm border border-gray-300"
                      style={{ backgroundColor: selectedColor }}
                    ></div>
                    <Palette className="h-4 w-4 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                  <div className="mb-2">
                    <Label>Fill Color</Label>
                    <div className="grid grid-cols-5 gap-1 mt-1">
                      {colorPalette.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-sm border ${color === selectedColor ? "ring-2 ring-blue-500" : "border-gray-300"}`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorChange(color)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Border Color</Label>
                    <div className="grid grid-cols-5 gap-1 mt-1">
                      {colorPalette.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-sm border ${color === selectedBorderColor ? "ring-2 ring-blue-500" : "border-gray-300"}`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleBorderColorChange(color)}
                        />
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {selectedElement && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowConnectionHandles(!showConnectionHandles)}
                          className="h-8 w-8 p-0"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Toggle Connection Handles</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="ghost" onClick={handleBringToFront} className="h-8 w-8 p-0">
                          <BringToFront className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bring to Front</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="ghost" onClick={handleSendToBack} className="h-8 w-8 p-0">
                          <SendToBack className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Send to Back</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="ghost" onClick={handleLockElement} className="h-8 w-8 p-0">
                          {canvasElements.find((el) => el.id === selectedElement)?.locked ? (
                            <Lock className="h-4 w-4" />
                          ) : (
                            <Unlock className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {canvasElements.find((el) => el.id === selectedElement)?.locked ? "Unlock" : "Lock"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleDeleteElement}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete (Del)</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={showGrid ? "default" : "ghost"}
                      onClick={() => setShowGrid(!showGrid)}
                      className="h-8 w-8 p-0"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Grid</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={showGuides ? "default" : "ghost"}
                      onClick={() => {
                        setShowGuides(!showGuides)
                        if (!showGuides) setActiveGuide(1)
                      }}
                      className="h-8 px-2"
                    >
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Tips
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show/Hide Tips</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowLeftPanel(!showLeftPanel)}
                className="h-8 w-8 p-0"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowRightPanel(!showRightPanel)}
                className="h-8 w-8 p-0"
              >
                <PanelRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {isEditing ? (
          <div className="flex h-full">
            {/* Left panel */}
            {showLeftPanel && (
              <div className="w-64 bg-background border-r border-border overflow-y-auto">
                <div className="p-4">
                  <h3 className="font-medium mb-2">Elements</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {getFilteredElements().map(([type, data]) => (
                      <div
                        key={type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, type)}
                        onDragEnd={handleDragEnd}
                        className={`border rounded-md p-2 flex flex-col items-center justify-center cursor-grab hover:bg-muted/50 transition-colors ${
                          draggedElementType === type ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <div className="h-10 w-10 flex items-center justify-center">{data.icon}</div>
                        <span className="text-xs mt-1 text-center">{data.name}</span>
                      </div>
                    ))}
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, "image")}
                      onDragEnd={handleDragEnd}
                      className={`border rounded-md p-2 flex flex-col items-center justify-center cursor-grab hover:bg-muted/50 transition-colors ${
                        draggedElementType === "image" ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <div className="h-10 w-10 flex items-center justify-center">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                      <span className="text-xs mt-1 text-center">Image</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border p-4">
                  <h3 className="font-medium mb-2">Templates</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <span className="text-xs">Basic Flowchart</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <span className="text-xs">User Journey</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <span className="text-xs">Sitemap</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Canvas */}
            <div className="flex-1 relative overflow-hidden">
              <div
                ref={canvasRef}
                className={cn(
                  "absolute inset-0 overflow-auto",
                  "bg-white",
                  showGrid && "bg-[radial-gradient(circle,#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px]",
                  "transition-all duration-200",
                )}
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "0 0",
                  backgroundImage: showGrid
                    ? "radial-gradient(circle, #e5e7eb 1px, transparent 1px)"
                    : "linear-gradient(45deg, #fafafa 25%, transparent 25%), linear-gradient(-45deg, #fafafa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fafafa 75%), linear-gradient(-45deg, transparent 75%, #fafafa 75%)",
                  backgroundSize: showGrid ? "20px 20px" : "20px 20px",
                  backgroundPosition: showGrid ? "0 0" : "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onDoubleClick={handleCanvasDoubleClick}
                onDragOver={handleCanvasDragOver}
                onDrop={handleCanvasDrop}
              >
                <div
                  className="absolute"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px)`,
                    width: "5000px",
                    height: "5000px",
                  }}
                >
                  {/* SVG for connectors */}
                  <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                    {connectors.map(renderConnector)}

                    {/* Connector being drawn */}
                    {dragState.isDragging &&
                      dragState.dragType === "connection" &&
                      dragState.startPoint &&
                      dragState.currentPoint && (
                        <path
                          d={calculateConnectorPath(
                            dragState.startPoint,
                            dragState.currentPoint,
                            connectionMode,
                            connectionMode === "orthogonal" && dragState.handleId
                              ? calculate90DegBend(
                                  dragState.startPoint,
                                  dragState.currentPoint,
                                  dragState.handleId.split("-")[1],
                                )
                              : undefined,
                          )}
                          stroke={connectionColor}
                          strokeWidth="3"
                          strokeDasharray="8,4"
                          fill="none"
                          className="connection-line-temp"
                        />
                      )}
                  </svg>

                  {/* Canvas elements */}
                  {canvasElements.map((element) => {
                    const isSelected = selectedElement === element.id
                    const isHovered = hoveredElement === element.id

                    if (element.type === "image") {
                      return (
                        <div
                          key={element.id}
                          data-element-id={element.id}
                          className={cn(
                            "absolute rounded-lg overflow-hidden shadow-sm",
                            isSelected && !element.locked && "ring-2 ring-blue-500",
                            isHovered && "ring-1 ring-blue-300",
                            element.locked && "opacity-80",
                            "cursor-move transition-all duration-200",
                          )}
                          style={{
                            left: element.position.x,
                            top: element.position.y,
                            width: element.size.width,
                            height: element.size.height,
                            zIndex: element.zIndex || 1,
                            transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                          }}
                        >
                          <img
                            src={element.imageUrl || "/placeholder.svg"}
                            alt="Element"
                            className="w-full h-full object-cover"
                            style={{
                              borderRadius: `${element.style.borderRadius || 0}px`,
                              border: element.style.borderWidth
                                ? `${element.style.borderWidth}px solid ${element.style.borderColor}`
                                : undefined,
                            }}
                          />
                          {renderConnectionHandles(element)}
                          {renderResizeHandles(element)}
                        </div>
                      )
                    }

                    if (element.type === "text") {
                      return (
                        <div
                          key={element.id}
                          data-element-id={element.id}
                          className={cn(
                            "absolute",
                            isSelected && !element.locked && "ring-2 ring-blue-500",
                            isHovered && "ring-1 ring-blue-300",
                            element.locked && "opacity-80",
                            "cursor-move transition-all duration-200",
                          )}
                          style={{
                            left: element.position.x,
                            top: element.position.y,
                            width: element.size.width,
                            height: element.size.height,
                            zIndex: element.zIndex || 1,
                            transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                          }}
                        >
                          <div
                            className="w-full h-full p-2 overflow-hidden flex items-center justify-center"
                            style={{
                              color: element.formatting?.color || "#000",
                              fontSize: `${element.formatting?.fontSize || 16}px`,
                              fontFamily: element.formatting?.fontFamily || "Arial",
                              fontWeight: element.formatting?.bold ? "bold" : "normal",
                              fontStyle: element.formatting?.italic ? "italic" : "normal",
                              textDecoration: element.formatting?.underline ? "underline" : "none",
                              textAlign: element.formatting?.align || "center",
                            }}
                            dangerouslySetInnerHTML={{ __html: element.content || "Text" }}
                          />
                          {renderResizeHandles(element)}
                        </div>
                      )
                    }

                    if (element.type === "circle" || element.type === "start" || element.type === "centralTopic") {
                      return (
                        <div
                          key={element.id}
                          data-element-id={element.id}
                          className={cn(
                            "absolute rounded-full flex items-center justify-center shadow-sm",
                            isSelected && !element.locked && "ring-2 ring-blue-500",
                            isHovered && "ring-1 ring-blue-300",
                            element.locked && "opacity-80",
                            "cursor-move transition-all duration-200",
                          )}
                          style={{
                            left: element.position.x,
                            top: element.position.y,
                            width: element.size.width,
                            height: element.size.height,
                            backgroundColor: element.style.backgroundColor,
                            border: `${element.style.borderWidth}px solid ${element.style.borderColor}`,
                            zIndex: element.zIndex || 1,
                            transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                          }}
                        >
                          <div
                            className="w-full h-full p-2 overflow-hidden flex items-center justify-center text-center"
                            style={{
                              color: element.formatting?.color || "#000",
                              fontSize: `${element.formatting?.fontSize || 14}px`,
                              fontFamily: element.formatting?.fontFamily || "Arial",
                              fontWeight: element.formatting?.bold ? "bold" : "normal",
                              fontStyle: element.formatting?.italic ? "italic" : "normal",
                              textDecoration: element.formatting?.underline ? "underline" : "none",
                            }}
                            dangerouslySetInnerHTML={{ __html: element.content || "Circle" }}
                          />
                          {renderConnectionHandles(element)}
                          {renderResizeHandles(element)}
                        </div>
                      )
                    }

                    if (element.type === "diamond" || element.type === "decision") {
                      return (
                        <div
                          key={element.id}
                          data-element-id={element.id}
                          className={cn(
                            "absolute flex items-center justify-center",
                            isSelected && !element.locked && "ring-2 ring-blue-500",
                            isHovered && "ring-1 ring-blue-300",
                            element.locked && "opacity-80",
                            "cursor-move transition-all duration-200",
                          )}
                          style={{
                            left: element.position.x,
                            top: element.position.y,
                            width: element.size.width,
                            height: element.size.height,
                            zIndex: element.zIndex || 1,
                          }}
                        >
                          <div
                            className="w-full h-full flex items-center justify-center shadow-sm"
                            style={{
                              backgroundColor: element.style.backgroundColor,
                              border: `${element.style.borderWidth}px solid ${element.style.borderColor}`,
                              transform: "rotate(45deg)",
                            }}
                          />
                          <div
                            className="absolute inset-0 flex items-center justify-center text-center"
                            style={{
                              color: element.formatting?.color || "#000",
                              fontSize: `${element.formatting?.fontSize || 14}px`,
                              fontFamily: element.formatting?.fontFamily || "Arial",
                              fontWeight: element.formatting?.bold ? "bold" : "normal",
                              fontStyle: element.formatting?.italic ? "italic" : "normal",
                              textDecoration: element.formatting?.underline ? "underline" : "none",
                            }}
                            dangerouslySetInnerHTML={{ __html: element.content || "Decision" }}
                          />
                          {renderConnectionHandles(element)}
                          {renderResizeHandles(element)}
                        </div>
                      )
                    }

                    if (element.type === "sticky") {
                      return (
                        <div
                          key={element.id}
                          data-element-id={element.id}
                          className={cn(
                            "absolute p-4 shadow-lg",
                            isSelected && !element.locked && "ring-2 ring-blue-500",
                            isHovered && "ring-1 ring-blue-300",
                            element.locked && "opacity-80",
                            "cursor-move transition-all duration-200",
                          )}
                          style={{
                            left: element.position.x,
                            top: element.position.y,
                            width: element.size.width,
                            height: element.size.height,
                            backgroundColor: element.style.backgroundColor,
                            border: `${element.style.borderWidth}px solid ${element.style.borderColor}`,
                            borderRadius: `${element.style.borderRadius}px`,
                            zIndex: element.zIndex || 1,
                            transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                            boxShadow: element.style.boxShadow,
                          }}
                        >
                          <div
                            className="w-full h-full overflow-auto"
                            style={{
                              color: element.formatting?.color || "#000",
                              fontSize: `${element.formatting?.fontSize || 14}px`,
                              fontFamily: element.formatting?.fontFamily || "Arial",
                              fontWeight: element.formatting?.bold ? "bold" : "normal",
                              fontStyle: element.formatting?.italic ? "italic" : "normal",
                              textDecoration: element.formatting?.underline ? "underline" : "none",
                              textAlign: element.formatting?.align || "left",
                            }}
                            dangerouslySetInnerHTML={{ __html: element.content || "Sticky Note" }}
                          />
                          {renderConnectionHandles(element)}
                          {renderResizeHandles(element)}
                        </div>
                      )
                    }

                    // Default rectangle/process and other shapes
                    return (
                      <div
                        key={element.id}
                        data-element-id={element.id}
                        className={cn(
                          "absolute flex items-center justify-center shadow-sm",
                          isSelected && !element.locked && "ring-2 ring-blue-500",
                          isHovered && "ring-1 ring-blue-300",
                          element.locked && "opacity-80",
                          "cursor-move relative transition-all duration-200",
                        )}
                        style={{
                          left: element.position.x,
                          top: element.position.y,
                          width: element.size.width,
                          height: element.size.height,
                          backgroundColor: element.style.backgroundColor,
                          border: `${element.style.borderWidth}px solid ${element.style.borderColor}`,
                          borderRadius: `${element.style.borderRadius}px`,
                          zIndex: element.zIndex || 1,
                          transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                        }}
                      >
                        <div
                          className="w-full h-full p-2 overflow-hidden flex items-center justify-center text-center"
                          style={{
                            color: element.formatting?.color || "#000",
                            fontSize: `${element.formatting?.fontSize || 14}px`,
                            fontFamily: element.formatting?.fontFamily || "Arial",
                            fontWeight: element.formatting?.bold ? "bold" : "normal",
                            fontStyle: element.formatting?.italic ? "italic" : "normal",
                            textDecoration: element.formatting?.underline ? "underline" : "none",
                          }}
                          dangerouslySetInnerHTML={{ __html: element.content || "Element" }}
                        />
                        {renderConnectionHandles(element)}
                        {renderResizeHandles(element)}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Zoom controls */}
              <div className="absolute bottom-4 right-4 bg-background border border-border rounded-md shadow-sm flex items-center">
                <Button variant="ghost" size="sm" onClick={handleZoomOut} className="px-2">
                  <Minus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleZoomReset} className="px-2">
                  {zoom}%
                </Button>
                <Button variant="ghost" size="sm" onClick={handleZoomIn} className="px-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Guides */}
              {renderGuide()}
            </div>

            {/* Right panel */}
            {showRightPanel && (
              <div className="w-64 bg-background border-l border-border overflow-y-auto">
                <div className="p-4">
                  <h3 className="font-medium mb-2">Properties</h3>
                  {selectedElement ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Position</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <Label className="text-xs">X</Label>
                            <Input
                              type="number"
                              value={canvasElements.find((el) => el.id === selectedElement)?.position.x}
                              className="h-8"
                              disabled
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Y</Label>
                            <Input
                              type="number"
                              value={canvasElements.find((el) => el.id === selectedElement)?.position.y}
                              className="h-8"
                              disabled
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Size</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <Label className="text-xs">Width</Label>
                            <Input
                              type="number"
                              value={canvasElements.find((el) => el.id === selectedElement)?.size.width}
                              className="h-8"
                              disabled
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Height</Label>
                            <Input
                              type="number"
                              value={canvasElements.find((el) => el.id === selectedElement)?.size.height}
                              className="h-8"
                              disabled
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Shape Type</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {getFilteredElements()
                            .filter(([type]) => type !== "text" && type !== "image")
                            .map(([type, data]) => (
                              <Button
                                key={type}
                                variant={
                                  canvasElements.find((el) => el.id === selectedElement)?.type === type
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className="h-auto py-2 justify-start"
                                onClick={() => handleChangeElementType(type)}
                              >
                                {data.icon}
                                <span className="ml-2 text-xs">{data.name}</span>
                              </Button>
                            ))}
                        </div>
                      </div>

                      <div>
                        <Label>Appearance</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <Label className="text-xs">Fill</Label>
                            <div
                              className="h-8 rounded-md border border-input flex items-center px-2 mt-1"
                              style={{
                                backgroundColor: canvasElements.find((el) => el.id === selectedElement)?.style
                                  .backgroundColor,
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Border</Label>
                            <div
                              className="h-8 rounded-md border border-input flex items-center px-2 mt-1"
                              style={{
                                backgroundColor: canvasElements.find((el) => el.id === selectedElement)?.style
                                  .borderColor,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Select an element to view its properties</p>
                  )}
                </div>

                <div className="border-t border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Layers</h3>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Layers className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {canvasElements
                      .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
                      .map((element) => (
                        <div
                          key={element.id}
                          className={cn(
                            "flex items-center p-2 rounded-md text-sm",
                            selectedElement === element.id ? "bg-muted" : "hover:bg-muted/50",
                            "cursor-pointer",
                          )}
                          onClick={() => setSelectedElement(element.id)}
                        >
                          {element.type === "rectangle" && <Square className="h-4 w-4 mr-2" />}
                          {element.type === "circle" && <Circle className="h-4 w-4 mr-2" />}
                          {element.type === "text" && <Type className="h-4 w-4 mr-2" />}
                          {element.type === "sticky" && <StickyNote className="h-4 w-4 mr-2" />}
                          {element.type === "image" && <ImageIcon className="h-4 w-4 mr-2" />}
                          {element.type === "diamond" && <Diamond className="h-4 w-4 mr-2" />}
                          <span className="truncate flex-1">{element.content || element.type}</span>
                          {element.locked && <Lock className="h-3 w-3 ml-1 text-muted-foreground" />}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-medium mb-4">Board Details</h2>
              <div className="grid gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Board Type</p>
                  <p className="capitalize">{board.boardType}</p>
                </div>
                {board.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p>{board.description}</p>
                  </div>
                )}
                {board.tags && board.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {board.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-sm">{new Date(board.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="text-sm">{new Date(board.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-8 border border-dashed rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Ready to start working on your {board.boardType}?</p>
                  <Button onClick={handleStartEditing}>Start Editing</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Rich Text Dialog */}
      <Dialog open={showRichTextDialog} onOpenChange={setShowRichTextDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rich Text Editor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Rich text toolbar */}
            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
              <Button
                size="sm"
                variant={textFormatting.bold ? "default" : "ghost"}
                onClick={() => setTextFormatting((prev) => ({ ...prev, bold: !prev.bold }))}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={textFormatting.italic ? "default" : "ghost"}
                onClick={() => setTextFormatting((prev) => ({ ...prev, italic: !prev.italic }))}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={textFormatting.underline ? "default" : "ghost"}
                onClick={() => setTextFormatting((prev) => ({ ...prev, underline: !prev.underline }))}
              >
                <Underline className="h-4 w-4" />
              </Button>

              <div className="h-6 border-r border-border mx-1"></div>

              <Button
                size="sm"
                variant={textFormatting.align === "left" ? "default" : "ghost"}
                onClick={() => setTextFormatting((prev) => ({ ...prev, align: "left" }))}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={textFormatting.align === "center" ? "default" : "ghost"}
                onClick={() => setTextFormatting((prev) => ({ ...prev, align: "center" }))}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={textFormatting.align === "right" ? "default" : "ghost"}
                onClick={() => setTextFormatting((prev) => ({ ...prev, align: "right" }))}
              >
                <AlignRight className="h-4 w-4" />
              </Button>

              <div className="h-6 border-r border-border mx-1"></div>

              <Input
                type="color"
                value={textFormatting.color}
                onChange={(e) => setTextFormatting((prev) => ({ ...prev, color: e.target.value }))}
                className="w-12 h-8 p-1"
              />

              <Input
                type="number"
                value={textFormatting.fontSize}
                onChange={(e) => setTextFormatting((prev) => ({ ...prev, fontSize: Number.parseInt(e.target.value) }))}
                className="w-16 h-8"
                min="8"
                max="72"
              />
            </div>

            <Textarea
              value={richTextContent}
              onChange={(e) => setRichTextContent(e.target.value)}
              className="min-h-[300px]"
              placeholder="Enter your text here..."
              style={{
                fontWeight: textFormatting.bold ? "bold" : "normal",
                fontStyle: textFormatting.italic ? "italic" : "normal",
                textDecoration: textFormatting.underline ? "underline" : "none",
                textAlign: textFormatting.align,
                color: textFormatting.color,
                fontSize: `${textFormatting.fontSize}px`,
                fontFamily: textFormatting.fontFamily,
              }}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRichTextDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRichTextSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">Drag and drop an image here, or click to select</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleImageUpload(file)
                  }
                }}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>Select Image</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
