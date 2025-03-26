"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContextSelectorProps {
  value: "new" | "running" | "expired"
  onChange: (value: "new" | "running" | "expired") => void
}

export function ContextSelector({ value, onChange }: ContextSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setOpen(true)}
        title="Nastavení prototypu"
      >
        <Settings className="h-4 w-4" />
      </Button>
      <Select
        open={open}
        onOpenChange={setOpen}
        value={value}
        onValueChange={(value) => onChange(value as "new" | "running" | "expired")}
      >
        <SelectTrigger className="sr-only">
          <SelectValue placeholder="Vyberte kontext" />
        </SelectTrigger>
        <SelectContent align="end" className="w-[180px]">
          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">Nastavení prototypu</div>
          <SelectItem value="new">Nový inzerát</SelectItem>
          <SelectItem value="running">Běžící inzeráty</SelectItem>
          <SelectItem value="expired">Vypršené inzeráty</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

