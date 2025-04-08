"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { AdvertiseJob } from "./advertise-job"

// Definujeme typ PlatformSettings
interface PlatformSettings {
  [platform: string]: {
    [setting: string]: any;
  };
}

interface AdvertiseStepProps {
  initialData?: {
    platforms?: string[];
    settings?: PlatformSettings;
  };
  onDataChange?: (data: { platforms: string[]; settings: PlatformSettings }) => void;
}

// Pomocný hook pro určení, zda komponenta běží na klientovi
function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return isMounted;
}

export default function AdvertiseStep({ initialData, onDataChange }: AdvertiseStepProps) {
  // Použití custom hooku k určení, zda je komponenta namountována (klientská strana)
  const isMounted = useIsMounted();
  
  // Výchozí prázdné hodnoty, které jsou konzistentní na serveru i klientovi
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({});
  const isFirstRender = useRef(true);
  const updatingFromProps = useRef(false);
  const localDataRef = useRef<{ platforms: string[], settings: PlatformSettings }>({
    platforms: [],
    settings: {}
  });

  // Efekt pro inicializaci dat po namonutování - pouze na klientovi
  useEffect(() => {
    if (isMounted && initialData) {
      // Inicializace stavů z props (pouze na klientovi)
      setSelectedPlatforms(initialData.platforms || []);
      setPlatformSettings(initialData.settings || {});
      
      // Inicializace referenčních hodnot
      localDataRef.current = {
        platforms: initialData.platforms || [],
        settings: initialData.settings || {}
      };
    }
  }, [isMounted, initialData]);

  // Synchronizace dat s initialData - pouze když se změní initialData zvenčí a pouze na klientovi
  useEffect(() => {
    // Spouštíme pouze na klientovi a pokud existují data
    if (!isMounted || !initialData || updatingFromProps.current) return;

    // Přeskočit první render - ten řeší předchozí efekt
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Porovnáme current state s initialData pomocí JSON stringifikace
    const platformsEqual = JSON.stringify(localDataRef.current.platforms) === JSON.stringify(initialData.platforms || []);
    const settingsEqual = JSON.stringify(localDataRef.current.settings) === JSON.stringify(initialData.settings || {});

    // Aktualizujeme pouze když se data skutečně liší
    if (!platformsEqual && initialData.platforms) {
      console.log("[AdvertiseStep] Načítání platforms z initialData:", initialData.platforms);
      
      // Nastavíme příznak, že aktualizujeme z props
      updatingFromProps.current = true;
      
      // Provedeme aktualizaci
      setSelectedPlatforms(initialData.platforms || []);
      localDataRef.current.platforms = initialData.platforms || [];
      
      // Reset příznaku (po dokončení aktualizace)
      setTimeout(() => {
        updatingFromProps.current = false;
      }, 0);
    }

    if (!settingsEqual && initialData.settings) {
      console.log("[AdvertiseStep] Načítání settings z initialData:", initialData.settings);
      
      // Nastavíme příznak, že aktualizujeme z props
      updatingFromProps.current = true;
      
      // Provedeme aktualizaci
      setPlatformSettings(initialData.settings || {});
      localDataRef.current.settings = initialData.settings || {};
      
      // Reset příznaku (po dokončení aktualizace)
      setTimeout(() => {
        updatingFromProps.current = false;
      }, 0);
    }
  }, [initialData, isMounted]);

  // Handler pro výběr platforem s prevencí cyklických aktualizací
  const handleSelectPlatforms = useCallback((platforms: string[]) => {
    // Nejprve zkontrolujeme, zda nedošlo ke skutečné změně dat
    if (JSON.stringify(localDataRef.current.platforms) === JSON.stringify(platforms)) {
      console.log("[AdvertiseStep] Přeskakuji aktualizaci platforms - data se nezměnila");
      return;
    }
    
    // Pokud právě probíhá aktualizace z props, neprovádíme nic
    if (updatingFromProps.current) {
      console.log("[AdvertiseStep] Přeskakuji aktualizaci platforms - probíhá aktualizace z props");
      return;
    }
    
    console.log("[AdvertiseStep] Aktualizuji platforms:", platforms);
    
    // Aktualizujeme lokální stav
    setSelectedPlatforms(platforms);
    localDataRef.current.platforms = platforms;
    
    // Zde zaktualizujeme nadřazenou komponentu
    if (onDataChange) {
      console.log("[AdvertiseStep] Odesílání aktualizace platforms:", platforms);
      onDataChange({
        platforms,
        settings: platformSettings
      });
    }
  }, [platformSettings, onDataChange]);

  // Handler pro změnu nastavení s prevencí cyklických aktualizací
  const handleSettingsChange = useCallback((settings: PlatformSettings) => {
    // Nejprve zkontrolujeme, zda nedošlo ke skutečné změně dat
    if (JSON.stringify(localDataRef.current.settings) === JSON.stringify(settings)) {
      console.log("[AdvertiseStep] Přeskakuji aktualizaci settings - data se nezměnila");
      return;
    }
    
    // Pokud právě probíhá aktualizace z props, neprovádíme nic
    if (updatingFromProps.current) {
      console.log("[AdvertiseStep] Přeskakuji aktualizaci settings - probíhá aktualizace z props");
      return;
    }
    
    console.log("[AdvertiseStep] Aktualizuji settings:", settings);
    
    // Aktualizujeme lokální stav
    setPlatformSettings(settings);
    localDataRef.current.settings = settings;
    
    // Zde zaktualizujeme nadřazenou komponentu
    if (onDataChange) {
      console.log("[AdvertiseStep] Odesílání aktualizace settings:", settings);
      onDataChange({
        platforms: selectedPlatforms,
        settings
      });
    }
  }, [selectedPlatforms, onDataChange]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Inzerovat pozici</h3>
        <p className="text-muted-foreground">
          Vyberte platformy, kde chcete inzerovat novou pozici a nastavte detaily.
        </p>
      </div>

      {/* Zobrazíme komponentu pouze na klientovi */}
      {isMounted && (
        <AdvertiseJob 
          open={true}
          onOpenChange={() => {}}
          onSubmit={handleSelectPlatforms}
          initialSelectedPlatforms={selectedPlatforms}
          onSettingsChange={handleSettingsChange}
        />
      )}
    </div>
  )
}

