"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// Default columns that should be visible (order aligned with table preference)
const defaultVisibleColumns = [
  "actions",
  "title",
  "unreviewed",
  "inProgress",
  "total",
  "advertisement",
  "status",
  "location",
  "recruiter",
  "dateCreated",
]

// Order of all known columns (includes hidden options)
const defaultColumnOrder = [
  "actions",
  "title",
  "unreviewed",
  "inProgress",
  "invited",
  "total",
  "status",
  "location",
  "recruiter",
  "advertisement",
  "dateCreated",
  "views",
  "note",
  "hired",
  "rejected",
]

type TableVisibilityContextType = {
  visibleColumns: string[]
  setVisibleColumns: (columns: string[]) => void
  columnOrder: string[]
  setColumnOrder: (order: string[]) => void
}

const TableVisibilityContext = createContext<TableVisibilityContextType | undefined>(undefined)

export function TableVisibilityProvider({ children }: { children: ReactNode }) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultVisibleColumns)
  const [columnOrder, setColumnOrder] = useState<string[]>(defaultColumnOrder)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedVisible = typeof window !== "undefined" ? window.localStorage.getItem("table.visibleColumns") : null
      const storedOrder = typeof window !== "undefined" ? window.localStorage.getItem("table.columnOrder") : null
      if (storedVisible) {
        const parsed = JSON.parse(storedVisible)
        if (Array.isArray(parsed)) setVisibleColumns(parsed)
      }
      if (storedOrder) {
        const parsed = JSON.parse(storedOrder)
        if (Array.isArray(parsed)) setColumnOrder(parsed)
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("table.visibleColumns", JSON.stringify(visibleColumns))
      }
    } catch {
      // ignore storage errors
    }
  }, [visibleColumns])

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Enforce pinned columns first always
        const pinned = ["actions", "title"]
        const deduped = Array.from(new Set(columnOrder))
        const withoutPinned = deduped.filter((c) => !pinned.includes(c))
        const normalized = [...pinned, ...withoutPinned]
        window.localStorage.setItem("table.columnOrder", JSON.stringify(normalized))
      }
    } catch {
      // ignore storage errors
    }
  }, [columnOrder])

  return (
    <TableVisibilityContext.Provider value={{ visibleColumns, setVisibleColumns: (cols: string[]) => {
      const pinned = ["actions", "title"]
      const unique = Array.from(new Set(cols))
      const ensured = Array.from(new Set([...pinned, ...unique]))
      setVisibleColumns(ensured)
    }, columnOrder, setColumnOrder }}>
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

