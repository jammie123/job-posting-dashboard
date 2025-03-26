"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// Import the AutomaticResponse component at the top of the file
import { AutomaticResponse } from "./automatic-response"

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

export function ApplicationForm() {
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", name: "Jméno a Příjmení", type: "text", visibility: "required" },
    { id: "2", name: "Email", type: "text", visibility: "required" },
    { id: "3", name: "Telefon", type: "text", visibility: "required" },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: "text",
  })

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
      <div className="space-y-4">
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

      <div className="pt-4 border-t">
        <AutomaticResponse />
      </div>

      <div className="flex justify-between pt-6 mt-6 border-t">
        <Button variant="outline">Zpět</Button>
        <Button>Pokračovat</Button>
      </div>
    </div>
  )
}

