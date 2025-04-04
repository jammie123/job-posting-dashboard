"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Copy,
  Edit,
  MoreHorizontal,
  Share2,
  Star,
  StopCircle,
  Trash,
  TrendingUp,
  UserPlus,
  Zap,
  Clock,
  SquarePen,
  Timer,
  MonitorSmartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { JobStatusesModal } from "@/components/job-statuses-modal"
import { CancelAdvertismentDialog } from "@/components/cancel-advertisment-dialog"
import { RepublishAdvertsimentModal } from "@/components/republish-advertisment-modal"
import { ExtendAdvertisementModal } from "@/components/extend-advertisement-modal"
import type { JobPosting } from "@/types/job-posting"
import { AdvertisementForm } from "@/components/advertisement-form"
import Link from "next/link"

interface JobMenuActionProps {
  onAction?: (action: string) => void
  job: JobPosting
}

export function JobMenuAction({ onAction, job }: JobMenuActionProps) {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isAdvertismentModalOpen, setIsAdvertismentModalOpen] = useState(false)
  const [isRepublishModalOpen, setIsRepublishModalOpen] = useState(false)
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false)
  const [isAdvertisementFormOpen, setIsAdvertisementFormOpen] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Otevřít menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="w-[320px]">
        <div className="px-2 py-2 flex items-center justify-between">
          <span className="font-semibold">Nábor</span>
         
        </div>
        <DropdownMenuGroup>

          <DropdownMenuItem onClick={() => onAction?.("edit")}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Upravit nábor</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction?.("invite")}>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Zapojit kolegu</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction?.("copy")}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Vytvořit kopii</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction?.("transfer")}>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Předat nábor</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault()
              setIsStatusModalOpen(true)
            }}
          >
            <StopCircle className="mr-2 h-4 w-4" />
            <span>Archivovat nábor</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {job.status === "Aktivní" && job.advertisement.status !== "Nezveřejněný" ? (
          <>
            <DropdownMenuGroup>
              {!job.advertisement.active && job.advertisement.portals.length > 0 && (
                <DropdownMenuItem
                  onClick={() => {
                    setIsRepublishModalOpen(true)
                  }}
                >
                  <SquarePen className="mr-2 h-4 w-4" />
                  <span>Znovu vystavit inzerát</span>
                </DropdownMenuItem>
              )}
              {job.advertisement.active && job.advertisement.portals.length > 0 && (
                <DropdownMenuItem
                  onClick={() => {
                    setIsExtendModalOpen(true)
                  }}
                >
                  <Timer className="mr-2 h-4 w-4" />
                  <span>Prodloužit inzerát</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onAction?.("top")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>Topovat inzerát</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  setIsRepublishModalOpen(true)
                }}
              >
                <Star className="mr-2 h-4 w-4" />
                <span>Zvýraznit inzerát</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  setIsAdvertismentModalOpen(true)
                }}
                className="text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Ukončit vystavení inzerátů</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        ) : (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/job/${job.id}/inzerce`}>
                  <MonitorSmartphone className="mr-2 h-4 w-4" />
                  <span>Spravovat inzerci</span>
                </Link>
              </DropdownMenuItem>

              {job.advertisement.portals.length === 0 && (
                <DropdownMenuItem
                  onClick={() => {
                    setIsAdvertisementFormOpen(true)
                  }}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  <span>Zahájit inzerci</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
      <JobStatusesModal
        job={job}
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        onStatusChange={(status) => {
          onAction?.("change-status")
          setIsStatusModalOpen(false)
        }}
      />
      <CancelAdvertismentDialog
        portals={job.advertisement.active ? job.advertisement.portals : []}
        open={isAdvertismentModalOpen}
        onOpenChange={setIsAdvertismentModalOpen}
        onConfirm={() => {
          onAction?.("end")
          setIsAdvertismentModalOpen(false)
        }}
      />
      <RepublishAdvertsimentModal
        portals={!job.advertisement.active && job.advertisement.portals.length > 0 ? job.advertisement.portals : []}
        open={isRepublishModalOpen}
        onOpenChange={setIsRepublishModalOpen}
        onConfirm={(selectedPortals) => {
          onAction?.("republish")
          setIsRepublishModalOpen(false)
        }}
      />
      <ExtendAdvertisementModal
        portals={job.advertisement.active ? job.advertisement.portals : []}
        open={isExtendModalOpen}
        onOpenChange={setIsExtendModalOpen}
        onConfirm={(selectedPortals) => {
          onAction?.("extend")
          setIsExtendModalOpen(false)
        }}
      />
      <AdvertisementForm
        open={isAdvertisementFormOpen}
        onOpenChange={setIsAdvertisementFormOpen}
        onSubmit={(selectedPlatforms) => {
          onAction?.("publish")
          setIsAdvertisementFormOpen(false)
        }}
      />
    </DropdownMenu>
  )
}

