"use client"

import { Button } from "@/components/ui/button"
import { ColaborationTeam } from "./colaboration-team"

export function CollaborationStep() {
  return (
    <div className="space-y-6">
      <ColaborationTeam />

      <div className="flex justify-between pt-6 mt-6 border-t">
        <Button variant="outline">Zpět</Button>
        <Button>Pokračovat</Button>
      </div>
    </div>
  )
}

