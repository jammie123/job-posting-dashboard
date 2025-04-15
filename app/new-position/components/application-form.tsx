"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
// Import the AutomaticResponse component at the top of the file
import { AutomaticResponse } from "./automatic-response"
import { CardTitle } from "@/components/ui/card"

// Komponenta pro bezpečné vykreslení HTML popisu pozice
interface PositionDescriptionProps {
  html: string;
  className?: string;
}

function PositionDescription({ html, className = "" }: PositionDescriptionProps) {
  return (
    <div 
      className={`position-description ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

type QuestionType = "text" | "multiple" | "single" | "date"
type QuestionVisibility = "required" | "optional" | "hidden"

interface Question {
  id: string
  name: string
  type: QuestionType
  visibility: QuestionVisibility
}

const questionTypes = [
  { value: "text", label: "Jednoduchý text" },
  { value: "multiple", label: "Výběr z více možností" },
  { value: "single", label: "Výběr z jedné možnosti" },
  { value: "date", label: "Datum" },
]

// Přidáme props interface
interface ApplicationFormProps {
  initialData?: any;
  onDataChange?: (data: any) => void;
  onNextStep?: () => void;
  onPrevStep?: () => void;
}

export function ApplicationForm({ initialData, onDataChange, onNextStep, onPrevStep }: ApplicationFormProps) {
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions || [
      { id: "1", name: "Jméno a Příjmení", type: "text", visibility: "required" },
      { id: "2", name: "Email", type: "text", visibility: "required" },
      { id: "3", name: "Telefon", type: "text", visibility: "required" },
    ]
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: "text",
  })
  const [positionDescription, setPositionDescription] = useState<string>("");
  const descriptionFetchedRef = useRef<{[key: string]: boolean}>({});
  const [isEnabled, setIsEnabled] = useState(true);

  // Efekt pro načtení popisu pozice z API při inicializaci - pouze jednou pro každý název pozice
  useEffect(() => {
    // Funkce pro získání popisu pozice z API
    const fetchPositionDescription = async (positionName: string) => {
      // Pokud již byl tento popis načten, neprovádíme opakované volání API
      if (descriptionFetchedRef.current[positionName]) {
        console.log(`Popis pozice pro '${positionName}' již byl načten dříve.`);
        return;
      }

      try {
        console.log(`Načítám popis pozice pro '${positionName}'...`);
        const response = await fetch('/api/suggest-fields', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ position: positionName }),
        });
        
        if (!response.ok) {
          throw new Error('Nelze načíst popis pozice');
        }
        
        const data = await response.json();
        if (data.description) {
          setPositionDescription(data.description);
          // Zaznamenáme, že byl popis úspěšně načten
          descriptionFetchedRef.current[positionName] = true;
        }
      } catch (error) {
        console.error('Chyba při načítání popisu pozice:', error);
      }
    };

    // Pokud je v initialData název pozice, načíst popis
    const positionName = initialData?.positionName;
    if (positionName && positionName.trim() !== '') {
      fetchPositionDescription(positionName);
    }
  }, [initialData?.positionName]);

  // Přidáme effect pro aktualizaci dat při změně otázek
  useEffect(() => {
    if (onDataChange) {
      // Porovnáme current questions s initial questions pro zjištění, zda došlo ke změně
      const initialQuestions = initialData?.questions || [];
      const questionsChanged = questions.length !== initialQuestions.length || 
        JSON.stringify(questions) !== JSON.stringify(initialQuestions);
      
      // Voláme onDataChange pouze pokud se questions skutečně změnily
      if (questionsChanged) {
        onDataChange({ 
          questions 
        });
      }
    }
  }, [questions, onDataChange, initialData?.questions]);

  const handleAddQuestion = () => {
    if (newQuestion.name && newQuestion.type) {
      setQuestions([
        ...questions,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: newQuestion.name,
          type: newQuestion.type as QuestionType,
          visibility: "optional",
        },
      ])
      setNewQuestion({ type: "text" })
      setIsDialogOpen(false)
    }
  }

  const handleVisibilityChange = (questionId: string, visibility: QuestionVisibility) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, visibility } : q)))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 relative">
      <div className="flex items-center gap-3">
          <Switch 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled}
            aria-label="Povolit dotazník pro uchazeče" 
          />
          <CardTitle className="text-lg font-medium">Dotazník pro uchazeče</CardTitle>
        </div>

        {isEnabled && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Šablona:</span>
            <Select defaultValue="default">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Vyberte šablonu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Výchozí šablona</SelectItem>
                <SelectItem value="it">IT pozice</SelectItem>
                <SelectItem value="sales">Obchodní pozice</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="hr">HR pozice</SelectItem>
                <SelectItem value="custom">Vlastní šablona</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      {isEnabled ? (
        <div className="space-y-4">
          {/* Hlavní formulář otázek - vždy nahoře */}
          <div className="rounded-md border">
            <table className="w-full">
              <thead className="bg-muted/50 text-xs">
                <tr className="border-b">
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Otázka</th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Typ</th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Viditelnost</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question.id} className="border-b">
                    <td className="p-4">{question.name}</td>
                    <td className="p-4">{questionTypes.find((t) => t.value === question.type)?.label}</td>
                    <td className="p-4">
                      <RadioGroup
                        value={question.visibility}
                        onValueChange={(value) => handleVisibilityChange(question.id, value as QuestionVisibility)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="required" id={`${question.id}-required`} />
                          <Label htmlFor={`${question.id}-required`}>Povinné</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="optional" id={`${question.id}-optional`} />
                          <Label htmlFor={`${question.id}-optional`}>Volitelné</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hidden" id={`${question.id}-hidden`} />
                          <Label htmlFor={`${question.id}-hidden`}>Skryté</Label>
                        </div>
                      </RadioGroup>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="p-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Přidat otázku
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Přidat novou otázku</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Název otázky</Label>
                            <Input
                              id="name"
                              value={newQuestion.name || ""}
                              onChange={(e) => setNewQuestion({ ...newQuestion, name: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="type">Typ odpovědi</Label>
                            <Select
                              value={newQuestion.type}
                              onValueChange={(value) => setNewQuestion({ ...newQuestion, type: value as QuestionType })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Vyberte typ odpovědi" />
                              </SelectTrigger>
                              <SelectContent>
                                {questionTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Zrušit
                          </Button>
                          <Button onClick={handleAddQuestion}>Uložit</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-muted/30 rounded-lg border border-muted text-muted-foreground">
          <p>Když potřebujete od kandidáta nějaké vstupní data na základě, kterých můžete dělat preselekci. např. mzda, řidičský průkaz, datum nástustupu atd</p>
        </div>
      )}
    </div>
  )
}

