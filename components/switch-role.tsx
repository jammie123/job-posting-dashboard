"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { UserCog } from "lucide-react"

interface SwitchRoleProps {
  initialRole?: "recruiter" | "lineManager"
}

export function SwitchRole({ initialRole = "recruiter" }: SwitchRoleProps) {
  const [isLineManager, setIsLineManager] = useState(initialRole === "lineManager")
  const [showStatus, setShowStatus] = useState<boolean>(() => {
    if (typeof window === "undefined") return true
    try {
      const stored = window.localStorage.getItem("ui.showStatus")
      return stored !== "false"
    } catch {
      return true
    }
  })
  const [showLogos, setShowLogos] = useState<boolean>(() => {
    if (typeof window === "undefined") return true
    try {
      const stored = window.localStorage.getItem("ui.showLogos")
      return stored !== "false"
    } catch {
      return true
    }
  })
  const router = useRouter()

  const handleRoleChange = (checked: boolean) => {
    setIsLineManager(checked)

    // Navigate to the appropriate page based on the role
    if (checked) {
      router.push("/job-list-line-manager")
    } else {
      router.push("/")
    }
  }

  const handleShowStatusChange = (checked: boolean) => {
    setShowStatus(checked)
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("ui.showStatus", String(checked))
        window.dispatchEvent(new Event("ui:toggleShowStatus"))
      }
    } catch {
      // ignore storage errors
    }
  }

  const handleShowLogosChange = (checked: boolean) => {
    setShowLogos(checked)
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("ui.showLogos", String(checked))
        window.dispatchEvent(new Event("ui:toggleShowLogos"))
      }
    } catch {
      // ignore storage errors
    }
  }

  const applyDataset = (value: string) => {
    try {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.set('dataset', value)
        // also mirror selection into a cookie for environments relying on cookies
        document.cookie = `dataset=${value}; path=/; max-age=${60 * 60 * 24 * 365}`
        window.location.assign(url.toString())
      }
    } catch {}
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          <UserCog className="h-4 w-4" />
          <span className="hidden md:inline">Role</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Přepnout roli</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-4 pt-0">
          <div className="flex flex-col space-y-2">
            <span className="text-xs font-normal text-muted-foreground">Dataset</span>
            <select
              className="w-full border rounded h-8 text-sm px-2"
              defaultValue={typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('dataset') || 'withoutnotes') : 'withoutnotes'}
              onChange={(e) => applyDataset(e.target.value)}
            >
              <option value="bigcompany">mock-jobs_bigcompany.json</option>
              <option value="withoutnotes">mock-jobs-withoutnotes.json</option>
              <option value="mock">mock-jobs.json</option>
              <option value="veol">mock-veol.json</option>
              <option value="o2">mock-o2.json</option>
            </select>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="p-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="role-switch" className="flex flex-col space-y-1">
              <span>Přepnout na liniáka</span>
              <span className="text-xs font-normal text-muted-foreground">Zobrazit pohled liniového manažera</span>
            </Label>
            <Switch id="role-switch" checked={isLineManager} onCheckedChange={handleRoleChange} />
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="p-4 pt-0">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="status-switch" className="flex flex-col space-y-1">
              <span>Zobrazit status</span>
              <span className="text-xs font-normal text-muted-foreground">Zapnout/vypnout stav u pozic</span>
            </Label>
            <Switch id="status-switch" checked={showStatus} onCheckedChange={handleShowStatusChange} />
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="p-4 pt-0">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="logos-switch" className="flex flex-col space-y-1">
              <span>Zobrazit loga portálů</span>
              <span className="text-xs font-normal text-muted-foreground">Zapnout/vypnout loga u štítků</span>
            </Label>
            <Switch id="logos-switch" checked={showLogos} onCheckedChange={handleShowLogosChange} />
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={!isLineManager} onClick={() => handleRoleChange(false)}>
          Zobrazit jako náborář
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isLineManager} onClick={() => handleRoleChange(true)}>
          Zobrazit jako liniový manažer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

