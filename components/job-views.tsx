"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Save, Info, X, Plus, Edit } from "lucide-react"
import { JobStatus } from "@/types/job-posting"
import { CreateViewDialog } from "./create-view-dialog"
import { EditViewDialog } from "./edit-view-dialog"
import { ActiveFilter } from "./job-filters"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export interface JobViewConfig {
  value: string
  label: string
  filters?: {
    [key: string]: any
  }
  isCustom?: boolean // Pro označení vlastních pohledů
}

interface JobViewsProps {
  onViewChange?: (value: string) => void
  activeView?: string
  counts: Record<string, number>
  isEshop?: boolean
  activeFilters?: ActiveFilter[]
}

// Aktualizované pohledy podle požadavků v instructions.md
export const defaultViews: JobViewConfig[] = [
  { 
    value: "Aktivní", 
    label: "Aktivní",
    filters: {
      status: "Aktivní"
    } 
  },
  { 
    value: "Zveřejněný", 
    label: "Zveřejněné",
    filters: {
      status: "Aktivní",
      "advertisement.status": "Vystavený"
    } 
  },
  { 
    value: "Nezveřejněný", 
    label: "Nezveřejněné",
    filters: {
      status: "Aktivní",
      "advertisement.status": ["Ukončený", "Nevystavený"]
    } 
  },
  { 
    value: "Rozpracovaný", 
    label: "Rozpracované",
    filters: {
      status: "Rozpracovaný"
    } 
  },
  { 
    value: "Archivní", 
    label: "Archivní",
    filters: {
      status: "Archivní"
    } 
  },
]

// Exportujeme defaultViews jako views pro zpětnou kompatibilitu
export const views = defaultViews;

const eshopViews: JobViewConfig[] = [
  { value: "addons", label: "Addony a premium služby" },
  { value: "credits", label: "Kredity a inzerování" },
  { value: "invoices", label: "Vystavené faktury" },
]

// Klíč pro localStorage
const CUSTOM_VIEWS_STORAGE_KEY = 'jobDashboard_customViews';

export function JobViews({ onViewChange, activeView = "Aktivní", counts, isEshop = false, activeFilters = [] }: JobViewsProps) {
  const initialViews = isEshop ? eshopViews : defaultViews;
  const defaultValue = isEshop ? "addons" : "Aktivní";
  const [createViewOpen, setCreateViewOpen] = useState(false);
  const [editViewOpen, setEditViewOpen] = useState(false);
  const [viewToEdit, setViewToEdit] = useState<JobViewConfig | null>(null);
  
  // Načítáme vlastní pohledy z localStorage
  const [customViews, setCustomViews] = useState<JobViewConfig[]>(() => {
    // Spouští se pouze při inicializaci komponenty
    if (typeof window !== 'undefined') {
      try {
        const savedViews = localStorage.getItem(CUSTOM_VIEWS_STORAGE_KEY);
        return savedViews ? JSON.parse(savedViews) : [];
      } catch (error) {
        console.error('Chyba při načítání vlastních pohledů:', error);
        return [];
      }
    }
    return [];
  });
  
  // Spojení výchozích pohledů a vlastních pohledů
  const currentViews = [...initialViews, ...customViews];
  
  // Funkce pro získání popisu záložky podle hodnoty
  const getTabDescription = (value: string): string => {
    switch(value) {
      case "Zveřejněný":
        return "Aktivní nábory s vystavenou inzercí";
      case "Nezveřejněný":
        return "Aktivní nábory s ukončenou inzercí";
      case "Aktivní":
        return "Aktivní nábory kde je jak vytavená, tak ukončená inzerce";
      case "Rozpracovaný":
        return "Nábory ve stavu rozpracovaný";
      case "Archivní":
        return "Nábory ve stavu archivní";
      default:
        // Pro vlastní pohledy vrátíme popis na základě filtrů
        const customView = customViews.find(v => v.value === value);
        if (customView) {
          return `Vlastní pohled vytvořený uživatelem - filtry: ${Object.keys(customView.filters || {}).join(", ")}`;
        }
        return "";
    }
  };

  // Funkce pro odstranění vlastního pohledu
  const removeCustomView = (viewValue: string) => {
    // Kontrola, zda pohled existuje a je vlastní
    const view = customViews.find(v => v.value === viewValue);
    if (!view) return;
    
    // Odstranění pohledu
    const updatedViews = customViews.filter(v => v.value !== viewValue);
    setCustomViews(updatedViews);
    
    // Uložení aktualizovaných pohledů do localStorage
    localStorage.setItem(CUSTOM_VIEWS_STORAGE_KEY, JSON.stringify(updatedViews));
    
    // Pokud byl právě tento pohled aktivní, přepneme na výchozí
    if (activeView === viewValue && onViewChange) {
      onViewChange(defaultValue);
    }
  };

  const handleSaveView = (viewName: string) => {
    console.log("Ukládám pohled:", viewName, "s filtry:", activeFilters);
    
    // Příprava filtrovacích objektů pro nový pohled
    const filters: Record<string, any> = {};
    
    activeFilters.forEach(filter => {
      if (filter.id === "status") {
        filters.status = filter.value;
      } else if (filter.id === "adStatus") {
        filters["advertisement.status"] = filter.value;
      } else if (filter.id === "location") {
        filters.location = filter.value;
      } else if (filter.id === "recruiter") {
        filters.recruiter = filter.value;
      } else if (filter.id === "title") {
        filters.title = filter.value;
      } else if (filter.id === "department") {
        filters.department = filter.value;
      }
    });
    
    // Vytvoření nového pohledu
    const newView: JobViewConfig = {
      value: viewName.toLowerCase().replace(/\s+/g, "-"), // slug pro identifikaci
      label: viewName,
      filters: filters,
      isCustom: true // Označení, že jde o vlastní pohled
    };
    
    // Přidání nového pohledu do seznamu vlastních pohledů
    const updatedViews = [...customViews, newView];
    setCustomViews(updatedViews);
    
    // Uložení aktualizovaných pohledů do localStorage
    localStorage.setItem(CUSTOM_VIEWS_STORAGE_KEY, JSON.stringify(updatedViews));
    
    // Přepnutí na nově vytvořený pohled
    if (onViewChange) {
      onViewChange(newView.value);
    }
  }

  // Funkce pro úpravu vlastního pohledu
  const handleUpdateView = (viewId: string, newName: string, filters: ActiveFilter[]) => {
    console.log("Aktualizuji pohled:", viewId, "na:", newName, "s filtry:", filters);
    
    // Najdeme pohled, který chceme upravit
    const viewIndex = customViews.findIndex(v => v.value === viewId);
    if (viewIndex === -1) return;
    
    // Příprava filtrovacích objektů pro upravený pohled
    const updatedFilters: Record<string, any> = {};
    
    filters.forEach(filter => {
      if (filter.id === "status") {
        updatedFilters.status = filter.value;
      } else if (filter.id === "adStatus") {
        updatedFilters["advertisement.status"] = filter.value;
      } else if (filter.id === "location") {
        updatedFilters.location = filter.value;
      } else if (filter.id === "recruiter") {
        updatedFilters.recruiter = filter.value;
      } else if (filter.id === "title") {
        updatedFilters.title = filter.value;
      } else if (filter.id === "department") {
        updatedFilters.department = filter.value;
      }
    });
    
    // Vytvoření aktualizovaného pohledu
    const updatedView: JobViewConfig = {
      ...customViews[viewIndex],
      label: newName,
      filters: updatedFilters,
    };
    
    // Aktualizace seznamu vlastních pohledů
    const updatedViews = [...customViews];
    updatedViews[viewIndex] = updatedView;
    setCustomViews(updatedViews);
    
    // Uložení aktualizovaných pohledů do localStorage
    localStorage.setItem(CUSTOM_VIEWS_STORAGE_KEY, JSON.stringify(updatedViews));
    
    // Pokud je tento pohled aktivní, aktualizujeme filtry
    if (activeView === viewId && onViewChange) {
      onViewChange(viewId); // Toto znovu použije stejný viewId ale s novými filtry
    }
  }

  // Funkce pro otevření editačního dialogu
  const openEditDialog = (view: JobViewConfig, e: React.MouseEvent) => {
    e.stopPropagation(); // Zabraňuje aktivaci tabu
    setViewToEdit(view);
    setEditViewOpen(true);
  }

  return (
    <>
      <div className="flex justify-start items-center">
        <Tabs defaultValue={defaultValue} value={activeView} onValueChange={(value) => onViewChange?.(value)} className="">
          <TabsList className="w-full justify-start border-b-0 p-0 left-0 bg-background pl-5">
            {/* Přednastavené pohledy */}
            {initialViews.map((view) => (
              <TabsTrigger
                key={view.value}
                value={view.value}
                className="min-w-[100px] drop-shadow-none data-[state=active]:border-b-2 data-[state=active]:font-medium h-full rounded-none data-[state=active]:border-[#E61F60]"
              >
                <div className="flex items-center gap-2">
                  {view.label}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center justify-center w-6 h-5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 relative group cursor-help">
                        <span className="group-hover:opacity-0 transition-opacity absolute inset-0 flex items-center justify-center">
                          {counts && counts[view.value as keyof typeof counts] !== undefined
                            ? counts[view.value as keyof typeof counts]
                            : 0}
                        </span>
                        <Info className="opacity-0 group-hover:opacity-100 transition-opacity" size={15} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="z-[100]">
                      <p>{getTabDescription(view.value)}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TabsTrigger>
            ))}
            
            {/* Separator mezi preddefined a custom pohledy */}
            {customViews.length > 0 && (
              <div className="h-6 w-px mx-2 bg-gray-200 self-center"></div>
            )}
            
            {/* Vlastní pohledy */}
            {customViews.map((view) => (
              <TabsTrigger
                key={view.value}
                value={view.value}
                className="min-w-[100px] drop-shadow-none data-[state=active]:border-b-2 data-[state=active]:font-medium h-full rounded-none data-[state=active]:border-[#E61F60]"
              >
                <div className="flex items-center gap-2">
                  {view.label}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span 
                        className="inline-flex items-center justify-center w-6 h-5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 relative group cursor-pointer"
                        onClick={(e) => openEditDialog(view, e)}
                      >
                        <span className="group-hover:opacity-0 transition-opacity absolute inset-0 flex items-center justify-center">
                          {counts && counts[view.value as keyof typeof counts] !== undefined
                            ? counts[view.value as keyof typeof counts]
                            : 0}
                        </span>
                        <Edit className="opacity-0 group-hover:opacity-100 transition-opacity" size={15} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="z-[100]">
                      <p>Upravit nastavení pohledu</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* Tlačítko pro odstranění vlastního pohledu */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Zabraňuje aktivaci tabu
                      removeCustomView(view.value);
                    }}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-700"
                    aria-label={`Odstranit pohled ${view.label}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              </TabsTrigger>
            ))}
            
            {/* Tlačítko pro vytvoření nového pohledu */}
            <button
              onClick={() => setCreateViewOpen(true)}
              className="ml-2 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 py-2 px-3 rounded-md hover:bg-gray-100"
            >
              <Plus size={14} />
              <span>Nový pohled</span>
            </button>
          </TabsList>
        </Tabs>
      </div>
      
      <CreateViewDialog
        open={createViewOpen}
        onOpenChange={setCreateViewOpen}
        activeFilters={activeFilters}
        onSave={handleSaveView}
      />
      
      <EditViewDialog
        open={editViewOpen}
        onOpenChange={setEditViewOpen}
        view={viewToEdit}
        onSave={handleUpdateView}
        onDelete={removeCustomView}
      />
    </>
  )
}

