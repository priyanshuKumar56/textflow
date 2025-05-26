import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  type: string
  color: string
  attachments: Array<{
    type: string
    id: string
  }>
  reminder: number
  isAllDay: boolean
  recurrence: string | null
  location: string
  calendar: string
}

interface Calendar {
  id: string
  name: string
  color: string
}

interface CalendarState {
  events: Event[]
  selectedDate: string
  view: string
  calendars: Calendar[]
  selectedCalendars: string[]
  currentMonth: number
  currentYear: number
}

const today = new Date()
const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

const initialState: CalendarState = {
  events: [],
  selectedDate: formattedToday,
  view: "month",
  calendars: [
    { id: "academic", name: "Academic", color: "#4f46e5" },
    { id: "personal", name: "Personal", color: "#10b981" },
    { id: "work", name: "Work", color: "#ef4444" },
  ],
  selectedCalendars: ["academic", "personal", "work"],
  currentMonth: today.getMonth(),
  currentYear: today.getFullYear(),
}

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload)
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex((event) => event.id === action.payload.id)
      if (index !== -1) {
        state.events[index] = action.payload
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((event) => event.id !== action.payload)
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
    },
    setView: (state, action: PayloadAction<string>) => {
      state.view = action.payload
    },
    toggleCalendarVisibility: (state, action: PayloadAction<string>) => {
      const calendarId = action.payload
      if (state.selectedCalendars.includes(calendarId)) {
        state.selectedCalendars = state.selectedCalendars.filter((id) => id !== calendarId)
      } else {
        state.selectedCalendars.push(calendarId)
      }
    },
    setCurrentMonth: (state, action: PayloadAction<number>) => {
      state.currentMonth = action.payload
    },
    setCurrentYear: (state, action: PayloadAction<number>) => {
      state.currentYear = action.payload
    },
  },
})

export const {
  addEvent,
  updateEvent,
  deleteEvent,
  setSelectedDate,
  setView,
  toggleCalendarVisibility,
  setCurrentMonth,
  setCurrentYear,
} = calendarSlice.actions

export default calendarSlice.reducer
