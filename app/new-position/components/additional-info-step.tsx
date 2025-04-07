"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { JobDetailsForm } from "./job-details-form"

// Seznam vzdělání a benefitů - přesunuto z first-step.tsx
const educationLevels = [
  "Základní",
  "Středoškolské",
  "Středoškolské s maturitou",
  "Vyšší odborné",
  "Vysokoškolské bakalářské",
  "Vysokoškolské magisterské",
  "Vysokoškolské doktorské",
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

// Validační schéma formuláře
const FormSchema = z.object({
  education: z.string().min(1, "Vyberte požadované vzdělání"),
  benefits: z.array(z.string()),
  // Další validační pravidla můžete přidat dle potřeby
})

interface AdditionalInfoStepProps {
  onNextStep?: () => void;
  onPrevStep?: () => void;
}

export function AdditionalInfoStep({ onNextStep, onPrevStep }: AdditionalInfoStepProps) {
  // Stav pro sledování načítání pro jednotlivá pole
  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>({
    education: false,
    benefits: false,
    languages: false,
  })

  // Stav pro kontrolu zobrazování chyb
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      benefits: [],
    },
    mode: "onSubmit"
  })

  // Funkce pro odeslání formuláře
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Doplňující informace:", data)
    toast.success("Doplňující informace byly uloženy")
    
    // Pokud je formulář validní, přejdeme na další krok
    if (form.formState.isValid && onNextStep) {
      onNextStep();
    }
  }

  // Generická funkce pro zpracování blur událostí
  const handleInputBlur = async (fieldId: string, value: any, processFn?: (value: any) => Promise<any>) => {
    if (!value) return;

    // Nastavit načítání pro dané pole
    setLoadingFields(prev => ({ ...prev, [fieldId]: true }));
    
    try {
      // Simulace zpracování pro pole (pouze pro demonstraci)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Pokud je poskytnuta processFn, použít ji pro zpracování hodnoty
      if (processFn) {
        await processFn(value);
      }
    } catch (error) {
      console.error(`Error processing ${fieldId}:`, error);
      toast.error(`Chyba při zpracování pole ${fieldId}`);
    } finally {
      // Ukončit načítání pro dané pole
      setLoadingFields(prev => ({ ...prev, [fieldId]: false }));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6">
        <JobDetailsForm 
          form={form}
          educationLevels={educationLevels}
          benefits={benefits}
          loadingFields={loadingFields}
          showValidationErrors={showValidationErrors}
          handleInputBlur={handleInputBlur}
        />
      </div>

      <div className="flex justify-between pt-6 mt-6 border-t">
        <Button 
          variant="outline" 
          type="button"
          onClick={onPrevStep}
        >
          Zpět
        </Button>
        <Button 
          type="submit" 
          onClick={() => setShowValidationErrors(true)}
        >
          Pokračovat
          {Object.values(loadingFields).some(loading => loading) && (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          )}
        </Button>
      </div>
    </form>
  )
} 