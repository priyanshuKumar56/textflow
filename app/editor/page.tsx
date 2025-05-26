import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Plus } from "lucide-react"

export default function EditorPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rich Text Editor</h1>
        <Link href="/editor/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">No documents yet</h2>
        <p className="mb-6 text-muted-foreground">
          Create your first document to get started with the rich text editor.
        </p>
        <Link href="/editor/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Document
          </Button>
        </Link>
      </div>
    </div>
  )
}
