"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { InfoIcon } from "lucide-react"

// Ukázková struktura XML souboru
const sampleXmlStructure = {
  rootElement: "jobs",
  itemElement: "job",
  fields: [
    { name: "title", path: "/job/title", sample: "Senior Developer" },
    { name: "description", path: "/job/description", sample: "We are looking for..." },
    { name: "requirements", path: "/job/requirements", sample: "5+ years of experience" },
    { name: "location", path: "/job/location", sample: "Prague" },
    { name: "employmentType", path: "/job/employment_type", sample: "Full-time" },
    { name: "salary", path: "/job/salary", sample: "50000-70000" },
    { name: "company", path: "/job/company", sample: "Acme Inc." },
    { name: "contactEmail", path: "/job/contact/email", sample: "jobs@acme.com" },
  ]
}

interface XmlViewerProps {
  xmlFile?: File
}

export function XmlViewer({ xmlFile }: XmlViewerProps) {
  const [expandedField, setExpandedField] = useState<string | null>(null)

  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <div className="flex items-start gap-2 mb-4">
        <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5" />
        <div>
          <h3 className="font-medium">XML Struktura</h3>
          <p className="text-sm text-gray-500">
            {xmlFile 
              ? `Analyzovaný soubor: ${xmlFile.name}` 
              : "Ukázková struktura XML souboru"}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">Root Element</Badge>
          <span className="font-mono text-sm">{sampleXmlStructure.rootElement}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Item Element</Badge>
          <span className="font-mono text-sm">{sampleXmlStructure.itemElement}</span>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {sampleXmlStructure.fields.map((field, index) => (
          <AccordionItem key={index} value={field.name}>
            <AccordionTrigger className="hover:bg-gray-100 p-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{field.name}</span>
                <span className="text-xs text-gray-500 font-mono">{field.path}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-2 bg-white rounded border mb-2">
                <div className="text-xs text-gray-500 mb-1">Ukázková hodnota:</div>
                <div className="font-mono text-sm">{field.sample}</div>
              </div>
              <div className="flex gap-2 justify-end">
                <Badge className="cursor-pointer" variant="secondary">Použít</Badge>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-4 text-xs text-gray-500">
        Tip: Klikněte na pole pro zobrazení detailů a mapování
      </div>
    </div>
  )
} 