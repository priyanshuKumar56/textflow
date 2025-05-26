"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  addBoard,
  updateBoard,
  deleteBoard,
  toggleStarBoard,
  duplicateBoard,
  setSearchQuery,
  setSortBy,
  setFilterTags,
  setFilterBoardType,
  setFilterStarred,
  clearFilters,
} from "@/lib/features/boards/boardsSlice"
import { BoardsList } from "@/components/dashboard/boards-list"
import { CreateBoardDialog } from "@/components/dashboard/create-board-dialog"
import { RenameBoardDialog } from "@/components/dashboard/rename-board-dialog"
import { DeleteBoardDialog } from "@/components/dashboard/delete-board-dialog"
import { BoardDetailsDialog } from "@/components/dashboard/board-details-dialog"
import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Grid,
  List,
  SlidersHorizontal,
  Star,
  FileLineChart,
  GitBranch,
  Layout,
  StickyNote,
  MapIcon as Diagram,
  X,
  ChevronDown,
  Calendar,
} from "lucide-react"
import Link from "next/link"

export function DashboardPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  // Get boards from Redux store
  const { boards, searchQuery, sortBy, sortDirection, filterTags, filterBoardType, filterStarred } = useAppSelector(
    (state) => state.boards,
  )

  // Local state for UI
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)
  const [allTags, setAllTags] = useState<string[]>([])

  // Extract all unique tags from boards
  useEffect(() => {
    const tags = new Set<string>()
    boards.forEach((board) => {
      board.tags?.forEach((tag) => tags.add(tag))
    })
    setAllTags(Array.from(tags))
  }, [boards])

  // Get the selected board
  const selectedBoard = selectedBoardId ? boards.find((board) => board.id === selectedBoardId) : null

  // Filter and sort boards
  const filteredBoards = boards
    .filter((board) => {
      // Search query filter
      if (
        searchQuery &&
        !board.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !board.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Tags filter
      if (filterTags.length > 0 && (!board.tags || !filterTags.every((tag) => board.tags.includes(tag)))) {
        return false
      }

      // Board type filter
      if (filterBoardType && board.boardType !== filterBoardType) {
        return false
      }

      // Starred filter
      if (filterStarred && !board.starred) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else {
        const dateA = new Date(a[sortBy] || 0).getTime()
        const dateB = new Date(b[sortBy] || 0).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      }
    })

  // Handlers
  const handleCreateBoard = (data: {
    name: string
    description?: string
    boardType: "flowchart" | "mindmap" | "wireframe" | "notes" | "diagram"
    tags?: string[]
  }) => {
    dispatch(addBoard(data))
    setIsCreateDialogOpen(false)
  }

  const handleRenameBoard = (name: string, description?: string) => {
    if (selectedBoardId) {
      dispatch(
        updateBoard({
          id: selectedBoardId,
          name,
          description,
        }),
      )
      setIsRenameDialogOpen(false)
    }
  }

  const handleDeleteBoard = () => {
    if (selectedBoardId) {
      dispatch(deleteBoard({ id: selectedBoardId }))
      setIsDeleteDialogOpen(false)
    }
  }

  const handleUpdateBoard = (data: {
    id: string
    name?: string
    description?: string
    tags?: string[]
    boardType?: "flowchart" | "mindmap" | "wireframe" | "notes" | "diagram"
  }) => {
    dispatch(updateBoard(data))
    setIsDetailsDialogOpen(false)
  }

  const handleBoardClick = (id: string) => {
    router.push(`/board/${id}`)
  }

  const handleRenameClick = (id: string) => {
    setSelectedBoardId(id)
    setIsRenameDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setSelectedBoardId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleStarClick = (id: string) => {
    dispatch(toggleStarBoard({ id }))
  }

  const handleDuplicateClick = (id: string) => {
    dispatch(duplicateBoard({ id }))
  }

  const handleDetailsClick = (id: string) => {
    setSelectedBoardId(id)
    setIsDetailsDialogOpen(true)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  }

  const handleSortChange = (
    sortOption: "name" | "updatedAt" | "createdAt" | "lastOpenedAt",
    direction: "asc" | "desc",
  ) => {
    dispatch(setSortBy({ sortBy: sortOption, sortDirection: direction }))
  }

  const handleToggleTagFilter = (tag: string) => {
    const newTags = filterTags.includes(tag) ? filterTags.filter((t) => t !== tag) : [...filterTags, tag]
    dispatch(setFilterTags(newTags))
  }

  const handleSetBoardTypeFilter = (type: string | null) => {
    dispatch(setFilterBoardType(type))
  }

  const handleToggleStarredFilter = () => {
    dispatch(setFilterStarred(!filterStarred))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Whimsical Clone</h1>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href="/calendar">
              <Button variant="outline" size="sm" className="ml-2">
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search boards..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => dispatch(setSearchQuery(""))}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            {/* View mode toggle */}
            <div className="border rounded-md overflow-hidden">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
                <TabsList className="bg-transparent">
                  <TabsTrigger value="grid" className="data-[state=active]:bg-muted">
                    <Grid className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" className="data-[state=active]:bg-muted">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  Sort
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={sortBy === "name" && sortDirection === "asc"}
                  onCheckedChange={() => handleSortChange("name", "asc")}
                >
                  Name (A-Z)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "name" && sortDirection === "desc"}
                  onCheckedChange={() => handleSortChange("name", "desc")}
                >
                  Name (Z-A)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "updatedAt" && sortDirection === "desc"}
                  onCheckedChange={() => handleSortChange("updatedAt", "desc")}
                >
                  Last updated
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "createdAt" && sortDirection === "desc"}
                  onCheckedChange={() => handleSortChange("createdAt", "desc")}
                >
                  Recently created
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "lastOpenedAt" && sortDirection === "desc"}
                  onCheckedChange={() => handleSortChange("lastOpenedAt", "desc")}
                >
                  Recently opened
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  {(filterTags.length > 0 || filterBoardType || filterStarred) && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1">
                      {filterTags.length + (filterBoardType ? 1 : 0) + (filterStarred ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuLabel className="font-normal text-xs text-muted-foreground mt-2">
                  Board Type
                </DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={filterBoardType === "flowchart"}
                  onCheckedChange={() => handleSetBoardTypeFilter(filterBoardType === "flowchart" ? null : "flowchart")}
                >
                  <FileLineChart className="mr-2 h-4 w-4 text-blue-500" />
                  Flowchart
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterBoardType === "mindmap"}
                  onCheckedChange={() => handleSetBoardTypeFilter(filterBoardType === "mindmap" ? null : "mindmap")}
                >
                  <GitBranch className="mr-2 h-4 w-4 text-purple-500" />
                  Mind Map
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterBoardType === "wireframe"}
                  onCheckedChange={() => handleSetBoardTypeFilter(filterBoardType === "wireframe" ? null : "wireframe")}
                >
                  <Layout className="mr-2 h-4 w-4 text-gray-500" />
                  Wireframe
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterBoardType === "notes"}
                  onCheckedChange={() => handleSetBoardTypeFilter(filterBoardType === "notes" ? null : "notes")}
                >
                  <StickyNote className="mr-2 h-4 w-4 text-yellow-500" />
                  Sticky Notes
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterBoardType === "diagram"}
                  onCheckedChange={() => handleSetBoardTypeFilter(filterBoardType === "diagram" ? null : "diagram")}
                >
                  <Diagram className="mr-2 h-4 w-4 text-green-500" />
                  Diagram
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator />

                <DropdownMenuCheckboxItem checked={filterStarred} onCheckedChange={handleToggleStarredFilter}>
                  <Star className="mr-2 h-4 w-4 text-yellow-400" />
                  Starred
                </DropdownMenuCheckboxItem>

                {allTags.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">Tags</DropdownMenuLabel>
                    {allTags.map((tag) => (
                      <DropdownMenuCheckboxItem
                        key={tag}
                        checked={filterTags.includes(tag)}
                        onCheckedChange={() => handleToggleTagFilter(tag)}
                      >
                        {tag}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </>
                )}

                {(filterTags.length > 0 || filterBoardType || filterStarred) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleClearFilters} className="justify-center text-center">
                      Clear all filters
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Create board button */}
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Board
            </Button>
          </div>
        </div>

        {/* Active filters display */}
        {(filterTags.length > 0 || filterBoardType || filterStarred) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filterStarred && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                Starred
                <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={handleToggleStarredFilter}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {filterBoardType && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filterBoardType === "flowchart" && <FileLineChart className="h-3 w-3 text-blue-500" />}
                {filterBoardType === "mindmap" && <GitBranch className="h-3 w-3 text-purple-500" />}
                {filterBoardType === "wireframe" && <Layout className="h-3 w-3 text-gray-500" />}
                {filterBoardType === "notes" && <StickyNote className="h-3 w-3 text-yellow-500" />}
                {filterBoardType === "diagram" && <Diagram className="h-3 w-3 text-green-500" />}
                {filterBoardType.charAt(0).toUpperCase() + filterBoardType.slice(1)}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => handleSetBoardTypeFilter(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {filterTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => handleToggleTagFilter(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={handleClearFilters}>
              Clear all
            </Button>
          </div>
        )}

        {/* Boards list */}
        {filteredBoards.length > 0 ? (
          <BoardsList
            boards={filteredBoards}
            viewMode={viewMode}
            onBoardClick={handleBoardClick}
            onRenameClick={handleRenameClick}
            onDeleteClick={handleDeleteClick}
            onStarClick={handleStarClick}
            onDuplicateClick={handleDuplicateClick}
            onDetailsClick={handleDetailsClick}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted rounded-full p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No boards found</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              {searchQuery || filterTags.length > 0 || filterBoardType || filterStarred
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Create your first board to get started."}
            </p>
            {(searchQuery || filterTags.length > 0 || filterBoardType || filterStarred) && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear filters
              </Button>
            )}
            {!searchQuery && filterTags.length === 0 && !filterBoardType && !filterStarred && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Board
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Dialogs */}
      <CreateBoardDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateBoard={handleCreateBoard}
      />

      {selectedBoard && (
        <>
          <RenameBoardDialog
            isOpen={isRenameDialogOpen}
            onClose={() => setIsRenameDialogOpen(false)}
            onRenameBoard={handleRenameBoard}
            currentName={selectedBoard.name}
            currentDescription={selectedBoard.description}
          />

          <DeleteBoardDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onDeleteBoard={handleDeleteBoard}
            boardName={selectedBoard.name}
          />

          <BoardDetailsDialog
            isOpen={isDetailsDialogOpen}
            onClose={() => setIsDetailsDialogOpen(false)}
            onUpdateBoard={handleUpdateBoard}
            board={selectedBoard}
          />
        </>
      )}
    </div>
  )
}
