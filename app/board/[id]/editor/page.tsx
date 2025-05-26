"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import  {RichTextEditorDemo}  from "@/components/tiptap/rich-text-editor"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, FileDown } from "lucide-react"
import Link from "next/link"

export default function BoardEditorPage() {
  const params = useParams()
  const router = useRouter()
  const boardId = params.id as string
  const boards = useAppSelector((state) => state.boards.boards)
  const [board, setBoard] = useState<any>(null)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Find the board with the matching ID
    const foundBoard = boards.find((b) => b.id === boardId)
    setBoard(foundBoard)

    // Load saved content from localStorage if available
    const savedContent = localStorage.getItem(`board-editor-${boardId}`)
    if (savedContent) {
      setContent(savedContent)
    }

    setLoading(false)
  }, [boardId, boards])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleSave = () => {
    setIsSaving(true)
    // Save content to localStorage
    localStorage.setItem(`board-editor-${boardId}`, content)

    // Simulate saving to server
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const handleExportToCanvas = () => {
    // In a real app, this would convert the rich text content to canvas elements
    router.push(`/board/${boardId}`)
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
            <Link href={`/board/${boardId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Canvas
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">{board.name} - Rich Text Editor</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleExportToCanvas}>
              <FileDown className="h-4 w-4 mr-1" />
              Export to Canvas
            </Button>

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
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-muted/20 p-4">
        <div className="container mx-auto">
          <div className="bg-background rounded-md shadow-sm">
            <RichTextEditorDemo
              // content={content}
              // onChange={handleContentChange}
              // placeholder={`Start writing about ${board.name}...`}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
