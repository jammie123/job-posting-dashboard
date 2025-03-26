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

