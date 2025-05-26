"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, Layout, Calendar, ArrowRight } from "lucide-react"

export function LandingHero() {
  const [activeTab, setActiveTab] = useState<"editor" | "whiteboard" | "calendar">("editor")

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your ideas, beautifully connected
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            TextFlow combines powerful text editing with visual thinking tools to help you capture, organize, and
            connect your ideas in one seamless workspace.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/alldashboard">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="mt-20">
          <div className="mx-auto max-w-3xl">
            <div className="flex justify-center space-x-4 mb-8">
              <Button
                variant={activeTab === "editor" ? "default" : "outline"}
                onClick={() => setActiveTab("editor")}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Rich Text
              </Button>
              <Button
                variant={activeTab === "whiteboard" ? "default" : "outline"}
                onClick={() => setActiveTab("whiteboard")}
                className="gap-2"
              >
                <Layout className="h-4 w-4" />
                Whiteboard
              </Button>
              <Button
                variant={activeTab === "calendar" ? "default" : "outline"}
                onClick={() => setActiveTab("calendar")}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
            </div>

            <motion.div
              className="relative overflow-hidden rounded-xl border bg-background shadow-xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              {activeTab === "editor" && (
                <div className="aspect-video bg-card p-4">
                  <div className="flex h-full flex-col rounded-lg border">
                    <div className="flex items-center border-b px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="mx-auto text-sm font-medium">Rich Text Editor</div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="mb-4 flex items-center space-x-2 border-b pb-2">
                        <button className="rounded-md p-1 hover:bg-muted">
                          <strong className="text-sm">B</strong>
                        </button>
                        <button className="rounded-md p-1 hover:bg-muted">
                          <em className="text-sm">I</em>
                        </button>
                        <button className="rounded-md p-1 hover:bg-muted">
                          <span className="text-sm underline">U</span>
                        </button>
                        <span className="mx-1 h-4 w-px bg-border"></span>
                        <button className="rounded-md p-1 hover:bg-muted">
                          <span className="text-sm">H1</span>
                        </button>
                        <button className="rounded-md p-1 hover:bg-muted">
                          <span className="text-sm">H2</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl font-bold">Project Overview</h2>
                        <p className="text-sm text-muted-foreground">
                          This document outlines our strategy for the upcoming product launch. We'll cover marketing,
                          development timelines, and resource allocation.
                        </p>
                        <ul className="ml-5 list-disc text-sm">
                          <li>Complete feature development by June 15</li>
                          <li>Begin beta testing with select customers</li>
                          <li>Prepare marketing materials and press releases</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "whiteboard" && (
                <div className="aspect-video bg-card p-4">
                  <div className="flex h-full flex-col rounded-lg border">
                    <div className="flex items-center border-b px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="mx-auto text-sm font-medium">Visual Whiteboard</div>
                    </div>
                    <div className="flex-1 p-4 bg-grid-pattern">
                      <div className="flex h-full items-center justify-center">
                        <div className="relative">
                          <div className="absolute -left-32 -top-20 rounded-lg border bg-yellow-100 p-3 shadow-md">
                            <p className="text-sm font-medium">Product Vision</p>
                          </div>
                          <div className="absolute -right-32 -top-10 rounded-lg border bg-blue-100 p-3 shadow-md">
                            <p className="text-sm font-medium">Development</p>
                          </div>
                          <div className="absolute -left-36 top-20 rounded-lg border bg-green-100 p-3 shadow-md">
                            <p className="text-sm font-medium">Marketing</p>
                          </div>
                          <div className="absolute -right-28 top-24 rounded-lg border bg-purple-100 p-3 shadow-md">
                            <p className="text-sm font-medium">Launch</p>
                          </div>
                          <div className="rounded-lg border bg-white p-4 shadow-lg">
                            <p className="font-bold">Project Roadmap</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "calendar" && (
                <div className="aspect-video bg-card p-4">
                  <div className="flex h-full flex-col rounded-lg border">
                    <div className="flex items-center border-b px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="mx-auto text-sm font-medium">Task Calendar</div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                        <div>Sun</div>
                      </div>
                      <div className="mt-1 grid grid-cols-7 gap-1">
                        {Array.from({ length: 35 }).map((_, i) => (
                          <div key={i} className="aspect-square rounded border p-1 text-xs">
                            {i + 1}
                            {i === 8 && <div className="mt-1 rounded bg-blue-100 px-1 py-0.5 text-[10px]">Meeting</div>}
                            {i === 15 && (
                              <div className="mt-1 rounded bg-green-100 px-1 py-0.5 text-[10px]">Deadline</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
