"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Star,
  FileLineChart,
  GitBranch,
  Layout,
  StickyNote,
  MapIcon as Diagram,
  Pencil,
  Trash2,
  Copy,
  Info,
  Archive,
} from "lucide-react"
import type { Board } from "@/lib/features/boards/boardsSlice"

interface BoardsListProps {
  boards: Board[]
  viewMode: "grid" | "list"
  onBoardClick: (id: string) => void
  onRenameClick: (id: string) => void
  onDeleteClick: (id: string) => void
  onStarClick: (id: string) => void
  onDuplicateClick: (id: string) => void
  onDetailsClick: (id: string) => void
  onArchiveClick?: (id: string) => void
}

export function BoardsList({
  boards = [], // Provide default empty array
  viewMode,
  onBoardClick,
  onRenameClick,
  onDeleteClick,
  onStarClick,
  onDuplicateClick,
  onDetailsClick,
  onArchiveClick,
}: BoardsListProps) {
  const [hoveredBoardId, setHoveredBoardId] = useState<string | null>(null)

  const getBoardTypeIcon = (type: string) => {
    switch (type) {
      case "flowchart":
        return <FileLineChart className="h-4 w-4 text-blue-500" />
      case "mindmap":
        return <GitBranch className="h-4 w-4 text-purple-500" />
      case "wireframe":
        return <Layout className="h-4 w-4 text-gray-500" />
      case "notes":
        return <StickyNote className="h-4 w-4 text-yellow-500" />
      case "diagram":
        return <Diagram className="h-4 w-4 text-green-500" />
      default:
        return <FileLineChart className="h-4 w-4 text-blue-500" />
    }
  }

  const getBoardTypeName = (type: string) => {
    switch (type) {
      case "flowchart":
        return "Flowchart"
      case "mindmap":
        return "Mind Map"
      case "wireframe":
        return "Wireframe"
      case "notes":
        return "Sticky Notes"
      case "diagram":
        return "Diagram"
      default:
        return "Flowchart"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {boards.map((board) => (
          <Card
            key={board.id}
            className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
            onMouseEnter={() => setHoveredBoardId(board.id)}
            onMouseLeave={() => setHoveredBoardId(null)}
          >
            <div
              className="h-40 bg-gray-100 dark:bg-gray-800 relative cursor-pointer"
              onClick={() => onBoardClick(board.id)}
            >
              {board.thumbnail ? (
                <img
                  src={board.thumbnail || "/placeholder.svg"}
                  alt={board.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                  {getBoardTypeIcon(board.boardType)}
                </div>
              )}

              {/* Star button */}
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-2 left-2 h-8 w-8 ${
                  board.starred || hoveredBoardId === board.id ? "opacity-100" : "opacity-0"
                } transition-opacity`}
                onClick={(e) => {
                  e.stopPropagation()
                  onStarClick(board.id)
                }}
              >
                <Star className={`h-5 w-5 ${board.starred ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`} />
              </Button>
            </div>

            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className="font-medium text-lg mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1"
                    onClick={() => onBoardClick(board.id)}
                  >
                    {board.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {board.description || "No description"}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onRenameClick(board.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicateClick(board.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Duplicate</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStarClick(board.id)}>
                      <Star className={`mr-2 h-4 w-4 ${board.starred ? "fill-yellow-400" : ""}`} />
                      <span>{board.starred ? "Unstar" : "Star"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDetailsClick(board.id)}>
                      <Info className="mr-2 h-4 w-4" />
                      <span>Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {onArchiveClick && (
                      <DropdownMenuItem onClick={() => onArchiveClick(board.id)}>
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Archive</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDeleteClick(board.id)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                {getBoardTypeIcon(board.boardType)}
                <span className="ml-1">{getBoardTypeName(board.boardType)}</span>
              </div>

              <div className="flex flex-wrap gap-1 justify-end">
                {board.tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {(board.tags?.length || 0) > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{(board.tags?.length || 0) - 2}
                  </Badge>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {boards.map((board) => (
        <div
          key={board.id}
          className="flex items-center p-3 rounded-md border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
          onMouseEnter={() => setHoveredBoardId(board.id)}
          onMouseLeave={() => setHoveredBoardId(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mr-2"
            onClick={(e) => {
              e.stopPropagation()
              onStarClick(board.id)
            }}
          >
            <Star className={`h-4 w-4 ${board.starred ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`} />
          </Button>

          <div className="flex-1 cursor-pointer" onClick={() => onBoardClick(board.id)}>
            <div className="flex items-center">
              <h3 className="font-medium">{board.name}</h3>
              <div className="ml-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                {getBoardTypeIcon(board.boardType)}
                <span className="ml-1">{getBoardTypeName(board.boardType)}</span>
              </div>
            </div>
            {board.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{board.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            <div className="flex flex-wrap gap-1 justify-end">
              {board.tags?.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {(board.tags?.length || 0) > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{(board.tags?.length || 0) - 3}
                </Badge>
              )}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(board.updatedAt)}</div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onRenameClick(board.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicateClick(board.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStarClick(board.id)}>
                  <Star className={`mr-2 h-4 w-4 ${board.starred ? "fill-yellow-400" : ""}`} />
                  <span>{board.starred ? "Unstar" : "Star"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDetailsClick(board.id)}>
                  <Info className="mr-2 h-4 w-4" />
                  <span>Details</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {onArchiveClick && (
                  <DropdownMenuItem onClick={() => onArchiveClick(board.id)}>
                    <Archive className="mr-2 h-4 w-4" />
                    <span>Archive</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDeleteClick(board.id)} className="text-red-600 dark:text-red-400">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
