"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Default columns that should be visible
const defaultVisibleColumns = [
  "actions",
  "title",
  "status",
  "location",
  "recruiter",
  "advertisement",
  "unreviewed",
  "inProgress",
  "total",
  "dateCreated",
]

type TableVisibilityContextType = {
  visibleColumns: string[]
  setVisibleColumns: (columns: string[]) => void
}

const TableVisibilityContext = createContext<TableVisibilityContextType | undefined>(undefined)

export function TableVisibilityProvider({ children }: { children: ReactNode }) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultVisibleColumns)

  return (
    <TableVisibilityContext.Provider value={{ visibleColumns, setVisibleColumns }}>
      {children}
    </TableVisibilityContext.Provider>
  )
}

export function useTableVisibility() {
  const context = useContext(TableVisibilityContext)
  if (context === undefined) {
    throw new Error("useTableVisibility must be used within a TableVisibilityProvider")
  }
  return context
}

