"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ColaborationTeam } from "./colaboration-team"

// Definice props pro komponentu
interface CollaborationStepProps {
  initialData?: any;
  onDataChange?: (data: any) => void;
  onNextStep?: () => void;
  onPrevStep?: () => void;
}

export function CollaborationStep({ initialData, onDataChange, onNextStep, onPrevStep }: CollaborationStepProps) {
  // Efekt pro aktualizaci dat při načtení
  useEffect(() => {
    // Pokud existuje funkce pro aktualizaci dat, předáme jí výchozí data
    if (onDataChange) {
      onDataChange(initialData || { collaborators: [] });
    }
  }, [initialData, onDataChange]);

  return (
    <div className="space-y-6 p-0">
      <ColaborationTeam 
        initialCollaborators={initialData?.collaborators} 
        onCollaboratorsChange={(collaborators) => {
          if (onDataChange) {
            onDataChange({ collaborators });
          }
        }}
      />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>Zpět</Button>
        <Button onClick={onNextStep}>Pokračovat</Button>
      </div>
    </div>
  )
}

