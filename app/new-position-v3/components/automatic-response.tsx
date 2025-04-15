"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Heading1, Heading2, Heading3, List, Bold, Italic, ListOrdered, AlignLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import DOMPurify from "dompurify"

const defaultResponseText = `<p>Vážený uchazeči,</p>
<p>děkujeme za Váš zájem o pozici v naší společnosti. Tímto potvrzujeme přijetí Vaší žádosti.</p>
<p>Váš životopis a další materiály budou pečlivě posouzeny. V případě, že Váš profil bude odpovídat našim požadavkům, budeme Vás kontaktovat ohledně dalších kroků v přijímacím řízení.</p>
<p>Děkujeme za Váš čas a zájem o práci v naší společnosti.</p>
<p>S pozdravem,<br>HR tým</p>`

// Vylepšený RichTextEditor s WYSIWYG rozhraním
interface CustomRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function CustomRichTextEditor({ value, onChange, className = "" }: CustomRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [sanitizedValue, setSanitizedValue] = useState(value);

  // Sanitizace HTML obsahu při změně hodnoty
  useEffect(() => {
    if (typeof window !== 'undefined' && value) {
      const clean = DOMPurify.sanitize(value, {
        ALLOWED_TAGS: ['h1', 'h2', 'h3', 'ul', 'ol', 'li', 'p', 'strong', 'em', 'br', 'div', 'span'],
        ALLOWED_ATTR: ['style', 'class']
      });
      setSanitizedValue(clean);

      // Nastavíme sanitizovaný obsah do editoru, pokud je k dispozici
      if (editorRef.current) {
        editorRef.current.innerHTML = clean;
      }
    } else {
      setSanitizedValue("");
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    }
  }, [value]);

  // Sledujeme změny v editoru a aktualizujeme hodnotu
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleInput = () => {
      const newValue = editor.innerHTML;
      onChange(newValue);
    };

    editor.addEventListener('input', handleInput);
    return () => {
      editor.removeEventListener('input', handleInput);
    };
  }, [onChange]);

  // Funkce pro použití formátovacích příkazů
  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    // Získáme aktuální obsah po úpravě
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML;
      onChange(newValue);
      // Vracíme focus na editor
      editorRef.current.focus();
    }
  };

  // Funkce pro vložení HTML prvku
  const insertElement = (tag: string) => {
    if (tag === 'ul') {
      execCommand('insertUnorderedList');
    } else if (tag === 'ol') {
      execCommand('insertOrderedList');
    } else if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
      execCommand('formatBlock', `<${tag}>`);
    } else if (tag === 'p') {
      execCommand('formatBlock', '<p>');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2 border rounded-md p-2 bg-gray-50">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => execCommand('formatBlock', '<p>')}
          title="Odstavec"
          className="h-8 px-2"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertElement('h1')}
          title="Nadpis 1"
          className="h-8 px-2"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost"
          size="sm" 
          onClick={() => insertElement('h2')}
          title="Nadpis 2"
          className="h-8 px-2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="h-5 w-[1px] bg-gray-300 mx-1"></div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertElement('ul')}
          title="Seznam s odrážkami"
          className="h-8 px-2"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertElement('ol')}
          title="Číslovaný seznam"
          className="h-8 px-2"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="h-5 w-[1px] bg-gray-300 mx-1"></div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => execCommand('bold')}
          title="Tučné písmo"
          className="h-8 px-2"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => execCommand('italic')}
          title="Kurzíva"
          className="h-8 px-2"
        >
          <Italic className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className={`min-h-[200px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary overflow-auto ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizedValue }}
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