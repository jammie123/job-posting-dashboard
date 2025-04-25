"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  BadgeCheck, 
  ClockIcon, 
  EyeOffIcon,
  ChevronRightIcon,
  SaveIcon,
  SettingsIcon,
  Edit,
  Eye,
  FilePlus,
  RefreshCw,
  AlertTriangle
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState, useEffect } from "react"

type JobStatus = "active" | "unpublished" | "draft"

interface ActionFooterProps {
  onContinue: () => void
  onSaveAsDraft: () => void
  positionTitle?: string
  jobStatus?: JobStatus
  isLastStep?: boolean
  isViewMode?: boolean
  onViewModeChange?: (value: boolean) => void
  onClearForm?: () => void
}

export function ActionFooter({
  onContinue,
  onSaveAsDraft,
  positionTitle = "Nová pozice",
  jobStatus = "draft",
  isLastStep = false,
  isViewMode = false,
  onViewModeChange,
  onClearForm
}: ActionFooterProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  // Spustit animaci po načtení komponenty
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  // Funkce pro zobrazení správné ikony a textu podle statusu
  const getStatusInfo = (status: JobStatus) => {
    switch (status) {
      case "active":
        return {
          label: "Aktivní",
          icon: <BadgeCheck className="h-4 w-4 text-green-500" />,
          className: "bg-green-50 text-green-700 border-green-200",
          indicatorColor: "bg-green-500"
        }
      case "unpublished":
        return {
          label: "Nezveřejněný",
          icon: <EyeOffIcon className="h-4 w-4 text-amber-500" />,
          className: "bg-amber-50 text-amber-700 border-amber-200",
          indicatorColor: "bg-amber-500"
        }
      case "draft":
      default:
        return {
          label: "Rozpracovaný",
          icon: <ClockIcon className="h-4 w-4 text-gray-500" />,
          className: "bg-blue-50 text-blue-700 border-gray-200",
          indicatorColor: "bg-gray-500"
        }
    }
  }

  const statusInfo = getStatusInfo(jobStatus)
  const continueButtonText = isLastStep ? "Dokončit a publikovat" : "Pokračovat na další krok"

  // Handler pro změnu režimu zobrazení
  const handleViewModeChange = (value: boolean) => {
    if (onViewModeChange) {
      onViewModeChange(value)
    }
  }

  // Handler pro vyčištění formuláře
  const handleClearForm = () => {
    if (onClearForm) {
      onClearForm()
    }
    setClearDialogOpen(false)
    setSettingsOpen(false)
  }

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-[0_-2px_4px_0_rgba(0,0,0,0.05)] z-50 py-3 px-6 transition-transform duration-500 ease-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="container w-[1000px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium">
              {positionTitle}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className={`h-2.5 w-2.5 rounded-full ${statusInfo.indicatorColor}`} />
              <span>{statusInfo.label}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 ">
          {/* Dialog s přepínači */}
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild className="absolute left-6">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 absolute left-6"
                title="Nastavení formuláře"
              >
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nastavení formuláře</DialogTitle>
              </DialogHeader>
              
              {/* Přepínač pro režim zobrazení */}
              <div className="py-4 space-y-4">
                <div className="flex items-center justify-between space-x-2 mb-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="view-mode-toggle" className="text-sm">Režim zobrazení</Label>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Edit size={14} />
                      <span>Úpravy</span>
                      <span>/</span>
                      <Eye size={14} />
                      <span>Náhled</span>
                    </div>
                  </div>
                  <Switch
                    id="view-mode-toggle"
                    checked={isViewMode}
                    onCheckedChange={handleViewModeChange}
                  />
                </div>
                
                {/* Tlačítko pro vyčištění formuláře */}
                <div className="flex items-center justify-between space-x-2 mt-6 pt-4 border-t border-muted-foreground/20">
                  <div className="flex flex-col gap-1">
                    <Label className="text-sm">Nová pozice</Label>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FilePlus size={14} />
                      <span>Vyčistit a začít znovu</span>
                    </div>
                  </div>
                  
                  <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-1"
                      >
                        <RefreshCw size={14} className="mr-1" />
                        Nová
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          Vyčistit formulář?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Chystáte se vyčistit všechna data ve formuláři a začít znovu. Tato akce je nevratná.
                          Všechna rozpracovaná data budou ztracena.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Zrušit</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearForm} className="bg-red-500 hover:bg-red-600">
                          Vyčistit
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSaveAsDraft}
            className="flex items-center gap-1.5"
          >
            <SaveIcon className="h-4 w-4" />
            Uložit jako...
          </Button>

          <Button 
            onClick={onContinue} 
            variant="default"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium h-auto"
          >
            {continueButtonText}
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 