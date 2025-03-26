"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

// Update the interface to include advertisement status and date information
export interface AdvertisementPlatformCardProps {
  logo: ReactNode
  title: string
  description: string
  price: string
  isSelected: boolean
  onToggle: () => void
  additionalSettings?: AdditionalSetting[]
  children?: ReactNode
  // New props for advertisement status
  status?: "draft" | "active" | "expired"
  startDate?: string
  expiryDate?: string
  daysRemaining?: number
  onRemove?: () => void
}

export interface AdditionalSetting {
  name: string
  type: "select" | "checkbox" | "info"
  options?: string[]
  value?: string
  onChange?: (value: string) => void
  description?: string
  checked?: boolean
  onToggle?: () => void
  price?: string
  isPriceHighlighted?: boolean
}

// Update the component to handle the active state
export function AdvertisementPlatformCard({
  logo,
  title,
  description,
  price,
  isSelected,
  onToggle,
  additionalSettings = [],
  children,
  status = "draft",
  startDate,
  expiryDate,
  daysRemaining,
  onRemove,
}: AdvertisementPlatformCardProps) {
  const isActive = status === "active"
  const isExpired = status === "expired"
  const [/*showSummary*/ /*setShowSummary*/ ,] = useState(false)

  return (
    <Card className={`border-2 ${isSelected ? "border-blue-500" : isExpired ? "border-red-300" : "border-gray-200"}`}>
      <CardHeader className="pb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            {logo}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{title}</span>
                {isActive && startDate && daysRemaining !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Aktivní od {startDate} ({daysRemaining}{" "}
                    {daysRemaining === 1 ? "den" : daysRemaining >= 2 && daysRemaining <= 4 ? "dny" : "dní"})
                  </span>
                )}
                {isExpired && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">Vypršelo</span>
                )}
              </div>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {status === "draft" ? (
              // Show selection button for draft advertisements
              <div className="flex flex-col items-end gap-1">
                <Button variant={isSelected ? "default" : "outline"} size="sm" onClick={onToggle}>
                  {isSelected ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-4 w-4" /> Vybráno
                    </span>
                  ) : (
                    "Vybrat"
                  )}
                </Button>
                <span className="text-sm font-medium text-gray-600">{price}</span>
              </div>
            ) : isActive ? (
              // Show remove button for active advertisements
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={onRemove}
              >
                <X className="h-4 w-4 mr-1" /> Ukončit
              </Button>
            ) : (
              // Show renew button for expired advertisements
              <Button variant="outline" size="sm">
                Obnovit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Show settings only for draft advertisements that are selected */}
      {status === "draft" && isSelected && additionalSettings.length > 0 ? (
        <CardContent className="pb-6 pt-6 pl-14">
          <div className="space-y-3">
            {additionalSettings.map((setting, index) => (
              <div key={index}>
                {setting.type === "select" && (
                  <div className="grid grid-cols-2 items-center gap-2">
                    <div className="text-sm font-medium">{setting.name}:</div>
                    <Select value={setting.value} onValueChange={setting.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={`Vyberte ${setting.name.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {setting.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {setting.type === "checkbox" && (
                  <div className="flex items-start gap-2 rounded">
                    <input
                      type="checkbox"
                      id={`setting-${index}`}
                      checked={setting.checked}
                      onChange={setting.onToggle}
                      className="mt-1"
                    />
                    <div>
                      <label htmlFor={`setting-${index}`} className="text-sm font-medium">
                        {setting.name}
                      </label>
                      {setting.description && <p className="text-xs text-gray-500">{setting.description}</p>}
                    </div>
                    {setting.price && (
                      <div
                        className={`text-sm mt-1 font-medium w-[100px] text-right${setting.isPriceHighlighted ? " text-green-600" : ""}`}
                      >
                        {setting.price}
                      </div>
                    )}
                  </div>
                )}
                {setting.type === "info" && (
                  <div className="flex justify-between text-sm">
                    <span>{setting.name}:</span>
                    <span className="font-semibold">{setting.value}</span>
                  </div>
                )}
              </div>
            ))}
            {isSelected && children}
          </div>
        </CardContent>
      ) : (
        // Render children in a separate CardContent if there are no settings
        children && <CardContent className="pb-2 pt-6 pl-14">{children}</CardContent>
      )}
    </Card>
  )
}

