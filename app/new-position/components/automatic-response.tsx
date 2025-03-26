"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "./rich-text-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const defaultResponseText = `<p>Vážený uchazeči,</p>
<p>děkujeme za Váš zájem o pozici v naší společnosti. Tímto potvrzujeme přijetí Vaší žádosti.</p>
<p>Váš životopis a další materiály budou pečlivě posouzeny. V případě, že Váš profil bude odpovídat našim požadavkům, budeme Vás kontaktovat ohledně dalších kroků v přijímacím řízení.</p>
<p>Děkujeme za Váš čas a zájem o práci v naší společnosti.</p>
<p>S pozdravem,<br>HR tým</p>`

interface AutomaticResponseProps {
  onChange?: (data: { template: string; subject: string; content: string }) => void
}

export function AutomaticResponse({ onChange }: AutomaticResponseProps) {
  const [template, setTemplate] = useState("default")
  const [subject, setSubject] = useState("Potvrzení přijetí Vaší žádosti")
  const [content, setContent] = useState(defaultResponseText)
  const [isEnabled, setIsEnabled] = useState(true)

  const handleTemplateChange = (value: string) => {
    setTemplate(value)
    onChange?.({ template: value, subject, content })
  }

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value)
    onChange?.({ template, subject: e.target.value, content })
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    onChange?.({ template, subject, content: value })
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0 flex flex-row justify-between items-center">
        <div className="flex items-center gap-3">
          <Switch checked={isEnabled} onCheckedChange={setIsEnabled} aria-label="Povolit automatickou odpověď" />
          <CardTitle className="text-lg font-medium">Automatická odpověď uchazeči</CardTitle>
        </div>
        {isEnabled && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">šablona odpovědi</span>
            <Select value={template} onValueChange={handleTemplateChange}>
              <SelectTrigger id="response-template" className="w-[200px]">
                <SelectValue placeholder="Vyberte šablonu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Výchozí šablona</SelectItem>
                <SelectItem value="detailed">Detailní šablona</SelectItem>
                <SelectItem value="minimal">Minimální šablona</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      {isEnabled ? (
        <CardContent className="px-0 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="response-subject">Předmět</Label>
            <Input
              id="response-subject"
              value={subject}
              onChange={handleSubjectChange}
              placeholder="Zadejte předmět automatické odpovědi"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="response-content">Obsah zprávy</Label>
            <RichTextEditor value={content} onChange={handleContentChange} className="min-h-[200px]" />
          </div>
        </CardContent>
      ) : (
        <CardContent className="px-0">
          <p className="text-sm text-muted-foreground">
            Automatická odpověď se uchazeči odešle okamžitě, co odešle odpovědní formulář k pozici
          </p>
        </CardContent>
      )}
    </Card>
  )
}

