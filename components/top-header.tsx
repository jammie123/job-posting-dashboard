"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { SwitchRole } from "@/components/switch-role"

interface TopHeaderProps {
  userName: string
  companyName: string
  avatarUrl?: string
}

export function TopHeader({ userName, companyName, avatarUrl }: TopHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Truncate company name if longer than 20 characters
  const truncatedCompanyName = companyName.length > 20 ? `${companyName.substring(0, 20)}...` : companyName

  return (
    <div className="w-full bg-white border-b border-gray-200 py-3 px-6 flex justify-between items-center z-10">
      {/* Search input */}
      <div className="relative w-1/2">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
          placeholder="Hledej uchazeče, nábor atd"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* User profile */}
      <div className="flex items-center gap-3">
        <SwitchRole />
        <div className="flex flex-col items-end">
          <span className="font-medium text-sm">Anna K.</span>
          <span className="text-xs text-gray-500">{truncatedCompanyName}</span>
        </div>
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl || "/placeholder.svg"}
              alt={`${userName}'s avatar`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-medium">AK</span>
          )}
        </div>
      </div>
    </div>
  )
}

