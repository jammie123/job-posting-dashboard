"use client"

import { useState, useEffect, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heading1, Heading2, Heading3, List, Bold, Italic, ListOrdered, AlignLeft, Sparkles, Loader2 } from "lucide-react"
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
  const editorRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Sanitizace HTML obsahu při změně hodnoty
  useEffect(() => {
    if (typeof window !== 'undefined' && value) {
      const clean = DOMPurify.sanitize(value, {
        ALLOWED_TAGS: ['h1', 'h2', 'h3', 'ul', 'ol', 'li', 'p', 'strong', 'em', 'br', 'div', 'span'],
        ALLOWED_ATTR: ['style', 'class']
      })
      setSanitizedValue(clean)

      // Nastavíme sanitizovaný obsah do editoru, pokud je k dispozici
      if (editorRef.current) {
        editorRef.current.innerHTML = clean
        // Aplikujeme Tailwind třídy na všechny prvky
        applyTailwindClasses(editorRef.current)
      }
    } else {
      setSanitizedValue("")
      if (editorRef.current) {
        editorRef.current.innerHTML = ""
      }
    }
  }, [value, isEditing])

  // Funkce pro čištění vnořených elementů (span) z obsahu
  const cleanNestedElements = (container: HTMLElement) => {
    // Najdeme všechny nadpisy a odstavce
    const elements = container.querySelectorAll('h1, h2, h3, p')
    
    elements.forEach(el => {
      // Pokud element obsahuje span, vyčistíme ho
      const spans = el.querySelectorAll('span')
      if (spans.length > 0) {
        // Zachováme obsah, ale odstraníme vnořené span elementy
        const content = el.textContent || ''
        el.innerHTML = content
      }
    })
  }

  // Vylepšená funkce pro aplikaci tříd, která zároveň vyčistí vnořené elementy
  const applyTailwindClasses = (container: HTMLElement) => {
    // Nejprve vyčistíme vnořené elementy
    cleanNestedElements(container)
    
    // Poté aplikujeme třídy
    container.querySelectorAll('h1').forEach(el => {
      el.classList.add('text-2xl', 'font-semibold', 'my-2')
    })
    container.querySelectorAll('h2').forEach(el => {
      el.classList.add('text-xl', 'font-semibold', 'my-2')
    })
    container.querySelectorAll('h3').forEach(el => {
      el.classList.add('text-lg', 'font-medium', 'my-2')
    })
    container.querySelectorAll('ul').forEach(el => {
      el.classList.add('list-disc', 'pl-5', 'my-2')
    })
    container.querySelectorAll('ol').forEach(el => {
      el.classList.add('list-decimal', 'pl-5', 'my-2')
    })
    container.querySelectorAll('p').forEach(el => {
      el.classList.add('my-2')
    })
  }

  // Sledujeme změny v editoru a aktualizujeme hodnotu
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const handleInput = () => {
      const newValue = editor.innerHTML
      setValue(newValue)
      if (onChange) {
        onChange(newValue)
      }
    }

    editor.addEventListener('input', handleInput)
    return () => {
      editor.removeEventListener('input', handleInput)
    }
  }, [onChange])

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
    
    const newEditingState = !isEditing
    setIsEditing(newEditingState)
    
    // Po přepnutí do režimu úprav aktualizuj obsah editoru
    if (newEditingState && editorRef.current) {
      editorRef.current.innerHTML = sanitizedValue
      // Aplikujeme Tailwind třídy na všechny prvky
      applyTailwindClasses(editorRef.current)
    }
    
    if (isEditing && onSave) {
      onSave()
    }
  }

  // CSS třídy pro rozmazání komponenty
  const blurClass = isBlur ? "filter blur-[13px] opacity-[0.5] brightness-[0.8] contrast-[120%]" : ""

  // Funkce pro použití formátovacích příkazů
  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value)
    // Získáme aktuální obsah po úpravě
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML
      setValue(newValue)
      if (onChange) {
        onChange(newValue)
      }
      // Vracíme focus na editor
      editorRef.current.focus()
    }
  }

  // Funkce pro vložení HTML prvku
  const insertElement = (tag: string) => {
    if (tag === 'ul') {
      execCommand('insertUnorderedList')
      // Aplikace stylu na seznam po vložení
      setTimeout(() => {
        if (editorRef.current) {
          const lists = editorRef.current.querySelectorAll('ul')
          lists.forEach(list => {
            list.classList.add('list-disc', 'pl-5', 'my-2')
          })
          const newValue = editorRef.current.innerHTML
          setValue(newValue)
          if (onChange) {
            onChange(newValue)
          }
        }
      }, 0)
    } else if (tag === 'ol') {
      execCommand('insertOrderedList')
      // Aplikace stylu na číslovaný seznam po vložení
      setTimeout(() => {
        if (editorRef.current) {
          const lists = editorRef.current.querySelectorAll('ol')
          lists.forEach(list => {
            list.classList.add('list-decimal', 'pl-5', 'my-2')
          })
          const newValue = editorRef.current.innerHTML
          setValue(newValue)
          if (onChange) {
            onChange(newValue)
          }
        }
      }, 0)
    } else if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'p') {
      // Nejprve jen aplikujeme základní HTML element bez tříd
      execCommand('formatBlock', `<${tag}>`)
      
      // Poté aplikujeme Tailwind třídy
      setTimeout(() => {
        if (editorRef.current) {
          // Najdeme všechny nově vytvořené elementy
          if (tag === 'h1') {
            editorRef.current.querySelectorAll('h1').forEach(el => {
              // Vyčistíme vnořené span elementy
              if (el.querySelector('span')) {
                const content = el.textContent || ''
                el.innerHTML = content
              }
              el.classList.add('text-2xl', 'font-semibold', 'my-2')
            })
          } else if (tag === 'h2') {
            editorRef.current.querySelectorAll('h2').forEach(el => {
              if (el.querySelector('span')) {
                const content = el.textContent || ''
                el.innerHTML = content
              }
              el.classList.add('text-xl', 'font-semibold', 'my-2')
            })
          } else if (tag === 'h3') {
            editorRef.current.querySelectorAll('h3').forEach(el => {
              if (el.querySelector('span')) {
                const content = el.textContent || ''
                el.innerHTML = content
              }
              el.classList.add('text-lg', 'font-medium', 'my-2')
            })
          } else if (tag === 'p') {
            editorRef.current.querySelectorAll('p').forEach(el => {
              if (el.querySelector('span')) {
                const content = el.textContent || ''
                el.innerHTML = content
              }
              el.classList.add('my-2')
            })
          }
          
          const newValue = editorRef.current.innerHTML
          setValue(newValue)
          if (onChange) {
            onChange(newValue)
          }
        }
      }, 10)
    }
  }

  // Funkce pro generování popisu pomocí AI
  const handleGenerateDescription = async () => {
    if (isGenerating) return
    
    setIsGenerating(true)
    try {
      // Zde by byla implementace volání AI API
      // Pro demonstraci pouze simulujeme zpoždění
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulujeme vygenerovaný popis
      const generatedDescription = `<h1 class="text-2xl font-semibold my-2">O pozici</h1>
<p class="my-2">Hledáme motivované kandidáty pro pozici, kteří mají zájem o profesní růst v dynamickém prostředí.</p>
<h2 class="text-xl font-semibold my-2">Náplň práce</h2>
<ul class="list-disc pl-5 my-2">
  <li>Aktivní řešení zadaných úkolů</li>
  <li>Spolupráce v týmu</li>
  <li>Rozvoj odborných znalostí</li>
</ul>
<h2 class="text-xl font-semibold my-2">Požadujeme</h2>
<ul class="list-disc pl-5 my-2">
  <li>Spolehlivost a zodpovědnost</li>
  <li>Ochotu učit se novým věcem</li>
  <li>Proaktivní přístup k práci</li>
</ul>`;
      
      // Nastavíme hodnotu
      setValue(generatedDescription)
      if (onChange) {
        onChange(generatedDescription)
      }
    } catch (error) {
      console.error("Chyba při generování popisu:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isViewMode && !isEditing) {
    return (
      <div className={`rounded-md flex relative group hover:bg-accent/5 transition-colors ${blurClass}`}>
        <div className="flex justify-between items-start mr-2 w-full h-full">
          <div className="flex flex-col gap-2 w-full h-full">
       
            {value ? (
              <div 
                className="text-sm description-content prose prose-sm max-w-none h-full"
                dangerouslySetInnerHTML={{ __html: sanitizedValue }} 
              />
            ) : (
              <p className="text-base text-muted-foreground">Nespecifikováno</p>
            )}
          </div>
          <div className="flex gap-1 absolute right-0 top-0 hidden group-hover:flex transition-opacity">
            {/* Ikona tlačítko pro generování popisu */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleGenerateDescription}
              disabled={isGenerating}
              className="h-7 w-7 p-1 rounded-full hover:bg-blue-100 hover:text-blue-700 group"
              title="Vygenerovat popis pomocí AI"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span className="sr-only">Vygenerovat popis pomocí AI</span>
                  <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-black text-xs p-1.5 rounded whitespace-nowrap z-50 text-white">
                    Vygenerovat popis pomocí AI
                  </div>
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7"
              onClick={toggleEdit}
            >
              Upravit
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 my-2 p-4 border border-gray-200 rounded-md ${blurClass} flex flex-col h-full`}>
      <div className="flex justify-between items-center relative">
        <Label htmlFor="description" className="text-base font-medium">
          Popis pozice
        </Label>
        
        {/* Ikona tlačítko pro generování popisu */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleGenerateDescription}
          disabled={isGenerating}
          className="h-7 w-7 p-1 rounded-full hover:bg-blue-100 hover:text-blue-700 group"
          title="Vygenerovat popis pomocí AI"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span className="sr-only">Vygenerovat popis pomocí AI</span>
              <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-black text-xs p-1.5 rounded whitespace-nowrap z-50 text-white">
                Vygenerovat popis pomocí AI
              </div>
            </>
          )}
        </Button>
      </div>
      
      {/* Formátovací toolbar */}
      <div className="flex items-center gap-2 mb-2 border rounded-md p-2 bg-gray-50">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => execCommand('formatBlock', '<p>')}
          title="Normální text"
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
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => insertElement('h3')}
          title="Nadpis 3"
          className="h-8 px-2"
        >
          <Heading3 className="h-4 w-4" />
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
      
      {/* WYSIWYG Editor místo textarea */}
      <div
        ref={editorRef}
        contentEditable
        className="flex-1 min-h-[300px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary overflow-auto"
        dangerouslySetInnerHTML={{ __html: sanitizedValue }}
      />
      
      <p className="text-sm text-muted-foreground">
        Detailní popis pozice pomůže kandidátům lépe pochopit, co se od nich očekává.
      </p>
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