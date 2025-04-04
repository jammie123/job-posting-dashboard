"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SalaryInput } from "./components/salary-input"
import { LanguageSelector } from "./components/language-selector"
import { MultiSelect } from "@/components/ui/multi-select"
import { RichTextEditor } from "./components/rich-text-editor"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Loader2, Info } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const localities = {
  headquarters: ["Adresa centrály: Václavské náměstí 837/11, 110 00 Praha 1"],
  branches: ["Adresa pobočky: Dominikánské náměstí 196/1, 602 00 Brno"],
  others: [
    "náměstí Republiky 1/1, 301 00 Plzeň",
    "nám. Dr. E. Beneše 1/1, 460 59 Liberec",
    "Horní náměstí 583, 779 11 Olomouc",
    "Československé armády 408/51, 500 03 Hradec Králové",
    "náměstí Přemysla Otakara II. 1/1, 370 92 České Budějovice",
    "Remote",
  ],
}

const fields = [
  "IT a telekomunikace",
  "Finance a účetnictví",
  "Marketing a PR",
  "Administrativa",
  "Výroba a průmysl",
  "Obchod a prodej",
  "Logistika a doprava",
  "Stavebnictví",
]

const professions = [
  "Programátor",
  "Tester",
  "Projektový manažer",
  "Obchodní zástupce",
  "Účetní",
  "Marketingový specialista",
  "HR specialista",
  "Skladník",
]

const benefits = [
  "13. plat",
  "5 týdnů dovolené",
  "Stravenky",
  "MultiSport karta",
  "Flexibilní pracovní doba",
  "Home office",
  "Sick days",
  "Příspěvek na dopravu",
  "Příspěvek na penzijní připojištění",
  "Firemní notebook",
  "Firemní telefon",
]

const educationLevels = [
  "Základní",
  "Středoškolské",
  "Středoškolské s maturitou",
  "Vyšší odborné",
  "Vysokoškolské bakalářské",
  "Vysokoškolské magisterské",
  "Vysokoškolské doktorské",
]

const FormSchema = z.object({
  title: z.string().min(1, "Název pozice je povinný"),
  locality: z.array(z.string()).min(1, "Vyberte alespoň jednu lokalitu"),
  field: z.string().min(1, "Vyberte obor"),
  profession: z.array(z.string()).min(1, "Vyberte alespoň jednu profesi"),
  description: z.string().min(1, "Popis pozice je povinný"),
  education: z.string().min(1, "Vyberte požadované vzdělání"),
  benefits: z.array(z.string()),
  type: z.enum(["full", "part"], {
    required_error: "Vyberte typ úvazku",
  }),
})

// Funkce pro volání OpenAI API
async function suggestFieldAndProfession(position: string) {
  try {
    const response = await fetch('/api/suggest-fields', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ position }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error suggesting fields:', error);
    throw error;
  }
}

export function FirstStep() {
  const [isRemote, setIsRemote] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [autoFilledInfo, setAutoFilledInfo] = useState<{field: string, professions: string[]} | null>(null)
  const [showFieldsForm, setShowFieldsForm] = useState(false)
  
  // Stav pro sledování načítání pro jednotlivá pole
  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>({
    title: false,
    field: false,
    profession: false,
    description: false,
    education: false,
    benefits: false,
    type: false,
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      locality: [],
      profession: [],
      benefits: [],
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  // Funkce pro reset autoFilledInfo
  const resetAutoFilledInfo = () => {
    setAutoFilledInfo(null);
    setShowFieldsForm(true); // Zobrazí pole po skrytí zprávy
  };
  
  // Funkce pro zobrazení polí oboru a profese
  const showFieldsFormHandler = () => {
    setShowFieldsForm(true);
  };

  // Funkce pro zpracování blur eventu na poli "název pozice"
  const handlePositionBlur = async (positionName: string) => {
    if (!positionName || positionName.trim() === "") {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/suggest-fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: positionName }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suggested fields");
      }

      const data = await response.json();
      
      if (data.field && data.professions) {
        // Pokud máme úspěšnou odpověď, nastavíme data do formuláře
        form.setValue("field", data.field);
        form.setValue("profession", data.professions);
        
        // Nastavíme autoFilledInfo pro zobrazení zprávy
        setAutoFilledInfo({
          field: data.field,
          professions: data.professions,
        });
        
        // Skryjeme formulář s poli pro obor a profesi
        setShowFieldsForm(false);
        
        toast.success("Na základě názvu jsme předvyplnili obor a profese.");
      } else {
        // Pokud nemáme data, zobrazíme formulář s poli
        setShowFieldsForm(true);
      }
    } catch (error) {
      console.error("Error fetching suggested fields:", error);
      toast.error("Nepodařilo se načíst doporučená data pro obor a profese.");
      
      // V případě chyby zobrazíme formulář s poli
      setShowFieldsForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Generická funkce pro zpracování blur událostí
  const handleInputBlur = async (fieldId: string, value: any, processFn?: (value: any) => Promise<any>) => {
    if (!value) return;

    // Nastavit načítání pro dané pole
    setLoadingFields(prev => ({ ...prev, [fieldId]: true }));
    
    try {
      // Pokud je poskytnuta processFn, použít ji pro zpracování hodnoty
      if (processFn) {
        await processFn(value);
      } else {
        // Simulace zpracování pro ostatní pole (pouze pro demonstraci)
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Error processing ${fieldId}:`, error);
      toast.error(`Chyba při zpracování pole ${fieldId}`);
    } finally {
      // Ukončit načítání pro dané pole
      setLoadingFields(prev => ({ ...prev, [fieldId]: false }));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="title">Název pozice</Label>
          <div className="relative">
            <Input 
              id="title" 
              {...form.register("title")} 
              onBlur={(e) => handleInputBlur("title", e.target.value.trim(), handlePositionBlur)}
            />
            {loadingFields.title && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">načítám...</span>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        {/* Zobrazení informační zprávy po automatickém vyplnění */}
        {autoFilledInfo && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="py-3 pb-1">
              <div className="flex items-center gap-2">
                <Info size={18} className="text-foreground" />
                <CardTitle className="text-sm font-medium text-foreground">Předvyplnili jsme za Vás obory a profese</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <div className="text-sm text-muted-foreground mb-2">
                {autoFilledInfo.field && (
                  <p>
                    <span className="font-medium">
                      {autoFilledInfo.field}{autoFilledInfo.professions.length > 0 && ' - '}{autoFilledInfo.professions.join(", ")}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-muted-foreground hover:text-foreground"
                  onClick={showFieldsFormHandler}
                >
                  Změnit obor a profesi
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-muted-foreground hover:text-foreground"
                  onClick={resetAutoFilledInfo}
                >
                  Skrýt zprávu
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label>Lokalita</Label>
            <div className="flex items-center gap-2">
              <Label htmlFor="remote-switch" className="text-sm font-normal">
                Vzdálená práce
              </Label>
              <Switch
                id="remote-switch"
                checked={isRemote}
                onCheckedChange={(checked) => {
                  setIsRemote(checked)
                  if (checked) {
                    // If remote is enabled, clear the locality selection
                    form.setValue("locality", [])
                  }
                }}
              />
            </div>
          </div>
          <div className="relative">
            <MultiSelect
              options={[...localities.headquarters, ...localities.branches, ...localities.others]}
              selected={form.watch("locality")}
              onChange={(value) => {
                form.setValue("locality", value)
                handleInputBlur("locality", value)
              }}
              placeholder="Vyberte lokality"
              isRemote={isRemote}
              headquartersAddress={localities.headquarters[0]}
            />
            {loadingFields.locality && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">načítám...</span>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          {form.formState.errors.locality && (
            <p className="text-sm text-destructive">{form.formState.errors.locality.message}</p>
          )}
          {isRemote && (
            <p className="text-xs text-muted-foreground">
              U remote pozice bude použita adresa vaší firmy {localities.headquarters[0]}
            </p>
          )}
        </div>

        {/* Sekce s oborem a profesí - skrytá ve výchozím stavu */}
        {showFieldsForm && (
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Obor</Label>
              <div className="relative">
                <Select 
                  onValueChange={(value) => {
                    form.setValue("field", value)
                    handleInputBlur("field", value)
                  }}
                  value={form.watch("field")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte obor" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingFields.field && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">načítám...</span>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              {form.formState.errors.field && (
                <p className="text-sm text-destructive">{form.formState.errors.field.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Profese</Label>
              <div className="relative">
                <MultiSelect
                  options={professions}
                  selected={form.watch("profession")}
                  onChange={(value) => {
                    form.setValue("profession", value)
                    handleInputBlur("profession", value)
                  }}
                  placeholder="Vyberte profese"
                />
                {loadingFields.profession && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">načítám...</span>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              {form.formState.errors.profession && (
                <p className="text-sm text-destructive">{form.formState.errors.profession.message}</p>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="description">Popis pozice</Label>
          <div className="relative">
            <RichTextEditor
              value={form.watch("description") || ""}
              onChange={(value) => {
                form.setValue("description", value)
                handleInputBlur("description", value)
              }}
              className="min-h-[200px]"
            />
            {loadingFields.description && (
              <div className="absolute right-3 top-3 flex items-center gap-1.5 bg-white/90 px-2 py-1 rounded-md z-10">
                <span className="text-xs text-muted-foreground">načítám...</span>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          {form.formState.errors.description && (
            <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
          )}
        </div>

        <SalaryInput />

        <div className="grid gap-2">
          <Label>Vzdělání</Label>
          <div className="relative">
            <Select 
              onValueChange={(value) => {
                form.setValue("education", value)
                handleInputBlur("education", value)
              }}
              value={form.watch("education")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vyberte minimální vzdělání" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loadingFields.education && (
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">načítám...</span>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          {form.formState.errors.education && (
            <p className="text-sm text-destructive">{form.formState.errors.education.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Jazykové znalosti</Label>
          <LanguageSelector />
        </div>

        <div className="grid gap-2">
          <Label>Benefity</Label>
          <div className="relative">
            <MultiSelect
              options={benefits}
              selected={form.watch("benefits")}
              onChange={(value) => {
                form.setValue("benefits", value)
                handleInputBlur("benefits", value)
              }}
              placeholder="Vyberte benefity"
            />
            {loadingFields.benefits && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">načítám...</span>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          {form.formState.errors.benefits && (
            <p className="text-sm text-destructive">{form.formState.errors.benefits.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Typ úvazku</Label>
          <div className="relative">
            <RadioGroup 
              value={form.watch("type")} 
              onValueChange={(value) => {
                form.setValue("type", value as "full" | "part")
                handleInputBlur("type", value)
              }}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full" className="font-normal">Hlavní pracovní poměr</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="part" id="part" />
                <Label htmlFor="part" className="font-normal">Zkrácený úvazek</Label>
              </div>
            </RadioGroup>
            {loadingFields.type && (
              <div className="absolute right-3 top-3 flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">načítám...</span>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          {form.formState.errors.type && (
            <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Pokračovat</Button>
      </div>
    </form>
  )
}

