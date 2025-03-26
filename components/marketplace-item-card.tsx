"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface MarketplaceItemCardProps {
  title: string
  perex: string
  description: string
  validFrom?: string
  validTo?: string
  howToUse?: string
  upgrade?: string
  progress?: string
}

export function MarketplaceItemCard({
  title,
  perex,
  description,
  validFrom,
  validTo,
  howToUse,
  upgrade,
  progress,
}: MarketplaceItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Parse progress if available (e.g., "380/500 Kreditů" -> 76%)
  const progressPercentage = progress ? calculateProgress(progress) : null

  function calculateProgress(progressStr: string): number {
    const match = progressStr.match(/(\d+)\/(\d+)/)
    if (match && match.length === 3) {
      const current = Number.parseInt(match[1])
      const total = Number.parseInt(match[2])
      return Math.round((current / total) * 100)
    }
    return 0
  }

  return (
    <>
      <div
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:border-blue-500 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {validFrom && validTo && (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2 w-fit">
            Aktivní
          </div>
        )}
        <h3 className="font-medium text-gray-900 mb-2">{title}</h3>

        <p className="text-sm text-gray-600 mb-1">{perex}</p>

        <div className="mt-auto pt-2 space-y-2">
          {validFrom && validTo && (
            <p className="text-xs text-gray-500">
              Aktivní: {validFrom} - {validTo}
            </p>
          )}

          {progress && (
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Využito</span>
                <span>{progress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-700">{description}</p>

            {validFrom && validTo && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700">Aktivní období</p>
                <p className="text-sm text-gray-600">
                  {validFrom} - {validTo}
                </p>
              </div>
            )}

            {progress && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-2">Využití</p>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Využito</span>
                  <span>{progress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
            )}

            {howToUse && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Jak to používat</h4>
                <p className="text-sm text-gray-700">{howToUse}</p>
              </div>
            )}

            {upgrade && (
              <div className="mt-4 bg-blue-50 p-3 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Upgrade</h4>
                <p className="text-sm text-blue-700">{upgrade}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsModalOpen(false)}>
              Zavřít
            </Button>
            <Button type="button">Mám zájem</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

