import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Notification {
  id: number
  title: string
  message: string
  type: string // 'success', 'error', 'info', 'warning'
  read?: boolean
  timestamp?: number
}

interface NotificationsState {
  notifications: Notification[]
}

const initialState: NotificationsState = {
  notifications: [],
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push({
        ...action.payload,
        read: false,
        timestamp: Date.now(),
      })
    },
    markAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true
      })
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload)
    },
    clearAllNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const { addNotification, markAsRead, markAllAsRead, removeNotification, clearAllNotifications } =
  notificationsSlice.actions

export default notificationsSlice.reducer
