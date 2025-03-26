"use client"

import { AdvertiseJob } from "./advertise-job"

interface AdvertiseStepProps {
  onSelectPlatforms?: (platforms: string[]) => void
  onUpdateSettings?: (settings: any) => void
  selectedPlatforms?: string[]
}

export function AdvertiseStep({ onSelectPlatforms, onUpdateSettings, selectedPlatforms = [] }: AdvertiseStepProps) {
  return (
    <AdvertiseJob
      open={true}
      onOpenChange={() => {}}
      onSubmit={onSelectPlatforms}
      initialSelectedPlatforms={selectedPlatforms}
      onSettingsChange={onUpdateSettings}
    />
  )
}

