import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Layout, Calendar } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/editor/new">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              New Document
            </Button>
          </Link>
          <Link href="/whiteboard/new">
            <Button variant="outline" className="gap-2">
              <Layout className="h-4 w-4" />
              New Whiteboard
            </Button>
          </Link>
          <Link href="/calendar/new">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              New Calendar
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Rich Text Editor"
          description="Create and edit documents with our powerful WYSIWYG editor."
          icon={<FileText className="h-8 w-8" />}
          href="/editor"
          buttonText="Open Editor"
        />
        <DashboardCard
          title="Visual Whiteboard"
          description="Create mind maps, flowcharts, and diagrams with our visual whiteboard."
          icon={<Layout className="h-8 w-8" />}
          href="/dashboard"
          buttonText="Open Whiteboard"
          // comingSoon
        />
        <DashboardCard
          title="Task Calendar"
          description="Organize your tasks and schedule with our visual calendar."
          icon={<Calendar className="h-8 w-8" />}
          href="/calendar"
          buttonText="Open Calendar"
          // comingSoon
        />
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Recent Documents</h2>
        <div className="rounded-lg border">
          <div className="flex items-center border-b px-6 py-3 font-medium">
            <div className="flex-1">Name</div>
            <div className="w-32 text-right">Last Modified</div>
            <div className="w-24 text-right">Actions</div>
          </div>
          <div className="p-4 text-center text-muted-foreground">
            <p>No recent documents</p>
            <Link href="/editor/new">
              <Button variant="link" className="mt-2">
                Create your first document
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  description,
  icon,
  href,
  buttonText,
  comingSoon = false,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  buttonText: string
  comingSoon?: boolean
}) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">{icon}</div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="mb-4 text-muted-foreground">{description}</p>
      {comingSoon ? (
        <div className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          Coming Soon
        </div>
      ) : (
        <Link href={href}>
          <Button>{buttonText}</Button>
        </Link>
      )}
    </div>
  )
}
