"use client"

import { Toaster } from "sonner"

export default function NewPositionV2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
      <Toaster position="top-center" richColors />
    </div>
  )
} 