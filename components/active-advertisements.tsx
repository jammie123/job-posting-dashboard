"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { JobsIcon, PraceIcon, CarreerIcon, IntranetIcon } from "./icons"
import { AdvertisementPlatformCard } from "./advertisement-platform-card"

interface ActiveAdvertisementsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActiveAdvertisements({ open, onOpenChange }: ActiveAdvertisementsProps) {
  const [activeTab, setActiveTab] = useState("active")

  // Sample data for active advertisements
  const activeAdvertisements = [
    {
      id: "jobs-1",
      platform: "Jobs.cz",
      title: "Jobs.cz",
      description: "Najdete zde hlavně zkušené specialisty, lidi s VŠ vzděláním a manažery s praxí.",
      status: "active" as const,
      startDate: "15.03.2025",
      expiryDate: "14.04.2025",
      daysRemaining: 33,
      logo: <JobsIcon className="h-8 w-8" />,
    },
    {
      id: "prace-1",
      platform: "Prace.cz",
      title: "Prace.cz",
      description: "Ideální pro hledání uchazečů běžných profesí, například manuálních (střední a nižší pozice).",
      status: "active" as const,
      startDate: "15.03.2025",
      expiryDate: "14.04.2025",
      daysRemaining: 33,
      logo: <PraceIcon className="h-8 w-8" />,
    },
    {
      id: "intranet-1",
      platform: "Intranet",
      title: "Intranet",
      description: "Vystavení pozice na firemním intranetu pro interní kandidáty.",
      status: "active" as const,
      startDate: "15.03.2025",
      expiryDate: "14.04.2025",
      daysRemaining: 33,
      logo: <IntranetIcon className="h-8 w-8" />,
    },
  ]

  // Sample data for expired advertisements
  const expiredAdvertisements = [
    {
      id: "jobs-2",
      platform: "Jobs.cz",
      title: "Jobs.cz",
      description: "Najdete zde hlavně zkušené specialisty, lidi s VŠ vzděláním a manažery s praxí.",
      status: "expired" as const,
      startDate: "15.01.2025",
      expiryDate: "14.02.2025",
      logo: <JobsIcon className="h-8 w-8" />,
    },
    {
      id: "career-1",
      platform: "Kariérní sekce",
      title: "Kariérní sekce",
      description: "Vystavené pozice se automaticky propíšou na váš web, navíc v designu vaší firmy a souladu s GDPR.",
      status: "expired" as const,
      startDate: "15.01.2025",
      expiryDate: "14.02.2025",
      logo: <CarreerIcon className="h-8 w-8" />,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col w-screen h-screen max-w-none max-h-none p-6 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Správa inzerátů</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="active" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="active">Aktivní inzeráty ({activeAdvertisements.length})</TabsTrigger>
            <TabsTrigger value="expired">Vypršelé inzeráty ({expiredAdvertisements.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="flex-1 overflow-auto">
            <div className="flex flex-col gap-4 w-[800px]">
              {activeAdvertisements.map((ad) => (
                <AdvertisementPlatformCard
                  key={ad.id}
                  logo={ad.logo}
                  title={ad.title}
                  description={ad.description}
                  price=""
                  isSelected={false}
                  onToggle={() => {}}
                  status={ad.status}
                  startDate={ad.startDate}
                  expiryDate={ad.expiryDate}
                  daysRemaining={ad.daysRemaining}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="expired" className="flex-1 overflow-auto">
            <div className="flex flex-col gap-4 w-[800px]">
              {expiredAdvertisements.map((ad) => (
                <AdvertisementPlatformCard
                  key={ad.id}
                  logo={ad.logo}
                  title={ad.title}
                  description={ad.description}
                  price=""
                  isSelected={false}
                  onToggle={() => {}}
                  status={ad.status}
                  startDate={ad.startDate}
                  expiryDate={ad.expiryDate}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zavřít
          </Button>
          {activeTab === "expired" && <Button>Obnovit vybrané</Button>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

