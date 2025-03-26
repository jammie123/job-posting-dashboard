"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { LeftMenu } from "@/components/left-menu"
import { TopHeader } from "@/components/top-header"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cs } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { JobsIcon, PraceIcon, CarreerIcon } from "@/components/icons"
import { AdvertisementPlatformCard } from "@/components/advertisement-platform-card"
import { ExtendAdvertisementModal } from "@/components/extend-advertisement-modal"
import { CancelAdvertismentDialog } from "@/components/cancel-advertisment-dialog"
import type { JobPortal } from "@/types/job-posting"
import { ListCandidate } from "@/components/list-candidate"
import { mockCandidates } from "@/data/mock-candidates"

export default function DetailJob() {
  const params = useParams()
  const jobId = params.id as string
  const [chartKey, setChartKey] = useState(0)

  // Force chart re-render when tab changes
  useEffect(() => {
    setChartKey((prev) => prev + 1)
  }, [])

  // Date range state
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 1), // January 1, 2025
    to: new Date(2025, 1, 15), // February 15, 2025
  })

  // State for controlling the modals visibility
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Sample data for charts
  const lineChartData = [
    { date: "2025-01-01", "Jobs.cz": 40, "Prace.cz": 24, "Kariérní stránky": 10 },
    { date: "2025-01-08", "Jobs.cz": 30, "Prace.cz": 28, "Kariérní stránky": 15 },
    { date: "2025-01-15", "Jobs.cz": 45, "Prace.cz": 35, "Kariérní stránky": 12 },
    { date: "2025-01-22", "Jobs.cz": 50, "Prace.cz": 40, "Kariérní stránky": 18 },
    { date: "2025-01-29", "Jobs.cz": 65, "Prace.cz": 45, "Kariérní stránky": 25 },
    { date: "2025-02-05", "Jobs.cz": 60, "Prace.cz": 50, "Kariérní stránky": 30 },
    { date: "2025-02-12", "Jobs.cz": 75, "Prace.cz": 55, "Kariérní stránky": 35 },
  ]

  const barChartData = [
    { source: "Jobs.cz", Neposouzený: 20, "Ve hře": 15, Zamítnutý: 10 },
    { source: "Prace.cz", Neposouzený: 15, "Ve hře": 10, Zamítnutý: 8 },
    { source: "Kariérní stránky", Neposouzený: 10, "Ve hře": 5, Zamítnutý: 3 },
    { source: "LinkedIn", Neposouzený: 8, "Ve hře": 6, Zamítnutý: 4 },
    { source: "Doporučení", Neposouzený: 5, "Ve hře": 4, Zamítnutý: 1 },
  ]

  // Sample data for running advertisements
  const runningAdvertisements = [
    {
      id: "jobs-cz",
      platform: "Jobs.cz",
      logo: <JobsIcon className="h-8 w-8" />,
      description: "Najdete zde hlavně zkušené specialisty, lidi s VŠ vzděláním a manažery s praxí.",
      startDate: "15.03.2025",
      expiryDate: "15.04.2025",
      daysRemaining: 12,
    },
    {
      id: "prace-cz",
      platform: "Prace.cz",
      logo: <PraceIcon className="h-8 w-8" />,
      description: "Ideální pro hledání uchazečů běžných profesí, například manuálních (střední a nižší pozice).",
      startDate: "20.03.2025",
      expiryDate: "20.04.2025",
      daysRemaining: 17,
    },
    {
      id: "kariera",
      platform: "Kariérní sekce",
      logo: <CarreerIcon className="h-8 w-8" />,
      description: "Vystavené pozice se automaticky propíšou na váš web, navíc v designu vaší firmy a souladu s GDPR.",
      startDate: "01.03.2025",
      expiryDate: "01.05.2025",
      daysRemaining: 28,
    },
  ]

  // Convert running advertisements to JobPortal format for the CancelAdvertismentDialog
  const jobPortals: JobPortal[] = runningAdvertisements.map((ad) => ({
    name: ad.platform,
    url: ad.id,
    icon: ad.id === "jobs-cz" ? "JobsIcon" : ad.id === "prace-cz" ? "PraceIcon" : "CarreerIcon",
    publishedAt: new Date(ad.startDate.split(".").reverse().join("-")).toISOString(),
    expiresAt: new Date(ad.expiryDate.split(".").reverse().join("-")).toISOString(),
  }))

  const newAdvertisements = [
    {
      id: "bestjobs-eu",
      platform: "Bestjobs.eu",
      logo: <div className="h-8 w-8 flex items-center justify-center bg-gray-100 rounded-full">RO</div>,
      description: "Zavedený rumunský portál, kde visí 2x více nabídek, než má jeho nejbližší místní konkurent.",
      price: "21 kreditů",
    },
    {
      id: "profesia-sk",
      platform: "Profesia.sk",
      logo: <div className="h-8 w-8 flex items-center justify-center bg-gray-100 rounded-full">SK</div>,
      description: "Populární pracovní portál, kde oslovíte zajímavé kandidáty na slovenském trhu práce.",
      price: "21 kreditů",
    },
    {
      id: "robota-ua",
      platform: "Robota.ua",
      logo: <div className="h-8 w-8 flex items-center justify-center bg-gray-100 rounded-full">UA</div>,
      description: "Největší a mezi kandidáty populární pracovní portál, kde inzerují významní zaměstnavatelé.",
      price: "21 kreditů",
    },
  ]

  // Table data
  const tableData = [
    {
      source: "Jobs.cz",
      views: 1250,
      reactions: 85,
      inProgress: 15,
      rejected: 60,
      hired: 5,
    },
    {
      source: "Prace.cz",
      views: 980,
      reactions: 65,
      inProgress: 10,
      rejected: 48,
      hired: 3,
    },
    {
      source: "Kariérní stránky",
      views: 750,
      reactions: 40,
      inProgress: 5,
      rejected: 30,
      hired: 2,
    },
    {
      source: "LinkedIn",
      views: 620,
      reactions: 35,
      inProgress: 6,
      rejected: 25,
      hired: 0,
    },
    {
      source: "Doporučení",
      views: 0,
      reactions: 15,
      inProgress: 4,
      rejected: 8,
      hired: 0,
    },
    {
      source: "Celkem",
      views: 3600,
      reactions: 240,
      inProgress: 40,
      rejected: 171,
      hired: 10,
    },
  ]

  // KPI data
  const kpiData = {
    totalApplicants: 120,
    totalPreselected: 45,
    totalInterviews: 30,
    totalRejections: 75,
    totalHires: 10,
    avgDaysToHire: 42,
    avgDaysToInterview: 14,
    avgResponseTime: 2.5,
  }

  return (
    <div className="flex flex-row pl-[0px] xl:pl-[140px]">
      <LeftMenu />
      <div className="flex flex-col w-full">
        <TopHeader userName="Anna K." companyName="Acme Corporation s.r.o." />

        {/* Page Header */}
        <header className="mb-6 flex flex-col flex-gap gap-0 justify-between bg-background shadow-sm">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                Senior Frontend Developer
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-muted-foreground">Zveřejněný</span>
              </h1>
            </div>
            <div className="flex gap-2">
              <Button>Přidat uchazeče</Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Více možností</span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="prehled" className="bg-[#F5F6FA]">
            <TabsList className="w-full justify-start border-b-0 p-0 left-0 bg-white drop-shadow-xs px-5">
              <TabsTrigger
                value="prehled"
                className="min-w-[100px] drop-shadow-none data-[state=active]:border-b-2 data-[state=active]:font-medium h-full rounded-none data-[state=active]:border-[#E61F60]"
              >
                Přehled
              </TabsTrigger>
              <TabsTrigger
                value="kandidati"
                className="min-w-[100px] drop-shadow-none data-[state=active]:border-b-2 data-[state=active]:font-medium h-full rounded-none data-[state=active]:border-[#E61F60]"
              >
                Kandidáti
              </TabsTrigger>
              <TabsTrigger
                value="detail"
                className="min-w-[100px] drop-shadow-none data-[state=active]:border-b-2 data-[state=active]:font-medium h-full rounded-none data-[state=active]:border-[#E61F60]"
              >
                Detail náboru
              </TabsTrigger>
              <TabsTrigger
                value="statistiky"
                className="min-w-[100px] drop-shadow-none data-[state=active]:border-b-2 data-[state=active]:font-medium h-full rounded-none data-[state=active]:border-[#E61F60]"
              >
                Statistiky
              </TabsTrigger>
            </TabsList>

            {/* Content */}
            <div className="container  mx-auto px-6 py-6 bg-[#F5F6FA]">
              <TabsContent value="prehled">
                <div className="bg-white rounded-lg border p-6 min-h-[500px]">
                  <p className="text-muted-foreground text-center">Přehled obsahu pozice ID: {jobId}</p>
                </div>
              </TabsContent>

              <TabsContent value="kandidati">
                <div className="">
                  <ListCandidate candidates={mockCandidates} />
                </div>
              </TabsContent>

              <TabsContent value="detail">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Aktivní inzeráty</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowExtendModal(true)}>
                        Prodloužit inzeráty
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setShowCancelDialog(true)}
                      >
                        Ukončit vystavení inzerátů
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
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
                  </div>

                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Dostupné inzeráty k vystavení</h2>
                    <div className="flex flex-col gap-4 mb-6">
                      {newAdvertisements.map((ad) => (
                        <AdvertisementPlatformCard
                          key={ad.id}
                          logo={ad.logo}
                          title={ad.platform}
                          description={ad.description}
                          price={ad.price}
                          isSelected={false}
                          onToggle={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="statistiky">
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Celkový počet uchazečů
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{kpiData.totalApplicants}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Celkový počet předvybraných
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{kpiData.totalPreselected}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Celkový počet pohovorů
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{kpiData.totalInterviews}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Celkový počet zamítnutí
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{kpiData.totalRejections}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Celkový počet hire</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{kpiData.totalHires}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Průměrný počet dní do Hire
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Málo dat</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Průměrný počet dní do pohovoru
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{kpiData.avgDaysToInterview} dní</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Jak rychle reagujete na CVčka
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{kpiData.avgResponseTime} dní</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Date Range Picker */}
                  <div className="flex justify-end">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "d. MMMM yyyy", { locale: cs })} -{" "}
                                {format(date.to, "d. MMMM yyyy", { locale: cs })}
                              </>
                            ) : (
                              format(date.from, "d. MMMM yyyy", { locale: cs })
                            )
                          ) : (
                            <span>Vyberte období</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                          locale={cs}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Source Statistics Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Statistiky zdrojů</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Název zdroje</TableHead>
                            <TableHead className="text-right">Počet shlédnutí</TableHead>
                            <TableHead className="text-right">Počet reakcí</TableHead>
                            <TableHead className="text-right">Počet kandidátů ve hře</TableHead>
                            <TableHead className="text-right">Počet zamítnutí</TableHead>
                            <TableHead className="text-right">Počet hired</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tableData.map((row, index) => (
                            <TableRow key={index} className={row.source === "Celkem" ? "font-bold bg-muted/50" : ""}>
                              <TableCell>{row.source}</TableCell>
                              <TableCell className="text-right">{row.views.toLocaleString("cs-CZ")}</TableCell>
                              <TableCell className="text-right">{row.reactions.toLocaleString("cs-CZ")}</TableCell>
                              <TableCell className="text-right">{row.inProgress.toLocaleString("cs-CZ")}</TableCell>
                              <TableCell className="text-right">{row.rejected.toLocaleString("cs-CZ")}</TableCell>
                              <TableCell className="text-right">{row.hired.toLocaleString("cs-CZ")}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Line Chart */}
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>Výkon náboru</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] w-full bg-white rounded-md p-4">
                        <h3 className="text-sm font-medium mb-4">Počet zobrazení podle zdroje</h3>

                        {/* Chart Legend */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-xs">Jobs.cz</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-xs">Prace.cz</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span className="text-xs">Kariérní stránky</span>
                          </div>
                        </div>

                        {/* Basic Chart */}
                        <div className="w-full h-[300px] relative border border-gray-200 rounded">
                          <LineChart
                            width={700}
                            height={300}
                            data={lineChartData}
                            margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              label={{ value: "Datum", position: "bottom", offset: 0 }}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis
                              label={{ value: "Počet zobrazení", angle: -90, position: "left" }}
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip />
                            <Legend verticalAlign="top" height={36} />
                            <Line type="monotone" dataKey="Jobs.cz" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="Prace.cz" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                            <Line
                              type="monotone"
                              dataKey="Kariérní stránky"
                              stroke="#eab308"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          </LineChart>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Zdroje a úspěšnost</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="source" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Neposouzený" stackId="a" fill="#8884d8" />
                            <Bar dataKey="Ve hře" stackId="a" fill="#82ca9d" />
                            <Bar dataKey="Zamítnutý" stackId="a" fill="#ffc658" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </header>
        {/* Extend Advertisement Modal */}
        <ExtendAdvertisementModal
          portals={runningAdvertisements.map((ad) => ({
            name: ad.platform,
            url: ad.id,
            icon: ad.id === "jobs-cz" ? "JobsIcon" : ad.id === "prace-cz" ? "PraceIcon" : "CarreerIcon",
            expiresAt: new Date(ad.expiryDate.split(".").reverse().join("-")).toISOString(),
          }))}
          open={showExtendModal}
          onOpenChange={setShowExtendModal}
          onConfirm={(selectedPortals) => {
            console.log("Extending portals:", selectedPortals)
            setShowExtendModal(false)
          }}
        />

        {/* Cancel Advertisement Dialog */}
        <CancelAdvertismentDialog
          portals={jobPortals}
          open={showCancelDialog}
          onOpenChange={setShowCancelDialog}
          onConfirm={() => {
            console.log("Cancelling advertisements")
            setShowCancelDialog(false)
          }}
        />
      </div>
    </div>
  )
}

