"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import  CalendarView  from "@/components/calendar/calendar-view"
import { Button } from "@/components/ui/button"
import { ReduxInitializer } from "@/redux/provider-initializer"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CalendarPage() {
  return (
    // <Provider store={store}>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/alldashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Task Calendar</h1>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <ReduxInitializer/>
          <CalendarView />
        </main>
      </div>
    // </Provider>
  )
}
