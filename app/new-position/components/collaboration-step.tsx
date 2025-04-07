"use client"

import { Button } from "@/components/ui/button"
import { ColaborationTeam } from "./colaboration-team"

export function CollaborationStep() {
  return (
    <div className="space-y-6 p-0">
      <ColaborationTeam />

      <div className="flex justify-between">
        <Button variant="outline">Zpět</Button>
        <Button>Pokračovat</Button>
      </div>
    </div>
  )
}

