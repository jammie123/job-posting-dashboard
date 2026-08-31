"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface ChannelsLayoutProps {
  children: React.ReactNode
}

export default function ChannelsLayout({ children }: ChannelsLayoutProps) {
  const pathname = usePathname()
  
  const navItems = [
    {
      name: "Všechny kanály",
      href: "/channels",
      active: pathname === "/channels"
    },
    {
      name: "Jobboardy",
      href: "/channels/jobboards",
      active: pathname === "/channels/jobboards"
    },
    {
      name: "ATS Systémy",
      href: "/channels/ats",
      active: pathname === "/channels/ats"
    },
    {
      name: "XML Feedy",
      href: "/channels/xml",
      active: pathname === "/channels/xml"
    }
  ]
  
  return (
    <div>
      <div className="border-b mb-6">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex py-4 border-b-2 -mb-px text-sm font-medium whitespace-nowrap",
                  item.active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  )
} 