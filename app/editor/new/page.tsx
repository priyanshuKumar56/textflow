import { RichTextEditorDemo } from "@/components/tiptap/rich-text-editor"

export default function NewEditorPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">New Document</h1>
        <p className="text-muted-foreground">Create a new document using the rich text editor</p>
      </div>

      <div className="rounded-lg border bg-card p-4 md:p-6">
        <RichTextEditorDemo />
      </div>
    </div>
  )
}
