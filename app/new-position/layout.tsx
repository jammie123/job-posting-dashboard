"use client"

import { Toaster } from "sonner"

export default function NewPositionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-slate-50 min-h-screen">
      {children}
      <Toaster position="top-center" richColors />
    </div>
  )
} 