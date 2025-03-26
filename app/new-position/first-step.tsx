"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SalaryInput } from "./components/salary-input"
import { LanguageSelector } from "./components/language-selector"
import { MultiSelect } from "@/components/ui/multi-select"
import { RichTextEditor } from "./components/rich-text-editor"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

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

export function FirstStep() {
  const [isRemote, setIsRemote] = useState(false)

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
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="title">Název pozice</Label>
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
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
            <Select onValueChange={(value) => form.setValue("field", value)}>
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

        <SalaryInput />

        <div className="grid gap-2">
          <Label>Vzdělání</Label>
          <Select onValueChange={(value) => form.setValue("education", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte požadované vzd��lání" />
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
          <RadioGroup onValueChange={(value) => form.setValue("type", value as "full" | "part")} className="flex gap-4">
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

      <div className="flex justify-end">
        <Button type="submit">Pokračovat</Button>
      </div>
    </form>
  )
}

