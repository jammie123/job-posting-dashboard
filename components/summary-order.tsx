"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface PlatformSetting {
  name: string
  presentationDuration?: string
  price: string | number
  autoUpdate?: string
}

interface SummaryOrderProps {
  selectedPlatforms: PlatformSetting[]
  onSubmit: () => void
  totalCredits: number
}

export function SummaryOrder({ selectedPlatforms, onSubmit, totalCredits }: SummaryOrderProps) {
  return (
    <Card className="sticky top-6 right-0 w-[300px] shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Souhrn objednávky</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        {selectedPlatforms.length === 0 ? (
          <div className="text-sm text-gray-500 py-4 text-center">Zatím nemáte vybrané žádné portály</div>
        ) : (
          <div className="space-y-3">
            {selectedPlatforms.map((platform, index) => (
              <div key={index} className="border-b pb-2 last:border-0">
                <div className="font-medium">{platform.name}</div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Doba prezentace:</span>
                  <span>{platform.presentationDuration || "30 dní"}</span>
                </div>
                {platform.autoUpdate && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Aktualizace:</span>
                    <span>{platform.autoUpdate}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Cena:</span>
                  <span className="font-semibold">{platform.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3 pt-2 border-t">
        <div className="flex justify-between items-center">
          <span className="font-medium">Celkem:</span>
          <Badge variant="outline" className="font-semibold">
            {totalCredits} kreditů
          </Badge>
        </div>
        <Button onClick={onSubmit} disabled={selectedPlatforms.length === 0} className="w-full">
          Vystavit inzeráty
        </Button>
      </CardFooter>
    </Card>
  )
}

