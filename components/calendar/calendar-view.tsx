"use client"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  FileText,
  PenTool,
  Trash2,
  MapPin,
  Search,
  Menu,
  MoreVertical,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"

// Define types for our data structures
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

interface Document {
  id: string
  title: string
}

interface Whiteboard {
  id: string
  title: string
}

// Define the shape of our Redux state
interface CalendarState {
  events: Event[]
  selectedDate: string
  view: string
  calendars: Calendar[]
  selectedCalendars: string[]
  currentMonth: number
  currentYear: number
}

interface DocumentState {
  documents: Document[]
}

interface WhiteboardState {
  whiteboards: Whiteboard[]
}

// Define action creators
const addEvent = (event: Event) => ({
  type: "calendar/addEvent",
  payload: event,
})

const updateEvent = (event: Event) => ({
  type: "calendar/updateEvent",
  payload: event,
})

const deleteEvent = (id: string) => ({
  type: "calendar/deleteEvent",
  payload: id,
})

const setSelectedDate = (date: string) => ({
  type: "calendar/setSelectedDate",
  payload: date,
})

const setView = (view: string) => ({
  type: "calendar/setView",
  payload: view,
})

const toggleCalendarVisibility = (calendarId: string) => ({
  type: "calendar/toggleCalendarVisibility",
  payload: calendarId,
})

const setCurrentMonth = (month: number) => ({
  type: "calendar/setCurrentMonth",
  payload: month,
})

const setCurrentYear = (year: number) => ({
  type: "calendar/setCurrentYear",
  payload: year,
})

const addNotification = (notification: {
  id: number
  title: string
  message: string
  type: string
}) => ({
  type: "notifications/addNotification",
  payload: notification,
})

const CalendarView = memo(function CalendarView() {
  const dispatch = useAppDispatch()
  const { events, selectedDate, view, calendars, selectedCalendars, currentMonth, currentYear } = useAppSelector((state) => state.calendar,)
  const { documents } = useAppSelector((state) => state.documents)
  const { whiteboards } = useAppSelector((state) => state.whiteboard)

  const [showEventDialog, setShowEventDialog] = useState<boolean>(false)
  const [showSidebar, setShowSidebar] = useState<boolean>(true)
  const [newEvent, setNewEvent] = useState<Event>({
    id: "",
    title: "",
    description: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    type: "study",
    color: "#4f46e5",
    attachments: [],
    reminder: 15,
    isAllDay: false,
    recurrence: null,
    location: "",
    calendar: "academic",
  })
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [showMiniCalendar, setShowMiniCalendar] = useState<boolean>(true)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [showEventMenu, setShowEventMenu] = useState<string | null>(null)
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [isResizing, setIsResizing] = useState<boolean>(false)

  // Get days in month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay()
  }

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const d = new Date(date)
    let month = "" + (d.getMonth() + 1)
    let day = "" + d.getDate()
    const year = d.getFullYear()

    if (month.length < 2) month = "0" + month
    if (day.length < 2) day = "0" + day

    return [year, month, day].join("-")
  }

  // Parse date from YYYY-MM-DD
  const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  // Check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
  }

  // Get events for a specific date
  const getEventsForDate = useMemo(
    () =>
      (date: Date): Event[] => {
        return events
          .filter((event) => isSameDay(parseDate(event.date), date) && selectedCalendars.includes(event.calendar))
          .sort((a, b) => {
            if (a.isAllDay && !b.isAllDay) return -1
            if (!a.isAllDay && b.isAllDay) return 1
            return a.startTime.localeCompare(b.startTime)
          })
      },
    [events, selectedCalendars],
  )

  // Get month name
  const getMonthName = (month: number): string => {
    return new Date(2000, month, 1).toLocaleString("default", {
      month: "long",
    })
  }

  // Handle month navigation
  const handlePrevMonth = (): void => {
    let newMonth = currentMonth - 1
    let newYear = currentYear

    if (newMonth < 0) {
      newMonth = 11
      newYear -= 1
    }

    dispatch(setCurrentMonth(newMonth))
    dispatch(setCurrentYear(newYear))
  }

  const handleNextMonth = (): void => {
    let newMonth = currentMonth + 1
    let newYear = currentYear

    if (newMonth > 11) {
      newMonth = 0
      newYear += 1
    }

    dispatch(setCurrentMonth(newMonth))
    dispatch(setCurrentYear(newYear))
  }

  // Handle week navigation
  const handlePrevWeek = (): void => {
    const date = parseDate(selectedDate)
    date.setDate(date.getDate() - 7)
    dispatch(setSelectedDate(formatDate(date)))
  }

  const handleNextWeek = (): void => {
    const date = parseDate(selectedDate)
    date.setDate(date.getDate() + 7)
    dispatch(setSelectedDate(formatDate(date)))
  }

  // Handle day navigation
  const handlePrevDay = (): void => {
    const date = parseDate(selectedDate)
    date.setDate(date.getDate() - 1)
    dispatch(setSelectedDate(formatDate(date)))
  }

  const handleNextDay = (): void => {
    const date = parseDate(selectedDate)
    date.setDate(date.getDate() + 1)
    dispatch(setSelectedDate(formatDate(date)))
  }

  // Handle date selection
  const handleDateClick = useCallback(
    (date: Date): void => {
      dispatch(setSelectedDate(formatDate(date)))
      setSelectedDateEvents(getEventsForDate(date))
    },
    [dispatch, getEventsForDate],
  )

  // Handle new event
  const handleAddEvent = useCallback(
    (date: Date | null = null): void => {
      setIsEditMode(false)
      setNewEvent({
        id: "",
        title: "",
        description: "",
        date: date ? formatDate(date) : selectedDate || formatDate(new Date()),
        startTime: "09:00",
        endTime: "10:00",
        type: "study",
        color: calendars.find((cal) => cal.id === "academic")?.color || "#4f46e5",
        attachments: [],
        reminder: 15,
        isAllDay: false,
        recurrence: null,
        location: "",
        calendar: "academic",
      })
      setShowEventDialog(true)
    },
    [selectedDate, calendars],
  )

  // Handle edit event
  const handleEditEvent = useCallback((event: Event): void => {
    setIsEditMode(true)
    setNewEvent({
      ...event,
      attachments: event.attachments || [],
    })
    setShowEventDialog(true)
  }, [])

  // Handle save event
  const handleSaveEvent = useCallback((): void => {
    if (!newEvent.title.trim()) {
      dispatch(
        addNotification({
          id: Date.now(),
          title: "Error",
          message: "Event title is required",
          type: "error",
        }),
      )
      return
    }

    if (isEditMode) {
      dispatch(updateEvent(newEvent))
      dispatch(
        addNotification({
          id: Date.now(),
          title: "Event Updated",
          message: `"${newEvent.title}" has been updated`,
          type: "success",
        }),
      )
    } else {
      dispatch(
        addEvent({
          ...newEvent,
          id: Date.now().toString(),
        }),
      )
      dispatch(
        addNotification({
          id: Date.now(),
          title: "Event Added",
          message: `"${newEvent.title}" has been added to your calendar`,
          type: "success",
        }),
      )
    }

    setShowEventDialog(false)
    setSelectedDateEvents(getEventsForDate(parseDate(newEvent.date)))
  }, [dispatch, newEvent, isEditMode, getEventsForDate])

  // Handle delete event
  const handleDeleteEvent = useCallback((): void => {
    dispatch(deleteEvent(newEvent.id))
    dispatch(
      addNotification({
        id: Date.now(),
        title: "Event Deleted",
        message: `"${newEvent.title}" has been deleted`,
        type: "info",
      }),
    )
    setShowEventDialog(false)
    setSelectedDateEvents(getEventsForDate(parseDate(newEvent.date)))
  }, [dispatch, newEvent, getEventsForDate])

  // Handle attachment selection
  const handleAttachmentChange = useCallback(
    (type: string, id: string): void => {
      const attachments = [...newEvent.attachments]
      const existingIndex = attachments.findIndex((a) => a.id === id && a.type === type)

      if (existingIndex >= 0) {
        attachments.splice(existingIndex, 1)
      } else {
        attachments.push({ type, id })
      }

      setNewEvent({
        ...newEvent,
        attachments,
      })
    },
    [newEvent],
  )

  // Handle calendar selection
  const handleCalendarChange = useCallback(
    (calendarId: string): void => {
      setNewEvent({
        ...newEvent,
        calendar: calendarId,
        color: calendars.find((cal) => cal.id === calendarId)?.color || newEvent.color,
      })
    },
    [calendars, newEvent],
  )

  // Handle calendar visibility toggle
  const handleToggleCalendar = useCallback(
    (calendarId: string): void => {
      dispatch(toggleCalendarVisibility(calendarId))
    },
    [dispatch],
  )

  // Handle search
  const handleSearch = useCallback(
    (query: string): void => {
      setSearchQuery(query)
      if (!query.trim()) {
        setFilteredEvents([])
        return
      }

      const filtered = events.filter(
        (event) =>
          (event.title.toLowerCase().includes(query.toLowerCase()) ||
            event.description.toLowerCase().includes(query.toLowerCase())) &&
          selectedCalendars.includes(event.calendar),
      )
      setFilteredEvents(filtered)
    },
    [events, selectedCalendars],
  )

  // Handle "Today" button click
  const handleTodayClick = useCallback((): void => {
    const today = new Date()
    dispatch(setSelectedDate(formatDate(today)))
    dispatch(setCurrentMonth(today.getMonth()))
    dispatch(setCurrentYear(today.getFullYear()))
  }, [dispatch])

  // Handle event drag start
  const handleEventDragStart = useCallback((event: Event): void => {
    setDraggedEvent(event)
  }, [])

  // Handle event drop
  const handleEventDrop = useCallback(
    (date: Date): void => {
      if (draggedEvent) {
        const updatedEvent = {
          ...draggedEvent,
          date: formatDate(date),
        }
        dispatch(updateEvent(updatedEvent))
        setDraggedEvent(null)

        dispatch(
          addNotification({
            id: Date.now(),
            title: "Event Moved",
            message: `"${draggedEvent.title}" has been moved to ${formatDate(date)}`,
            type: "success",
          }),
        )
      }
    },
    [dispatch, draggedEvent],
  )

  // Update selected date events when events or selected date changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedDateEvents(getEventsForDate(parseDate(selectedDate)))
    }
  }, [events, selectedDate, selectedCalendars, getEventsForDate])

  // Update filtered events when search query changes
  useEffect(() => {
    handleSearch(searchQuery)
  }, [events, selectedCalendars, handleSearch, searchQuery])

  // Render mini calendar
  const renderMiniCalendar = () => {
    const year = currentYear
    const month = currentMonth
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)
    const today = new Date()

    // Create array of days
    const days: (Date | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">
            {getMonthName(month)} {year}
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handlePrevMonth}>
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleNextMonth}>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-xs">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="h-6 flex items-center justify-center font-medium text-muted-foreground">
              {day}
            </div>
          ))}

          {days.map((day, i) => {
            if (!day) {
              return <div key={`empty-${i}`} className="h-6" />
            }

            const isToday = isSameDay(day, today)
            const isSelected = selectedDate && isSameDay(day, parseDate(selectedDate))
            const hasEvents = events.some(
              (event) => isSameDay(parseDate(event.date), day) && selectedCalendars.includes(event.calendar),
            )

            return (
              <div
                key={i}
                className={`h-6 flex items-center justify-center text-xs cursor-pointer rounded-full
                  ${isToday ? "bg-primary text-primary-foreground" : ""}
                  ${isSelected ? "bg-primary/20 font-medium" : ""}
                  ${hasEvents && !isToday && !isSelected ? "font-medium" : ""}
                  hover:bg-muted`}
                onClick={() => handleDateClick(day)}
              >
                {day.getDate()}
                {hasEvents && !isToday && !isSelected && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render month view
  const renderMonthView = () => {
    const year = currentYear
    const month = currentMonth
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)
    const monthName = getMonthName(month)
    const today = new Date()

    // Create array of days
    const days: (Date | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {monthName} {year}
          </h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleTodayClick}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
            <div key={index} className="text-center font-medium py-2 text-muted-foreground">
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="h-24 bg-muted/20 rounded-md"></div>
            }

            const isToday = isSameDay(day, today)
            const isSelected = selectedDate && isSameDay(day, parseDate(selectedDate))
            const dayEvents = getEventsForDate(day)
            const isHovered = hoveredDate && isSameDay(day, hoveredDate)

            return (
              <div
                key={index}
                className={`h-24 p-1 border rounded-md overflow-hidden transition-colors cursor-pointer relative
                  ${isToday ? "border-primary" : "border-border"}
                  ${isSelected ? "bg-muted/50" : ""}
                  ${isHovered ? "bg-muted/30" : ""}
                  ${draggedEvent ? "hover:bg-muted/50" : "hover:bg-muted/20"}`}
                onClick={() => handleDateClick(day)}
                onMouseEnter={() => setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
                onDragOver={(e) => {
                  if (draggedEvent) {
                    e.preventDefault()
                    setHoveredDate(day)
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  handleEventDrop(day)
                }}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{day.getDate()}</span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <div
                      key={i}
                      className="text-xs truncate py-0.5 px-1.5 rounded-sm cursor-pointer"
                      style={{ backgroundColor: event.color + "33" }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditEvent(event)
                      }}
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation()
                        handleEventDragStart(event)
                      }}
                    >
                      {event.isAllDay ? (
                        <span className="font-medium">{event.title}</span>
                      ) : (
                        <>
                          <span className="inline-block w-8 text-muted-foreground">{event.startTime}</span>{" "}
                          {event.title}
                        </>
                      )}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
                {draggedEvent && isHovered && (
                  <div className="absolute inset-0 border-2 border-dashed border-primary rounded-md pointer-events-none"></div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render week view
  const renderWeekView = () => {
    // Get the start of the week (Sunday) based on selected date
    const selectedDateObj = parseDate(selectedDate)
    const startOfWeek = new Date(selectedDateObj)
    startOfWeek.setDate(selectedDateObj.getDate() - selectedDateObj.getDay())

    // Create array of days for the week
    const weekDays: Date[] = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      weekDays.push(day)
    }

    // Get month and year for display
    const startMonth = startOfWeek.toLocaleString("default", {
      month: "short",
    })
    const endMonth = weekDays[6].toLocaleString("default", { month: "short" })
    const startYear = startOfWeek.getFullYear()
    const endYear = weekDays[6].getFullYear()

    const weekTitle =
      startMonth === endMonth
        ? `${startMonth} ${startOfWeek.getDate()} - ${weekDays[6].getDate()}, ${startYear}`
        : `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${weekDays[6].getDate()}, ${startYear}`

    // Hours for the day
    const hours: number[] = []
    for (let i = 7; i < 22; i++) {
      hours.push(i)
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{weekTitle}</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleTodayClick}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Time column */}
          <div className="w-16 pr-2 flex flex-col">
            <div className="h-10"></div> {/* Header spacer */}
            {hours.map((hour) => (
              <div key={hour} className="h-16 text-xs text-muted-foreground flex items-start justify-end pr-2">
                {hour % 12 === 0 ? 12 : hour % 12}
                {hour < 12 ? "am" : "pm"}
              </div>
            ))}
          </div>

          {/* Days columns */}
          <div className="flex-1 grid grid-cols-7 gap-1">
            {/* Day headers */}
            {weekDays.map((day, index) => {
              const isToday = isSameDay(day, new Date())
              const isSelected = selectedDate && isSameDay(day, parseDate(selectedDate))

              return (
                <div
                  key={index}
                  className={`text-center p-2 cursor-pointer hover:bg-muted/50 ${
                    isToday ? "bg-primary/10 font-medium" : ""
                  } ${isSelected ? "bg-muted" : ""}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="text-xs">{day.toLocaleString("default", { weekday: "short" })}</div>
                  <div className={`text-sm ${isToday ? "text-primary font-bold" : ""}`}>{day.getDate()}</div>
                </div>
              )
            })}

            {/* Time grid */}
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="relative">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-t border-muted hover:bg-muted/20 cursor-pointer"
                    onClick={() => {
                      const newDate = new Date(day)
                      newDate.setHours(hour, 0, 0, 0)
                      handleDateClick(newDate)
                      handleAddEvent(newDate)
                    }}
                  ></div>
                ))}

                {/* All-day events */}
                {getEventsForDate(day)
                  .filter((event) => event.isAllDay)
                  .map((event, eventIndex) => (
                    <div
                      key={`allday-${eventIndex}`}
                      className="absolute top-0 left-0 right-0 mx-0.5 mt-10 rounded-md px-1 py-0.5 overflow-hidden cursor-pointer z-10"
                      style={{
                        backgroundColor: event.color + "CC",
                        color: "#fff",
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditEvent(event)
                      }}
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation()
                        handleEventDragStart(event)
                      }}
                    >
                      <div className="text-xs font-medium truncate">{event.title}</div>
                    </div>
                  ))}

                {/* Timed events */}
                {getEventsForDate(day)
                  .filter((event) => !event.isAllDay)
                  .map((event, eventIndex) => {
                    const startHour = Number.parseInt(event.startTime.split(":")[0])
                    const startMinute = Number.parseInt(event.startTime.split(":")[1])
                    const endHour = Number.parseInt(event.endTime.split(":")[0])
                    const endMinute = Number.parseInt(event.endTime.split(":")[1])

                    // Calculate position and height
                    const top = (startHour - 7) * 64 + (startMinute / 60) * 64
                    const height = (((endHour - startHour) * 60 + (endMinute - startMinute)) / 60) * 64

                    return (
                      <div
                        key={eventIndex}
                        className="absolute left-0 right-0 mx-0.5 rounded-md px-1 py-0.5 overflow-hidden cursor-pointer"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          backgroundColor: event.color + "CC",
                          color: "#fff",
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditEvent(event)
                        }}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation()
                          handleEventDragStart(event)
                        }}
                      >
                        <div className="text-xs font-medium truncate">{event.title}</div>
                        <div className="text-xs truncate">
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render day view
  const renderDayView = () => {
    const dayObj = parseDate(selectedDate)
    const dayName = dayObj.toLocaleString("default", { weekday: "long" })
    const monthName = dayObj.toLocaleString("default", { month: "long" })
    const day = dayObj.getDate()
    const year = dayObj.getFullYear()
    const isToday = isSameDay(dayObj, new Date())

    // Hours for the day
    const hours: number[] = []
    for (let i = 7; i < 22; i++) {
      hours.push(i)
    }

    const dayEvents = getEventsForDate(dayObj)
    const allDayEvents = dayEvents.filter((event) => event.isAllDay)
    const timedEvents = dayEvents.filter((event) => !event.isAllDay)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {dayName}, {monthName} {day}, {year}
            {isToday && (
              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Today</span>
            )}
          </h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleTodayClick}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* All-day events */}
        {allDayEvents.length > 0 && (
          <div className="space-y-1 mb-4">
            <div className="text-sm font-medium">All-day</div>
            {allDayEvents.map((event, index) => (
              <div
                key={index}
                className="p-2 rounded-md cursor-pointer"
                style={{ backgroundColor: event.color + "33" }}
                onClick={() => handleEditEvent(event)}
                draggable
                onDragStart={(e) => handleEventDragStart(event)}
              >
                <div className="font-medium">{event.title}</div>
                {event.location && (
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" /> {event.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex h-[600px]">
          {/* Time column */}
          <div className="w-16 pr-2 flex flex-col">
            {hours.map((hour) => (
              <div key={hour} className="h-16 text-xs text-muted-foreground flex items-start justify-end pr-2">
                {hour % 12 === 0 ? 12 : hour % 12}
                {hour < 12 ? "am" : "pm"}
              </div>
            ))}
          </div>

          {/* Day column */}
          <div className="flex-1 relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-16 border-t border-muted hover:bg-muted/20 cursor-pointer"
                onClick={() => {
                  const newDate = new Date(dayObj)
                  newDate.setHours(hour, 0, 0, 0)
                  handleAddEvent(newDate)
                }}
              ></div>
            ))}

            {/* Events */}
            {timedEvents.map((event, eventIndex) => {
              const startHour = Number.parseInt(event.startTime.split(":")[0])
              const startMinute = Number.parseInt(event.startTime.split(":")[1])
              const endHour = Number.parseInt(event.endTime.split(":")[0])
              const endMinute = Number.parseInt(event.endTime.split(":")[1])

              // Calculate position and height
              const top = (startHour - 7) * 64 + (startMinute / 60) * 64
              const height = (((endHour - startHour) * 60 + (endMinute - startMinute)) / 60) * 64

              return (
                <div
                  key={eventIndex}
                  className="absolute left-0 right-0 mx-2 rounded-md px-2 py-1 overflow-hidden cursor-pointer"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    backgroundColor: event.color + "CC",
                    color: "#fff",
                  }}
                  onClick={() => handleEditEvent(event)}
                  draggable
                  onDragStart={(e) => handleEventDragStart(event)}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm">
                    {event.startTime} - {event.endTime}
                  </div>
                  {event.location && (
                    <div className="text-sm flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" /> {event.location}
                    </div>
                  )}
                  {event.description && <div className="text-sm mt-1 opacity-90 truncate">{event.description}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Render agenda view
  const renderAgendaView = () => {
    // Group events by date
    const groupedEvents: Record<string, Event[]> = {}

    events
      .filter((event) => selectedCalendars.includes(event.calendar))
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
      .forEach((event) => {
        if (!groupedEvents[event.date]) {
          groupedEvents[event.date] = []
        }
        groupedEvents[event.date].push(event)
      })

    // Sort dates
    const sortedDates = Object.keys(groupedEvents).sort((a, b) => parseDate(a).getTime() - parseDate(b).getTime())

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Upcoming Events</h2>
          <Button variant="outline" onClick={handleTodayClick}>
            Today
          </Button>
        </div>

        {sortedDates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No upcoming events. Click the + button to add an event.
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDates.map((date) => {
              const dateObj = parseDate(date)
              const isToday = isSameDay(dateObj, new Date())
              const dayName = dateObj.toLocaleString("default", {
                weekday: "long",
              })
              const monthName = dateObj.toLocaleString("default", {
                month: "short",
              })
              const day = dateObj.getDate()

              return (
                <div key={date} className="space-y-2">
                  <div className="flex items-center">
                    <div className={`font-medium ${isToday ? "text-primary" : ""}`}>
                      {isToday ? "Today" : dayName}, {monthName} {day}
                    </div>
                    {isToday && (
                      <div className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Today
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {groupedEvents[date].map((event) => (
                      <div
                        key={event.id}
                        className="flex p-3 border rounded-md hover:bg-muted/50 cursor-pointer relative group"
                        onClick={() => handleEditEvent(event)}
                      >
                        <div
                          className="w-1 self-stretch rounded-full mr-3"
                          style={{ backgroundColor: event.color }}
                        ></div>
                        <div className="flex-1">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.isAllDay ? (
                              "All day"
                            ) : (
                              <>
                                {event.startTime} - {event.endTime}
                              </>
                            )}
                          </div>
                          {event.location && (
                            <div className="text-sm text-muted-foreground flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" /> {event.location}
                            </div>
                          )}
                          {event.description && <div className="text-sm mt-1">{event.description}</div>}
                          {event.attachments && event.attachments.length > 0 && (
                            <div className="flex mt-2 space-x-2">
                              {event.attachments.map((attachment, i) => (
                                <div key={i} className="text-xs bg-muted px-2 py-1 rounded-md flex items-center">
                                  {attachment.type === "document" ? (
                                    <FileText className="h-3 w-3 mr-1" />
                                  ) : (
                                    <PenTool className="h-3 w-3 mr-1" />
                                  )}
                                  {attachment.type === "document"
                                    ? documents.find((d) => d.id === attachment.id)?.title || "Document"
                                    : whiteboards.find((w) => w.id === attachment.id)?.title || "Whiteboard"}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 absolute top-2 right-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowEventMenu(event.id)
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        {showEventMenu === event.id && (
                          <div className="absolute top-10 right-2 z-10 bg-background border rounded-md shadow-md p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditEvent(event)
                                setShowEventMenu(null)
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                dispatch(deleteEvent(event.id))
                                setShowEventMenu(null)
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // Render search results
  const renderSearchResults = () => {
    if (!searchQuery.trim()) return null

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Search Results</h3>
        {filteredEvents.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No events found matching "{searchQuery}"</div>
        ) : (
          <div className="space-y-2">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="flex p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                onClick={() => handleEditEvent(event)}
              >
                <div className="w-1 self-stretch rounded-full mr-3" style={{ backgroundColor: event.color }}></div>
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(parseDate(event.date)).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                    {" • "}
                    {event.isAllDay ? (
                      "All day"
                    ) : (
                      <>
                        {event.startTime} - {event.endTime}
                      </>
                    )}
                  </div>
                  {event.description && <div className="text-sm mt-1">{event.description}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => setShowSidebar(!showSidebar)}>
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Calendar</h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <Button onClick={() => handleAddEvent()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar */}
        {showSidebar && (
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleAddEvent()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>

                {showMiniCalendar && (
                  <>
                    <Separator className="my-4" />
                    {renderMiniCalendar()}
                  </>
                )}

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="font-medium">My Calendars</div>
                  {calendars.map((calendar) => (
                    <div key={calendar.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`calendar-${calendar.id}`}
                        checked={selectedCalendars.includes(calendar.id)}
                        onCheckedChange={() => handleToggleCalendar(calendar.id)}
                        style={{
                          backgroundColor: selectedCalendars.includes(calendar.id) ? calendar.color : undefined,
                          borderColor: calendar.color,
                        }}
                      />
                      <Label htmlFor={`calendar-${calendar.id}`} className="flex-1 text-sm cursor-pointer">
                        {calendar.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Search results */}
            {searchQuery.trim() && filteredEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Search Results</CardTitle>
                </CardHeader>
                <CardContent className="p-4">{renderSearchResults()}</CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Main calendar view */}
        <Card className={`${showSidebar ? "md:col-span-3" : "md:col-span-4"}`}>
          <Tabs value={view} onValueChange={(value) => dispatch(setView(value))}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
            </TabsList>
            <CardContent className="p-6">
              <TabsContent value="month" className="mt-0">
                {renderMonthView()}
              </TabsContent>

              <TabsContent value="week" className="mt-0">
                {renderWeekView()}
              </TabsContent>

              <TabsContent value="day" className="mt-0">
                {renderDayView()}
              </TabsContent>

              <TabsContent value="agenda" className="mt-0">
                {renderAgendaView()}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
        {selectedDate && selectedDateEvents.length > 0 && view !== "agenda" && (
          <Card className={`${showSidebar ? "md:col-span-3" : "md:col-span-4"} md:col-start-2`}>
            <CardHeader>
              <CardTitle className="text-base">
                Events for{" "}
                {new Date(parseDate(selectedDate)).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleEditEvent(event)}
                  >
                    <div className="w-1 self-stretch rounded-full mr-3" style={{ backgroundColor: event.color }}></div>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.isAllDay ? "All day" : `${event.startTime} - ${event.endTime}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-[500px] h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Event description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="calendar">Calendar</Label>
                <Select value={newEvent.calendar} onValueChange={handleCalendarChange}>
                  <SelectTrigger id="calendar">
                    <SelectValue placeholder="Select calendar" />
                  </SelectTrigger>
                  <SelectContent>
                    {calendars.map((calendar) => (
                      <SelectItem key={calendar.id} value={calendar.id}>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: calendar.color }}></div>
                          {calendar.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAllDay"
                checked={newEvent.isAllDay}
                onCheckedChange={(checked) => setNewEvent({ ...newEvent, isAllDay: !!checked })}
              />
              <Label htmlFor="isAllDay">All day</Label>
            </div>
            {!newEvent.isAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  />
                </div>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Add location"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reminder">Reminder</Label>
              <Select
                value={newEvent.reminder.toString()}
                onValueChange={(value) => setNewEvent({ ...newEvent, reminder: Number.parseInt(value) })}
              >
                <SelectTrigger id="reminder">
                  <SelectValue placeholder="Set reminder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="1440">1 day before</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Attachments</Label>
              <div className="border rounded-md p-3 space-y-2">
                <div className="text-sm font-medium">Documents</div>
                <div className="grid grid-cols-2 gap-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`text-sm p-2 rounded-md flex items-center cursor-pointer ${
                        newEvent.attachments.some((a) => a.id === doc.id && a.type === "document")
                          ? "bg-primary/20 border-primary"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                      onClick={() => handleAttachmentChange("document", doc.id)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="truncate">{doc.title}</span>
                    </div>
                  ))}
                </div>

                <div className="text-sm font-medium mt-3">Whiteboards</div>
                <div className="grid grid-cols-2 gap-2">
                  {whiteboards.map((board) => (
                    <div
                      key={board.id}
                      className={`text-sm p-2 rounded-md flex items-center cursor-pointer ${
                        newEvent.attachments.some((a) => a.id === board.id && a.type === "whiteboard")
                          ? "bg-primary/20 border-primary"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                      onClick={() => handleAttachmentChange("whiteboard", board.id)}
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      <span className="truncate">{board.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            {isEditMode && (
              <Button variant="destructive" onClick={handleDeleteEvent}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowEventDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEvent}>Save</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default CalendarView
