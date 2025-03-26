"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Toggle } from "@/components/ui/toggle"
import { Bold, Italic, List, Heading2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <div className="flex items-center gap-1 border-b p-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Toggle>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 [&_*:focus]:outline-none [&_.ProseMirror]:focus:ring-2 [&_.ProseMirror]:focus:ring-ring [&_.ProseMirror]:focus:ring-offset-2 [&_.ProseMirror_p]:leading-normal [&_.ProseMirror_p]:my-2"
      />
    </div>
  )
}

