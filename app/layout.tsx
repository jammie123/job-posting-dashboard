import type React from "react"
import { TableVisibilityProvider } from "@/contexts/table-visibility-context"
import { TooltipProvider } from "@/components/ui/tooltip"

import './globals.css'

export const metadata = {
  generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5F6FA]">
        <TooltipProvider>
          <TableVisibilityProvider>
            <main className="pl-[60px]">{children}</main>
          </TableVisibilityProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}


