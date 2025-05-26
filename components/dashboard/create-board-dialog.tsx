"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TagInput } from "@/components/ui/tag-input"
import { FileLineChart, GitBranch, Layout, StickyNote, MapIcon as Diagram } from "lucide-react"

interface CreateBoardDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateBoard: (data: {
    name: string
    description?: string
    boardType: "flowchart" | "mindmap" | "wireframe" | "notes" | "diagram"
    tags?: string[]
  }) => void
}

export function CreateBoardDialog({ isOpen, onClose, onCreateBoard }: CreateBoardDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [boardType, setBoardType] = useState<"flowchart" | "mindmap" | "wireframe" | "notes" | "diagram">("flowchart")
  const [tags, setTags] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onCreateBoard({
        name: name.trim(),
        description: description.trim() || undefined,
        boardType,
        tags: tags.length > 0 ? tags : undefined,
      })

      // Reset form
      setName("")
      setDescription("")
      setBoardType("flowchart")
      setTags([])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Board Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter board name"
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter board description"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="boardType">Board Type</Label>
              <Select value={boardType} onValueChange={(value: any) => setBoardType(value)}>
                <SelectTrigger id="boardType">
                  <SelectValue placeholder="Select board type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flowchart" className="flex items-center">
                    <div className="flex items-center">
                      <FileLineChart className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Flowchart</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="mindmap">
                    <div className="flex items-center">
                      <GitBranch className="h-4 w-4 mr-2 text-purple-500" />
                      <span>Mind Map</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="wireframe">
                    <div className="flex items-center">
                      <Layout className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Wireframe</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="notes">
                    <div className="flex items-center">
                      <StickyNote className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Sticky Notes</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="diagram">
                    <div className="flex items-center">
                      <Diagram className="h-4 w-4 mr-2 text-green-500" />
                      <span>Diagram</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <TagInput tags={tags} onTagsChange={setTags} placeholder="Add tags..." maxTags={10} />
              <p className="text-xs text-muted-foreground">Press Enter to add a tag. You can add up to 10 tags.</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create Board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
