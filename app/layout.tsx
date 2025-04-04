import type React from "react"
import { TableVisibilityProvider } from "@/contexts/table-visibility-context"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Poppins } from 'next/font/google'

import './globals.css'

// Konfigurace fontu Poppins s potřebnými váhami
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata = {
  generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.className}>
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


