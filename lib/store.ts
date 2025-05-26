import { configureStore } from "@reduxjs/toolkit"
import boardsReducer from "./features/boards/boardsSlice"
import canvasReducer from "./features/canvas/canvasSlice"

// Store with boards and canvas reducers
export const store = configureStore({
  reducer: {
    boards: boardsReducer,
    canvas: canvasReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
