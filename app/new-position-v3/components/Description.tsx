"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heading1, Heading2, Heading3, List, Bold, Italic } from "lucide-react"
import DOMPurify from "dompurify"

interface DescriptionProps {
  initialValue?: string
  onChange?: (value: string) => void
  isViewMode?: boolean
  isBlur?: boolean
  onEdit?: () => void
  onSave?: () => void
}

export function Description({ 
  initialValue = "", 
  onChange, 
  isViewMode = false, 
  isBlur = false,
  onEdit,
  onSave
}: DescriptionProps) {
  const [value, setValue] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(!isViewMode)
  const [sanitizedValue, setSanitizedValue] = useState("")

  // Sanitizace HTML obsahu při změně hodnoty
  useEffect(() => {
    if (typeof window !== 'undefined' && value) {
      const clean = DOMPurify.sanitize(value, {
        ALLOWED_TAGS: ['h3', 'ul', 'ol', 'li', 'p', 'strong', 'em', 'br'],
        ALLOWED_ATTR: []
      })
      setSanitizedValue(clean)
    } else {
      setSanitizedValue("")
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    if (onChange) {
      onChange(e.target.value)
    }
  }

  const toggleEdit = () => {
    if (!isEditing && onEdit) {
      onEdit()
    }
    
    setIsEditing(!isEditing)
    
    if (isEditing && onSave) {
      onSave()
    }
  }

  // CSS třídy pro rozmazání komponenty
  const blurClass = isBlur ? "filter blur-[13px] opacity-[0.5] brightness-[0.8] contrast-[120%]" : ""

  // Nová funkce pro vkládání HTML tagů
  const insertHTMLTag = (tag: string, openClose = true) => {
    const textArea = document.getElementById('description') as HTMLTextAreaElement;
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
      }
    }
    
    setValue(newText);
    if (onChange) {
      onChange(newText);
    }
    
    // Nastavíme focus zpět na textové pole
    setTimeout(() => {
      textArea.focus();
      // Posuneme kurzor za vložený tag
      const newPosition = start + newText.length - value.length;
      textArea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  if (isViewMode && !isEditing) {
    return (
      <div className={`rounded-md flex relative group hover:bg-accent/5 transition-colors ${blurClass}`}>
        <div className="flex justify-between items-start mr-2 w-full">
          <div className="flex flex-col gap-2 w-full">
       
            {value ? (
              <div 
                className="text-sm description-content"
                dangerouslySetInnerHTML={{ __html: sanitizedValue }} 
              />
            ) : (
              <p className="text-base text-muted-foreground">Nespecifikováno</p>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute right-0 top-0 hidden group-hover:block transition-opacity h-7"
            onClick={toggleEdit}
          >
            Upravit
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 my-2 p-4 border border-gray-200 rounded-md ${blurClass}`}>
      <Label htmlFor="description" className="text-base font-medium">
        Popis pozice
      </Label>
      
      {/* Nový formátovací toolbar */}
      <div className="flex items-center gap-2 mb-2 border rounded-md p-2 bg-gray-50">
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
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertHTMLTag('h3')}
          title="Nadpis 3"
          className="h-8 px-2"
        >
          <Heading3 className="h-4 w-4" />
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
        id="description"
        placeholder="Popište náplň práce, odpovědnosti a očekávání od kandidáta. Můžete použít HTML formátování (h3, ul, li, p, strong, em)."
        value={value}
        onChange={handleChange}
        className="min-h-[200px] font-mono text-sm"
      />
      <p className="text-sm text-muted-foreground">
        Detailní popis pozice pomůže kandidátům lépe pochopit, co se od nich očekává. Můžete použít jednoduché HTML formátování.
      </p>
      <div className="text-xs text-muted-foreground mt-1">
        Povolené HTML značky: &lt;h3&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;
      </div>
      {isViewMode && (
        <div className="flex justify-end mt-4">
          <Button onClick={toggleEdit}>
            Uložit
          </Button>
        </div>
      )}
    </div>
  )
} 