"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Heading1, Heading2, Heading3, List, Bold, Italic, ListOrdered } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

const defaultResponseText = `<p>Vážený uchazeči,</p>
<p>děkujeme za Váš zájem o pozici v naší společnosti. Tímto potvrzujeme přijetí Vaší žádosti.</p>
<p>Váš životopis a další materiály budou pečlivě posouzeny. V případě, že Váš profil bude odpovídat našim požadavkům, budeme Vás kontaktovat ohledně dalších kroků v přijímacím řízení.</p>
<p>Děkujeme za Váš čas a zájem o práci v naší společnosti.</p>
<p>S pozdravem,<br>HR tým</p>`

// Vlastní RichTextEditor komponenta
interface CustomRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function CustomRichTextEditor({ value, onChange, className = "" }: CustomRichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertHTMLTag = (tag: string, openClose = true) => {
    const textArea = textareaRef.current;
    if (!textArea) return;

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = '';
    if (openClose) {
      const openTag = `<${tag}>`;
      const closeTag = `</${tag}>`;
      newText = value.substring(0, start) + openTag + selectedText + closeTag + value.substring(end);
    } else {
      // Pro tagy jako <li>, které potřebují být uvnitř seznamu
      if (tag === 'li') {
        newText = value.substring(0, start) + `<li>${selectedText}</li>` + value.substring(end);
      } else if (tag === 'ul') {
        newText = value.substring(0, start) + `<ul>\n  <li>${selectedText}</li>\n</ul>` + value.substring(end);
      } else if (tag === 'ol') {
        newText = value.substring(0, start) + `<ol>\n  <li>${selectedText}</li>\n</ol>` + value.substring(end);
      } else if (tag === 'p') {
        newText = value.substring(0, start) + `<p>${selectedText}</p>` + value.substring(end);
      }
    }
    
    onChange(newText);
    
    // Nastavíme focus zpět na textové pole
    setTimeout(() => {
      textArea.focus();
      // Posuneme kurzor za vložený tag
      const newPosition = start + newText.length - value.length;
      textArea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2 border rounded-md p-2 bg-gray-50">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertHTMLTag('p', false)}
          title="Odstavec"
          className="h-8 px-2"
        >
          <span className="text-xs font-mono">P</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertHTMLTag('h1')}
          title="Nadpis 1"
          className="h-8 px-2"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertHTMLTag('h2')}
          title="Nadpis 2"
          className="h-8 px-2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="h-5 w-[1px] bg-gray-300 mx-1"></div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertHTMLTag('ul', false)}
          title="Seznam s odrážkami"
          className="h-8 px-2"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertHTMLTag('ol', false)}
          title="Číslovaný seznam"
          className="h-8 px-2"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertHTMLTag('li', false)}
          title="Položka seznamu"
          className="h-8 px-2"
        >
          <span className="text-xs font-mono">LI</span>
        </Button>
        <div className="h-5 w-[1px] bg-gray-300 mx-1"></div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertHTMLTag('strong')}
          title="Tučné písmo"
          className="h-8 px-2"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertHTMLTag('em')}
          title="Kurzíva"
          className="h-8 px-2"
        >
          <Italic className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`font-mono text-sm ${className}`}
        rows={10}
      />
      <div className="text-xs text-muted-foreground">
        Povolené HTML značky: &lt;p&gt;, &lt;h1&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;
      </div>
    </div>
  );
}

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
          <Switch checked={true} onCheckedChange={setIsEnabled} aria-label="Povolit automatickou odpověď" />
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
            <CustomRichTextEditor 
              value={content} 
              onChange={handleContentChange} 
              className="min-h-[200px]" 
            />
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