"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { MarketplaceItem } from "@/data/mock-data"

export interface TeamioItemCardProps {
  title: string
  perex: string
  description: string
  validFrom?: string
  validTo?: string
  howToUse?: string
  upgrade?: string
  progress?: string
  features?: MarketplaceItem[]
}

export function TeamioItemCard({
  title,
  perex,
  description,
  validFrom,
  validTo,
  howToUse,
  upgrade,
  progress,
  features,
}: TeamioItemCardProps) {
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
        className="bg-white rounded-lg border border-blue-200 shadow-md p-6 flex flex-col transition-all duration-200 hover:shadow-lg hover:border-blue-500 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col gap-6">
          <div className="flex-1">
            <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
              Teamio Profesional
            </div>
            {validFrom && validTo && (
              <div className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Aktivní
              </div>
            )}
            <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-700 mb-1">{perex}</p>
       

            {validFrom && validTo && (
              <p className="text-xs text-gray-500 mt-4">
                Aktivní: {validFrom} - {validTo}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-700">Premium funkce:</h4>
            <ul className="grid grid-cols-4 gap-4">
              {features?.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-4 h-4 text-blue-500 mt-0.5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <div>
                    <p className="text-sm font-medium">{feature.title}</p>
                    <p className="text-xs text-gray-600">{feature.perex}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {progress && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Využito</span>
              <span>{progress}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button>Mám zájem o premium funkce</Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl">
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

            {features && features.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Obsažené funkce</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">{feature.title}</h5>
                      <p className="text-sm text-gray-600 mb-2">{feature.perex}</p>
                      <p className="text-sm text-gray-700">{feature.description}</p>
                      {feature.upgrade && (
                        <div className="mt-3 bg-blue-50 p-2 rounded text-xs text-blue-700">{feature.upgrade}</div>
                      )}
                    </div>
                  ))}
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
            <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline">
              Zavřít
            </Button>
            <Button type="button">Mám zájem</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

