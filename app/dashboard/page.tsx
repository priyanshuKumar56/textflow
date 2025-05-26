"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { DashboardPage } from "@/components/dashboard/dashboard-page"

export default function DashboardPreview() {
  return (
    <Provider store={store}>
      <DashboardPage />
    </Provider>
  )
}
