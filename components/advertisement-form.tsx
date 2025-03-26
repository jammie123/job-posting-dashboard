"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { JobsIcon, PraceIcon, CarreerIcon, IntranetIcon } from "./icons"
import { SummaryOrder } from "./summary-order"
import { AdvertisementPlatformCard, type AdditionalSetting } from "./advertisement-platform-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AdvertisementFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (selectedPlatforms: string[]) => void
}

export function AdvertisementForm({ open, onOpenChange, onSubmit }: AdvertisementFormProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [jobsSettings, setJobsSettings] = useState({
    presentationDuration: "30 dní",
    autoUpdate: "každý 7.den",
    jobsTip: false,
    medallion: true,
  })
  const [careerSettings, setCareerSettings] = useState({
    presentationDuration: "30 dní",
  })

  const [componentContext, setComponentContext] = useState<"new" | "running" | "expired">("new")

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  const handleSubmit = () => {
    onSubmit?.(selectedPlatforms)
    onOpenChange(false)
  }

  // Calculate summary data for the order summary component
  const summaryData = useMemo(() => {
    const data = []
    let totalCredits = 0

    if (selectedPlatforms.includes("Jobs.cz")) {
      const jobsCredits = 3
      const updateCredits = 9
      data.push({
        name: "Jobs.cz",
        presentationDuration: jobsSettings.presentationDuration,
        autoUpdate: jobsSettings.autoUpdate,
        price: `${jobsCredits} kreditů`,
      })
      totalCredits += jobsCredits + (jobsSettings.autoUpdate ? updateCredits : 0)
    }

    if (selectedPlatforms.includes("Prace.cz")) {
      data.push({
        name: "Prace.cz",
        presentationDuration: "30 dní",
        price: "1 kredit",
      })
      totalCredits += 1
    }

    if (selectedPlatforms.includes("Kariérní sekce")) {
      data.push({
        name: "Kariérní sekce",
        presentationDuration: careerSettings.presentationDuration,
        price: "Objednáno",
      })
    }

    if (selectedPlatforms.includes("Intranet")) {
      data.push({
        name: "Intranet",
        presentationDuration: "30 dní",
        price: "Zdarma",
      })
    }

    if (selectedPlatforms.includes("Profesia.sk")) {
      data.push({
        name: "Profesia.sk",
        presentationDuration: "30 dní",
        price: "21 kreditů",
      })
      totalCredits += 21
    }

    if (selectedPlatforms.includes("Bestjobs.eu")) {
      data.push({
        name: "Bestjobs.eu",
        presentationDuration: "30 dní",
        price: "21 kreditů",
      })
      totalCredits += 21
    }

    if (selectedPlatforms.includes("Robota.ua")) {
      data.push({
        name: "Robota.ua",
        presentationDuration: "30 dní",
        price: "21 kreditů",
      })
      totalCredits += 21
    }

    return { data, totalCredits }
  }, [selectedPlatforms, jobsSettings, careerSettings])

  // Jobs.cz additional settings
  const jobsAdditionalSettings: AdditionalSetting[] = [
    {
      name: "Doba prezentace",
      type: "select",
      options: ["30 dní", "14 dní"],
      value: jobsSettings.presentationDuration,
      onChange: (value) => setJobsSettings({ ...jobsSettings, presentationDuration: value }),
    },
    {
      name: "Automatická aktualizace",
      type: "select",
      options: ["každý 3.den", "každý 7.den", "každý 14.den"],
      value: jobsSettings.autoUpdate,
      onChange: (value) => setJobsSettings({ ...jobsSettings, autoUpdate: value }),
    },
    {
      name: "JobsTip",
      type: "checkbox",
      checked: jobsSettings.jobsTip,
      onToggle: () => setJobsSettings({ ...jobsSettings, jobsTip: !jobsSettings.jobsTip }),
      description:
        "Inzerát bude 3 dny umístěn na prvních místech v relevantních výsledcích hledání na Jobs.cz. Získáte tak až o 120 % vyšší návštěvnost inzerátu.",
      price: "8 990 Kč",
    },
    {
      name: "Medailonek na Jobs.cz",
      type: "checkbox",
      checked: jobsSettings.medallion,
      onToggle: () => setJobsSettings({ ...jobsSettings, medallion: !jobsSettings.medallion }),
      description:
        "Díky medailonkům můžete přímo do inzerátů přidat fotografie nebo video. Přiblížíte tak uchazečům třeba atmosféru konkrétní pobočky nebo kolegy v týmu.",
      price: "Předplaceno",
      isPriceHighlighted: true,
    },
  ]

  // Kariérní sekce additional settings
  const careerAdditionalSettings: AdditionalSetting[] = [
    {
      name: "Doba prezentace",
      type: "select",
      options: ["3 dní", "7 dní", "10 dní", "14 dní", "30 dní", "60 dní", "120 dní", "365 dní"],
      value: careerSettings.presentationDuration,
      onChange: (value) => setCareerSettings({ ...careerSettings, presentationDuration: value }),
    },
  ]

  // Profesia.sk additional settings
  const profesiaAdditionalSettings: AdditionalSetting[] = [
    {
      name: "Dostupné regionální kredity",
      type: "info",
      value: "0 kreditů",
    },
    {
      name: "Dostupné kredity pro Profesia.sk",
      type: "info",
      value: "100 kreditů",
    },
  ]

  // Country flag icons
  const CountryFlag = ({ code }: { code: string }) => (
    <div className="h-8 w-8 flex items-center justify-center bg-gray-100 rounded-full">{code}</div>
  )

  // Sample data for running advertisements
  const runningAdvertisements = [
    {
      id: "jobs-cz",
      platform: "Jobs.cz",
      logo: <JobsIcon className="h-8 w-8" />,
      description: "Najdete zde hlavně zkušené specialisty, lidi s VŠ vzděláním a manažery s praxí.",
      startDate: "15.03.2023",
      expiryDate: "15.04.2023",
      daysRemaining: 12,
    },
    {
      id: "prace-cz",
      platform: "Prace.cz",
      logo: <PraceIcon className="h-8 w-8" />,
      description: "Ideální pro hledání uchazečů běžných profesí, například manuálních (střední a nižší pozice).",
      startDate: "20.03.2023",
      expiryDate: "20.04.2023",
      daysRemaining: 17,
    },
    {
      id: "kariera",
      platform: "Kariérní sekce",
      logo: <CarreerIcon className="h-8 w-8" />,
      description: "Vystavené pozice se automaticky propíšou na váš web, navíc v designu vaší firmy a souladu s GDPR.",
      startDate: "01.03.2023",
      expiryDate: "01.05.2023",
      daysRemaining: 28,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex bg-gray-100 p-6">
        <div className="flex-1 overflow-auto p-4 bg-background">
          <div className="flex flex-col gap-2 w-[800px]">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-2xl font-bold">
                {componentContext === "new"
                  ? "Vyberte místa pro vystavení inzerátu"
                  : componentContext === "running"
                    ? "Přehled inzerátů"
                    : "Vypršené inzeráty"}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Nastavení prototypu:</span>
                <Select
                  value={componentContext}
                  onValueChange={(value) => setComponentContext(value as "new" | "running" | "expired")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Vyberte kontext" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nový inzerát</SelectItem>
                    <SelectItem value="running">Běžící inzeráty</SelectItem>
                    <SelectItem value="expired">Vypršené inzeráty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DialogHeader>

            {componentContext === "new" ? (
              // Original cards for new advertisements
              <>
                {/* Jobs.cz Card */}
                <AdvertisementPlatformCard
                  logo={<JobsIcon className="h-8 w-8" />}
                  title="Jobs.cz"
                  description="Najdete zde hlavně zkušené specialisty, lidi s VŠ vzděláním a manažery s praxí."
                  price="3 kredity"
                  isSelected={selectedPlatforms.includes("Jobs.cz")}
                  onToggle={() => togglePlatform("Jobs.cz")}
                  additionalSettings={jobsAdditionalSettings}
                />

                {/* Prace.cz Card */}
                <AdvertisementPlatformCard
                  logo={<PraceIcon className="h-8 w-8" />}
                  title="Prace.cz"
                  description="Ideální pro hledání uchazečů běžných profesí, například manuálních (střední a nižší pozice)."
                  price="1 kredit"
                  isSelected={selectedPlatforms.includes("Prace.cz")}
                  onToggle={() => togglePlatform("Prace.cz")}
                />

                {/* Kariérní sekce Card */}
                <AdvertisementPlatformCard
                  logo={<CarreerIcon className="h-8 w-8" />}
                  title="Kariérní sekce"
                  description="Vystavené pozice se automaticky propíšou na váš web, navíc v designu vaší firmy a souladu s GDPR."
                  price="Objednáno"
                  isSelected={selectedPlatforms.includes("Kariérní sekce")}
                  onToggle={() => togglePlatform("Kariérní sekce")}
                  additionalSettings={careerAdditionalSettings}
                />

                {/* Intranet Card */}
                <AdvertisementPlatformCard
                  logo={<IntranetIcon className="h-8 w-8" />}
                  title="Intranet"
                  description="Vystavení pozice na firemním intranetu pro interní kandidáty."
                  price="Zdarma"
                  isSelected={selectedPlatforms.includes("Intranet")}
                  onToggle={() => togglePlatform("Intranet")}
                />

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-2">Inzerce v zahraničí</h3>
                  <div className="flex flex-col gap-4">
                    {/* Slovakia - Profesia.sk */}
                    <AdvertisementPlatformCard
                      logo={<CountryFlag code="SK" />}
                      title="Profesia.sk"
                      description="Populární pracovní portál, kde oslovíte zajímavé kandidáty na slovenském trhu práce."
                      price="21 kreditů"
                      isSelected={selectedPlatforms.includes("Profesia.sk")}
                      onToggle={() => togglePlatform("Profesia.sk")}
                      additionalSettings={profesiaAdditionalSettings}
                    ></AdvertisementPlatformCard>

                    {/* Romania - Bestjobs.eu */}
                    <AdvertisementPlatformCard
                      logo={<CountryFlag code="RO" />}
                      title="Bestjobs.eu"
                      description="Zavedený rumunský portál, kde visí 2x více nabídek, než má jeho nejbližší místní konkurent."
                      price="21 kreditů"
                      isSelected={selectedPlatforms.includes("Bestjobs.eu")}
                      onToggle={() => togglePlatform("Bestjobs.eu")}
                    />

                    {/* Ukraine - Robota.ua */}
                    <AdvertisementPlatformCard
                      logo={<CountryFlag code="UA" />}
                      title="Robota.ua"
                      description="Největší a mezi kandidáty populární pracovní portál, kde inzerují významní zaměstnavatelé."
                      price="21 kreditů"
                      isSelected={selectedPlatforms.includes("Robota.ua")}
                      onToggle={() => togglePlatform("Robota.ua")}
                    />
                  </div>
                </div>
              </>
            ) : componentContext === "running" ? (
              // Cards for running advertisements
              <>
                <div className="">
                  <h3 className="text-lg font-semibold">Běžící inzeráty</h3>
                </div>

                {runningAdvertisements.map((ad) => (
                  <AdvertisementPlatformCard
                    key={ad.id}
                    logo={ad.logo}
                    title={ad.platform}
                    description={ad.description}
                    price=""
                    isSelected={false}
                    onToggle={() => {}}
                    status="active"
                    startDate={ad.startDate}
                    expiryDate={ad.expiryDate}
                    daysRemaining={ad.daysRemaining}
                  />
                ))}

                {/* Add new advertisement card */}
                <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors mt-4">
                  <CardHeader className="flex flex-row items-center justify-center py-6">
                    <Button
                      variant="ghost"
                      className="flex flex-col items-center gap-2 h-auto py-4"
                      onClick={() => setComponentContext("new")}
                    >
                      <Plus className="h-8 w-8 text-blue-500" />
                      <span className="font-medium">Přidat další inzerát</span>
                      <p className="text-sm text-gray-500 font-normal">
                        Vystavte svou pozici na další pracovní portály
                      </p>
                    </Button>
                  </CardHeader>
                </Card>
              </>
            ) : (
              // Cards for expired advertisements
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 mb-4">Nemáte žádné vypršené inzeráty</p>
              </div>
            )}
          </div>
        </div>
        <div className="sticky top-6 self-start w-[300px]">
          {componentContext === "new" && (
            <SummaryOrder
              selectedPlatforms={summaryData.data}
              totalCredits={summaryData.totalCredits}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

