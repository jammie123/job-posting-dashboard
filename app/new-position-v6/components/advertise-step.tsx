"use client"

import { AdvertiseJob } from "./advertise-job"

interface AdvertiseStepProps {
  initialData?: {
    platforms?: string[];
    settings?: any;
  };
  onDataChange?: (data: { platforms: string[]; settings: any }) => void;
}

export default function AdvertiseStep({ initialData, onDataChange }: AdvertiseStepProps) {
  const handlePlatformsChange = (platforms: string[]) => {
    onDataChange?.({
      platforms,
      settings: initialData?.settings || {}
    });
  };

  const handleSettingsChange = (settings: any) => {
    onDataChange?.({
      platforms: initialData?.platforms || [],
      settings
    });
  };

  return (
    <div className="space-y-8 p-6">


      <AdvertiseJob 
        open={true}
        onOpenChange={() => {}}
        onSubmit={handlePlatformsChange}
        initialSelectedPlatforms={initialData?.platforms || []}
        onSettingsChange={handleSettingsChange}
        hideSettings={true}
      />
    </div>
  )
}

