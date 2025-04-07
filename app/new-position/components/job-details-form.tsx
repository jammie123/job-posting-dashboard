"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { Loader2 } from "lucide-react"
import { LanguageSelector } from "./language-selector"

interface JobDetailsFormProps {
  form: any // Typ bude upřesněn podle konkrétního použití useForm
  educationLevels: string[]
  benefits: string[]
  loadingFields: Record<string, boolean>
  showValidationErrors: boolean
  handleInputBlur: (fieldId: string, value: any, processFn?: (value: any) => Promise<any>) => Promise<void>
}

export function JobDetailsForm({
  form,
  educationLevels,
  benefits,
  loadingFields,
  showValidationErrors,
  handleInputBlur
}: JobDetailsFormProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label>Vzdělání</Label>
        <div className="relative">
          <Select 
            onValueChange={(value) => {
              form.setValue("education", value)
              handleInputBlur("education", value)
            }}
            value={form.watch("education")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vyberte minimální vzdělání" />
            </SelectTrigger>
            <SelectContent>
              {educationLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingFields.education && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">načítám...</span>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {showValidationErrors && form.formState.errors.education && (
          <p className="text-sm text-destructive">{form.formState.errors.education.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label>Jazykové znalosti</Label>
        <LanguageSelector />
      </div>

      <div className="grid gap-2">
        <Label>Benefity</Label>
        <div className="relative">
          <MultiSelect
            options={benefits}
            selected={form.watch("benefits")}
            onChange={(value) => {
              form.setValue("benefits", value)
              handleInputBlur("benefits", value)
            }}
            placeholder="Vyberte benefity"
          />
          {loadingFields.benefits && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">načítám...</span>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {showValidationErrors && form.formState.errors.benefits && (
          <p className="text-sm text-destructive">{form.formState.errors.benefits.message}</p>
        )}
      </div>
    </>
  )
} 