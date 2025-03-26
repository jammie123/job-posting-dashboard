"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const languages = [
  { code: "cs", name: "Čeština" },
  { code: "en", name: "Angličtina" },
  { code: "de", name: "Němčina" },
  { code: "sk", name: "Slovenština" },
]

const levels = [
  { value: "none", label: "Vůbec" },
  { value: "basic", label: "Základní" },
  { value: "advanced", label: "Pokročilý" },
  { value: "native", label: "Rodilý mluvčí" },
]

interface SelectedLanguage {
  code: string
  name: string
  level: string
}

export function LanguageSelector() {
  const [selectedLanguages, setSelectedLanguages] = useState<SelectedLanguage[]>([
    { code: "cs", name: "Čeština", level: "none" },
    { code: "en", name: "Angličtina", level: "none" },
    { code: "de", name: "Němčina", level: "none" },
    { code: "sk", name: "Slovenština", level: "none" },
  ])

  const handleLanguageSelect = (language: { code: string; name: string }) => {
    if (!selectedLanguages.find((l) => l.code === language.code)) {
      setSelectedLanguages([...selectedLanguages, { ...language, level: "none" }])
    }
  }

  const handleLevelChange = (languageCode: string, level: string) => {
    setSelectedLanguages(selectedLanguages.map((lang) => (lang.code === languageCode ? { ...lang, level } : lang)))
  }

  const removeLanguage = (languageCode: string) => {
    setSelectedLanguages(selectedLanguages.filter((lang) => lang.code !== languageCode))
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-muted/50 text-xs">
            <tr className="border-b">
              <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Jazyk</th>
              <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Úroveň</th>
              <th className="h-10 w-[100px] px-2 text-left align-middle font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {selectedLanguages.map((language) => (
              <tr key={language.code} className="border-b">
                <td className="p-4">{language.name}</td>
                <td className="px-2">
                  <ToggleGroup
                    type="single"
                    value={language.level}
                    onValueChange={(value) => value && handleLevelChange(language.code, value)}
                    className="justify-start"
                  >
                    {levels.map((level) => (
                      <ToggleGroupItem
                        key={level.value}
                        value={level.value}
                        aria-label={`${language.name} - ${level.label}`}
                        className="px-3"
                      >
                        {level.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </td>
                <td className="px-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeLanguage(language.code)}
                  >
                    Odebrat
                  </Button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Přidat jazyk
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {languages
                      .filter((language) => !selectedLanguages.find((l) => l.code === language.code))
                      .map((language) => (
                        <DropdownMenuItem key={language.code} onSelect={() => handleLanguageSelect(language)}>
                          {language.name}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

