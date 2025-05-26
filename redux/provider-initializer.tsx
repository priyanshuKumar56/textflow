"use client"

import { useRef } from "react"
import { store } from "./store"
import { setCurrentMonth, setCurrentYear, setSelectedDate } from "./features/calendarSlice"

// This component initializes the Redux store with default values
// It's useful for client components that need to access the store immediately
export function ReduxInitializer() {
  const initialized = useRef(false)

  if (!initialized.current) {
    const today = new Date()
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate(),
    ).padStart(2, "0")}`

    // Initialize store with current date
    store.dispatch(setSelectedDate(formattedToday))
    store.dispatch(setCurrentMonth(today.getMonth()))
    store.dispatch(setCurrentYear(today.getFullYear()))

    initialized.current = true
  }

  return null
}
