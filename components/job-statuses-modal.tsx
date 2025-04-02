"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import type { JobPosting, JobStatus } from "@/types/job-posting"
import { JobsIcon, PraceIcon, CarreerIcon, IntranetIcon } from "@/components/icons"
import { ListChecks, LayoutGrid, LayoutList } from "lucide-react"

interface JobStatusesModalProps {
  job: JobPosting
  trigger?: React.ReactNode
  onStatusChange?: (status: JobStatus) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function JobStatusesModal({ job, trigger, onStatusChange, open, onOpenChange }: JobStatusesModalProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<JobStatus>(job.status)
  const [selectedVariant, setSelectedVariant] = React.useState("variant1")
  const [isActive, setIsActive] = React.useState(job.status !== "archive")
  const [publishOption, setPublishOption] = React.useState("with-ads")

  // For variant 2, we need to handle the switch change
  const handleSwitchChange = (checked: boolean) => {
    setIsActive(checked)
    if (!checked) {
      setSelectedStatus("archive")
    } else if (selectedStatus === "archive") {
      // If switching from archive to active, default to "active" status
      setSelectedStatus("active")
    }
  }

  const handleStatusChange = (status: JobStatus) => {
    setSelectedStatus(status)
  }

  const handleSave = () => {
    onStatusChange?.(selectedStatus)
    onOpenChange?.(false)
  }

  const toggleVariant = () => {
    setSelectedVariant(selectedVariant === "variant1" ? "variant2" : "variant1")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            Archivovat nábor
          </DialogTitle>
        </DialogHeader>

        {selectedVariant === "variant1" ? (
          // Original variant with radio buttons
          <div className="py-6">
            <RadioGroup
              defaultValue={job.status}
              value={selectedStatus}
              onValueChange={(value) => handleStatusChange(value as JobStatus)}
            >
              <div className="flex items-start space-x-2 mb-4">
                <RadioGroupItem value="active" id="active" className="mt-1" />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full bg-green-500`} />
                    <Label htmlFor="active">Zveřejněný</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nábor je viditlený na Vámi vybraných místech, pracovní portály, karoérní stránky atd.
                  </p>
                  {selectedStatus === "active" && (
                    <>
                      {job.status === "inactive" && (
                        <div className="mt-2 space-y-2">
                          <RadioGroup
                            defaultValue="with-ads"
                            value={publishOption}
                            onValueChange={setPublishOption}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2 rounded-md border p-2">
                              <RadioGroupItem value="with-ads" id="with-ads" />
                              <Label htmlFor="with-ads" className="font-medium">
                                Pokračovat na vystavení inzerátů
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-2">
                              <RadioGroupItem value="without-ads" id="without-ads" />
                              <Label htmlFor="without-ads">Zveřejnit bez vystavení inzerce</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-start space-x-2 mb-4">
                <RadioGroupItem value="inactive" id="inactive" className="mt-1" />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full bg-yellow-500`} />
                    <Label htmlFor="inactive">Nezveřejněný</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nábor není viditelný na žádném pracovním portále ani kariérních stránkách. V tomto stavu bude běžící
                    inzerce ukončena.
                  </p>
                  {job.status === "active" && selectedStatus === "inactive" && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Inzerce bude ukončena:</p>
                      <div className="flex -space-x-1">
                        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0">
                          <JobsIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0">
                          <PraceIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0">
                          <CarreerIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0">
                          <IntranetIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-start space-x-2 mb-4">
                <RadioGroupItem value="internal" id="internal" className="mt-1" />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full bg-blue-500`} />
                    <Label htmlFor="internal">Interní</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Viditelný pouze na Vašem intranetu pro interní zaměstnance firmy není viditelný na pracovních
                    portálech
                  </p>
                  {job.status === "active" && selectedStatus === "internal" && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Vystaveno na intranetu:</p>
                      <div className="flex">
                        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0">
                          <IntranetIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="archive" id="archive" className="mt-1" />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full bg-red-500`} />
                    <Label htmlFor="archive">Archivní</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Inzerce se ukončí a s náborem se už nechystáte pracovat
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        ) : (
          // New variant with switch
          <div className="py-6">
            <RadioGroup
              value={selectedStatus}
              onValueChange={(value) => handleStatusChange(value as JobStatus)}
              className="space-y-4"
            >
              <div className="flex items-start space-x-2 mb-4">
                <RadioGroupItem value="active" id="active-v2" className="mt-1" />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="active-v2">Zveřejněný</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nábor je viditlený na Vámi vybraných místech, pracovní portály, karoérní stránky atd.
                  </p>
                  {selectedStatus === "active" && (
                    <div className="mt-3 space-y-2 border-t pt-2">
                      <div className="flex items-start space-x-2">
                        <Checkbox id="job-portals" defaultChecked className="mt-1" />
                        <div>
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full bg-green-500`} />
                            <Label htmlFor="job-portals" className="text-sm font-medium">
                              Na pracovních portálech
                            </Label>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Nábor je viditlený na Vámi vybraných místech, pracovní portály, karoérní stránky atd.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox id="intranet" defaultChecked className="mt-1" />
                        <div>
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full bg-blue-500`} />
                            <Label htmlFor="intranet" className="text-sm font-medium">
                              Na intranetu firmy
                            </Label>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Viditelný pouze na Vašem intranetu pro interní zaměstnance firmy
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2 mb-4">
                <RadioGroupItem value="inactive" id="inactive-v2" className="mt-1" />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full bg-yellow-500`} />
                    <Label htmlFor="inactive-v2">Nezveřejněný</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nábor není viditelný na žádném pracovním portále ani kariérních stránkách. Viditelný pouze skrze
                    přímý odkaz na nábor.
                  </p>
                  {job.status === "active" && selectedStatus === "inactive" && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Inzerce bude ukončena:</p>
                      <div className="flex -space-x-1">
                        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0">
                          <JobsIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0">
                          <PraceIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0">
                          <CarreerIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0">
                          <IntranetIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <RadioGroupItem value="archive" id="archive-v2" className="mt-1" />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full bg-red-500`} />
                    <Label htmlFor="archive-v2">Archivní</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Inzerce se ukončí a s náborem se už nechystáte pracovat
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVariant}
            title={selectedVariant === "variant1" ? "Přepnout na variantu 2" : "Přepnout na variantu 1"}
            className="mr-auto"
          >
            {selectedVariant === "variant1" ? <LayoutGrid className="h-5 w-5" /> : <LayoutList className="h-5 w-5" />}
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange?.(false)}>
              Zrušit
            </Button>
            <Button onClick={handleSave}>
              {job.status === "inactive" && selectedStatus === "active"
                ? publishOption === "with-ads"
                  ? "Pokračovat na vystavení inzerátů"
                  : "Zveřejnit bez vystavení inzerce"
                : "Uložit"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

