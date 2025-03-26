import type React from "react"
import { TableVisibilityProvider } from "@/contexts/table-visibility-context"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5F6FA]">
        <TableVisibilityProvider>
          <main className="pl-[60px]">{children}</main>
        </TableVisibilityProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
