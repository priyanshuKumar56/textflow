import { configureStore } from "@reduxjs/toolkit"
import calendarReducer from "./features/calendarSlice"
import documentsReducer from "./features/documentsSlice"
import whiteboardReducer from "./features/whiteboardSlice"
import notificationsReducer from "./features/notificationsSlice"

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    documents: documentsReducer,
    whiteboard: whiteboardReducer,
    notifications: notificationsReducer,
  },
  // Add middleware or other configuration as needed
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
