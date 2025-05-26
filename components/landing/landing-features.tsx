import type React from "react"
import { FileText, Layout, Calendar, Zap, LinkIcon, Cloud, Users, Lock } from "lucide-react"

export function LandingFeatures() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">All the tools you need in one place</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            TextFlow combines powerful editing tools with visual thinking capabilities to help you organize your
            thoughts and boost productivity.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<FileText className="h-10 w-10" />}
              title="Rich Text Editor"
              description="A powerful WYSIWYG editor with advanced formatting, media embedding, and collaborative editing features."
            />
            <FeatureCard
              icon={<Layout className="h-10 w-10" />}
              title="Visual Whiteboard"
              description="Create mind maps, flowcharts, and diagrams with an intuitive visual interface inspired by Whimsical."
            />
            <FeatureCard
              icon={<Calendar className="h-10 w-10" />}
              title="Task Calendar"
              description="Organize your tasks, set deadlines, and manage your schedule with a visual calendar interface."
            />
            <FeatureCard
              icon={<LinkIcon className="h-10 w-10" />}
              title="Seamless Integration"
              description="Connect your content across all tools. Embed whiteboards in documents or link tasks to specific sections."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10" />}
              title="Boost Productivity"
              description="Switch between different views of your content to find the perfect workflow for any task."
            />
            <FeatureCard
              icon={<Cloud className="h-10 w-10" />}
              title="Cloud Sync"
              description="Your content is automatically saved and synced across all your devices in real-time."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Collaboration"
              description="Work together with your team in real-time with comments, suggestions, and shared editing."
            />
            <FeatureCard
              icon={<Lock className="h-10 w-10" />}
              title="Privacy & Security"
              description="Enterprise-grade security with end-to-end encryption and granular access controls."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">{icon}</div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
