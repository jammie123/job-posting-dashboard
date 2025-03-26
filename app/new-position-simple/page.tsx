"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SalaryInput } from "@/app/new-position/components/salary-input"
import { LanguageSelector } from "@/app/new-position/components/language-selector"
import { MultiSelect } from "@/components/ui/multi-select"
import { RichTextEditor } from "@/app/new-position/components/rich-text-editor"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ApplicationForm } from "@/app/new-position/components/application-form"
import { ColaborationTeam } from "@/app/new-position/components/colaboration-team"
import { ArrowLeft, ArrowRight, Wand2 } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

const localities = {
  headquarters: ["Adresa centrály: Václavské náměstí 837/11, 110 00 Praha 1"],
  branches: ["Adresa pobočky: Dominikánské náměstí 196/1, 602 00 Brno"],
  others: [
    "náměstí Republiky 1/1, 301 00 Plzeň",
    "nám. Dr. E. Beneše 1/1, 460 59 Liberec",
    "Horní náměstí 583, 779 11 Olomouc",
    "Československé armády 408/51, 500 03 Hradec Králové",
    "náměstí Přemysla Otakara II. 1/1, 370 92 České Budějovice",
    "Remote",
  ],
}

const fields = [
  "IT a telekomunikace",
  "Finance a účetnictví",
  "Marketing a PR",
  "Administrativa",
  "Výroba a průmysl",
  "Obchod a prodej",
  "Logistika a doprava",
  "Stavebnictví",
]

const professions = [
  "Programátor",
  "Tester",
  "Projektový manažer",
  "Obchodní zástupce",
  "Účetní",
  "Marketingový specialista",
  "HR specialista",
  "Specialista péče o zákazníky",
  "Skladník",
]

const benefits = [
  "13. plat",
  "5 týdnů dovolené",
  "Stravenky",
  "MultiSport karta",
  "Flexibilní pracovní doba",
  "Home office",
  "Sick days",
  "Příspěvek na dopravu",
  "Příspěvek na penzijní připojištění",
  "Firemní notebook",
  "Firemní telefon",
]

const educationLevels = [
  "Základní",
  "Středoškolské",
  "Středoškolské s maturitou",
  "Vyšší odborné",
  "Vysokoškolské bakalářské",
  "Vysokoškolské magisterské",
  "Vysokoškolské doktorské",
]

const FormSchema = z.object({
  title: z.string().min(1, "Název pozice je povinný"),
  locality: z.array(z.string()).min(1, "Vyberte alespoň jednu lokalitu"),
  field: z.string().min(1, "Vyberte obor"),
  profession: z.array(z.string()).min(1, "Vyberte alespoň jednu profesi"),
  description: z.string().min(1, "Popis pozice je povinný"),
  education: z.string().min(1, "Vyberte požadované vzdělání"),
  benefits: z.array(z.string()),
  type: z.enum(["full", "part"], {
    required_error: "Vyberte typ úvazku",
  }),
})

export default function NewPositionSimple() {
  const [isRemote, setIsRemote] = useState(false)
  const [showFullForm, setShowFullForm] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      locality: [],
      profession: [],
      benefits: [],
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    // Here you would typically save the data and redirect
  }

  // Function to simulate AI generation of form data based on title
  const generateFormData = () => {
    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      const title = form.getValues("title")

      // Check if the title matches our example
      if (title.toLowerCase().includes("specialistu péče o zákazníky") || title.toLowerCase().includes("zákazník")) {
        // Set predefined values for this specific title
        form.setValue(
          "description",
          `<p>Hledáme specialistu péče o zákazníky, který bude zodpovědný za poskytování vynikající zákaznické podpory našim klientům.</p>
        <p>Náplň práce:</p>
        <ul>
          <li>Komunikace se zákazníky prostřednictvím telefonu, e-mailu a chatu</li>
          <li>Řešení dotazů a problémů zákazníků</li>
          <li>Zpracování objednávek a reklamací</li>
          <li>Poskytování informací o produktech a službách</li>
          <li>Vedení záznamů o komunikaci se zákazníky</li>
        </ul>
        <p>Požadujeme:</p>
        <ul>
          <li>Výborné komunikační dovednosti</li>
          <li>Orientaci na zákazníka</li>
          <li>Schopnost řešit problémy</li>
          <li>Znalost práce s PC</li>
          <li>Spolehlivost a pečlivost</li>
        </ul>`,
        )

        // Extract location from title
        if (title.toLowerCase().includes("praha 4")) {
          form.setValue("locality", ["Jeremenkova 1089, 147 00 Praha 4"])
        } else {
          form.setValue("locality", [localities.headquarters[0]])
        }

        form.setValue("field", "Obchod a prodej")
        form.setValue("profession", ["Specialista péče o zákazníky"])
        form.setValue("education", "Středoškolské s maturitou")
        form.setValue("benefits", ["5 týdnů dovolené", "Stravenky", "MultiSport karta", "Firemní telefon"])
        form.setValue("type", "full")
      } else {
        // Generic values for any other title
        form.setValue("description", "<p>Popis pozice bude vygenerován na základě názvu pozice.</p>")
        form.setValue("locality", [localities.headquarters[0]])
        form.setValue("field", "Administrativa")
        form.setValue("profession", ["HR specialista"])
        form.setValue("education", "Středoškolské s maturitou")
        form.setValue("benefits", ["5 týdnů dovolené", "Stravenky"])
        form.setValue("type", "full")
      }

      setIsGenerating(false)
      setShowFullForm(true)
    }, 1500)
  }

  return (
    <div className="container py-6 max-w-[900px] mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Dobrý den, Anna K.</CardTitle>
          <p className="text-muted-foreground mt-2">
            Napište název pozice a my za vás specifikujeme pozici za pomocí umělé inteligence v nejlepší možné míře,
            výslednou podobu si však můžete upravit podle Vás.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-8">
            {/* Title field - always visible */}
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Název pozice</Label>
                <div className="flex gap-2">
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="např. Specialistu péče o zákazníky - Praha 4"
                    className="flex-1"
                    onChange={(e) => {
                      form.setValue("title", e.target.value)
                      // Pre-fill with example if empty and user starts typing
                      if (e.target.value && !form.getValues("title")) {
                        form.setValue("title", "Specialistu péče o zákazníky - Praha 4")
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={generateFormData}
                    disabled={isGenerating || form.getValues("title") === ""}
                    className="whitespace-nowrap"
                  >
                    {isGenerating ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        Generuji...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Vyplň mi zbytek pozice
                      </>
                    )}
                  </Button>
                </div>
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>
            </div>
            {!showFullForm && (
              <div className="mt-4 flex justify-end flex-wrap gap-4">
                <Button variant="ghost" asChild>
                  <Link href="/new-position" className="flex items-center gap-2">
                    Chci použít běžný formulář pro vytvoření
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Rest of the form - only visible after generation */}
            {showFullForm && (
              <>
                {/* Basic Information */}
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="description">Popis pozice</Label>
                    <RichTextEditor
                      value={form.watch("description") || ""}
                      onChange={(value) => form.setValue("description", value)}
                      className="min-h-[200px]"
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label>Lokalita</Label>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="remote-switch" className="text-sm font-medium">
                          Remote
                        </Label>
                        <Switch
                          id="remote-switch"
                          checked={isRemote}
                          onCheckedChange={(checked) => {
                            setIsRemote(checked)
                            if (checked) {
                              // If remote is enabled, clear the locality selection
                              form.setValue("locality", [])
                            }
                          }}
                        />
                      </div>
                    </div>
                    <MultiSelect
                      options={[...localities.headquarters, ...localities.branches, ...localities.others]}
                      selected={form.watch("locality")}
                      onChange={(value) => form.setValue("locality", value)}
                      placeholder="Vyberte lokality"
                      isRemote={isRemote}
                      headquartersAddress={localities.headquarters[0]}
                    />
                    {form.formState.errors.locality && (
                      <p className="text-sm text-destructive">{form.formState.errors.locality.message}</p>
                    )}
                    {isRemote && (
                      <p className="text-xs text-muted-foreground">
                        U remote pozice bude použita adresa vaší firmy {localities.headquarters[0]}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Obor</Label>
                      <Select value={form.watch("field")} onValueChange={(value) => form.setValue("field", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Vyberte obor" />
                        </SelectTrigger>
                        <SelectContent>
                          {fields.map((field) => (
                            <SelectItem key={field} value={field}>
                              {field}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.field && (
                        <p className="text-sm text-destructive">{form.formState.errors.field.message}</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label>Profese</Label>
                      <MultiSelect
                        options={professions}
                        selected={form.watch("profession")}
                        onChange={(value) => form.setValue("profession", value)}
                        placeholder="Vyberte profese"
                      />
                      {form.formState.errors.profession && (
                        <p className="text-sm text-destructive">{form.formState.errors.profession.message}</p>
                      )}
                    </div>
                  </div>

                  <SalaryInput />

                  <div className="grid gap-2">
                    <Label>Vzdělání</Label>
                    <Select
                      value={form.watch("education")}
                      onValueChange={(value) => form.setValue("education", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte požadované vzdělání" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.education && (
                      <p className="text-sm text-destructive">{form.formState.errors.education.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label>Jazykové znalosti</Label>
                    <LanguageSelector />
                  </div>

                  <div className="grid gap-2">
                    <Label>Benefity</Label>
                    <MultiSelect
                      options={benefits}
                      selected={form.watch("benefits")}
                      onChange={(value) => form.setValue("benefits", value)}
                      placeholder="Vyberte benefity"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Typ úvazku</Label>
                    <RadioGroup
                      value={form.watch("type")}
                      onValueChange={(value) => form.setValue("type", value as "full" | "part")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full" id="full" />
                        <Label htmlFor="full">Hlavní pracovní poměr</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="part" id="part" />
                        <Label htmlFor="part">Zkrácený úvazek</Label>
                      </div>
                    </RadioGroup>
                    {form.formState.errors.type && (
                      <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
                    )}
                  </div>
                </div>

                {/* Questionnaire Section */}
                <div>
                  <Separator className="my-6" />
                  <h2 className="text-xl font-semibold mb-4">Dotazník pro uchazeče</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <ApplicationForm />
                  </div>
                </div>

                {/* Collaboration Section */}
                <div>
                  <Separator className="my-6" />
                  <h2 className="text-xl font-semibold mb-4">Kolaborace s kolegy</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <ColaborationTeam />
                  </div>
                </div>
              </>
            )}
          </form>
        </CardContent>
        {showFullForm && (
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Zpátky na výpis náborů
              </Link>
            </Button>
            <Button onClick={() => form.handleSubmit(onSubmit)()} disabled={!showFullForm}>
              Vytvořit nábor
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

