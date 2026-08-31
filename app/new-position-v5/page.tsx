"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Interfaces for form data
interface RecruitmentData {
  internalName: string
  template: string
}

interface PlatformData {
  jobsCz: boolean
  praceCz: boolean
  praceZaRohem: boolean
  atmoskop: boolean
  profesiaSk: boolean
}

interface JobDetailsData {
  publicName: string
  description: string
  type: string
  workType: 'full-time' | 'part-time'
  workplace: string[]
  workplaceAddress: string
  professions: string[]
  industries: string[]
  salary: {
    from: number
    to: number
    currency: string
    period: string
  }
  education: string
  languages: Array<{
    name: string
    level: string
  }>
  experience: string
  suitableFor: string[]
  companyInfo: string
  recruiterInfo: string
  skills: string[]
}

interface SettingsData {
  duration: string
  autoUpdate: string
}

interface FormData {
  recruitment: RecruitmentData
  platforms: PlatformData
  jobDetails: JobDetailsData
  settings: SettingsData
}

export default function NewPositionV5() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    recruitment: {
      internalName: '',
      template: ''
    },
    platforms: {
      jobsCz: false,
      praceCz: false,
      praceZaRohem: false,
      atmoskop: false,
      profesiaSk: false
    },
    jobDetails: {
      publicName: '',
      description: '',
      type: '',
      workType: 'full-time',
      workplace: [],
      workplaceAddress: '',
      professions: [],
      industries: [],
      salary: {
        from: 0,
        to: 0,
        currency: 'CZK',
        period: 'měsíc'
      },
      education: '',
      languages: [],
      experience: '',
      suitableFor: [],
      companyInfo: '',
      recruiterInfo: '',
      skills: []
    },
    settings: {
      duration: '30',
      autoUpdate: '7'
    }
  })

  const router = useRouter()

  // Sample data for selects
  const templates = [
    { value: 'standard', label: 'Standardní nábor' },
    { value: 'urgent', label: 'Urgentní nábor' },
    { value: 'senior', label: 'Senior pozice' },
    { value: 'junior', label: 'Junior pozice' }
  ]

  const jobTypes = [
    { value: 'employee', label: 'Zaměstnanec' },
    { value: 'contractor', label: 'OSVČ' },
    { value: 'intern', label: 'Stáž' },
    { value: 'freelance', label: 'Freelancer' }
  ]

  const educationLevels = [
    { value: 'none', label: 'Bez vzdělání' },
    { value: 'basic', label: 'Základní vzdělání' },
    { value: 'secondary', label: 'Středoškolské' },
    { value: 'higher', label: 'Vysokoškolské' }
  ]

  const experienceLevels = [
    { value: '0-1', label: '0-1 rok' },
    { value: '1-3', label: '1-3 roky' },
    { value: '3-5', label: '3-5 let' },
    { value: '5+', label: '5+ let' }
  ]

  const workplaceOptions = [
    { value: 'on-site', label: 'Na pracovišti' },
    { value: 'hybrid', label: 'Hybridní' },
    { value: 'remote', label: 'Vzdáleně' }
  ]

  const professions = [
    'Vývojář', 'Designer', 'Manager', 'Analytik', 'Tester', 'DevOps', 'Product Owner'
  ]

  const industries = [
    'IT', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Consulting'
  ]

  const skills = [
    'JavaScript', 'React', 'TypeScript', 'Python', 'Java', 'SQL', 'Docker', 'AWS'
  ]

  const suitableFor = [
    'Absolventi', 'Zkušení profesionálové', 'Senioři', 'Juniory', 'Manažery'
  ]

  const handleContinue = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log("Submitting form data:", formData)
    toast.success("Nábor byl úspěšně vytvořen")
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }))
  }

  const addLanguage = () => {
    const newLanguage = { name: '', level: '' }
    setFormData(prev => ({
      ...prev,
      jobDetails: {
        ...prev.jobDetails,
        languages: [...prev.jobDetails.languages, newLanguage]
      }
    }))
  }

  const updateLanguage = (index: number, field: 'name' | 'level', value: string) => {
    setFormData(prev => ({
      ...prev,
      jobDetails: {
        ...prev.jobDetails,
        languages: prev.jobDetails.languages.map((lang, i) => 
          i === index ? { ...lang, [field]: value } : lang
        )
      }
    }))
  }

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      jobDetails: {
        ...prev.jobDetails,
        languages: prev.jobDetails.languages.filter((_, i) => i !== index)
      }
    }))
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  return (
    <div className="container mt-8">
      <div className="flex gap-6">
        {/* Left column - Vertical stepper */}
        <div className="w-[320px] shrink-0">
          <div className="my-4">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft size={16} />
                Zpět na výpis
              </Link>
            </Button>
          </div>
          
          <Tabs value={String(currentStep)} onValueChange={(value) => setCurrentStep(Number(value))} orientation="vertical" className="w-full">
            <TabsList className="flex flex-col h-auto w-full bg-transparent gap-2">
              <TabsTrigger
                value="1"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    currentStep === 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                  }`}>
                    1
                  </div>
                  <span className="text-sm font-medium">Údaje o náboru</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger
                value="2"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    currentStep === 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                  }`}>
                    2
                  </div>
                  <span className="text-sm font-medium">Místa vystavení</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger
                value="3"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    currentStep === 3 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                  }`}>
                    3
                  </div>
                  <span className="text-sm font-medium">Doplň údaje k inzerátu</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger
                value="4"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    currentStep === 4 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                  }`}>
                    4
                  </div>
                  <span className="text-sm font-medium">Nastavení inzerce</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger
                value="5"
                className="w-full justify-start data-[state=active]:bg-white data-[state=active]:shadow-sm border-none px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    currentStep === 5 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                  }`}>
                    5
                  </div>
                  <span className="text-sm font-medium">Kontrola</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Right column - Form content */}
        <div className="flex-1">
          <Card className="shadow-lg mb-8">
            {currentStep === 1 && (
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-6">Údaje o náboru</CardTitle>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="internalName">Interní název náboru</Label>
                    <Input
                      id="internalName"
                      placeholder="Např. Senior React Developer Q1 2024"
                      value={formData.recruitment.internalName}
                      onChange={(e) => updateFormData('recruitment', { internalName: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="template">Šablona náborového procesu</Label>
                    <Select value={formData.recruitment.template} onValueChange={(value) => updateFormData('recruitment', { template: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte šablonu" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.value} value={template.value}>
                            {template.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            )}

            {currentStep === 2 && (
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-6">Místa vystavení</CardTitle>
                
                <div className="space-y-4">
                  {[
                    { key: 'jobsCz', label: 'Jobs.cz' },
                    { key: 'praceCz', label: 'Práce.cz' },
                    { key: 'praceZaRohem', label: 'Práce za Rohem' },
                    { key: 'atmoskop', label: 'Atmoskop' },
                    { key: 'profesiaSk', label: 'Profesia.sk' }
                  ].map(platform => (
                    <div key={platform.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform.key}
                        checked={formData.platforms[platform.key as keyof PlatformData] as boolean}
                        onCheckedChange={(checked) => 
                          updateFormData('platforms', { [platform.key]: checked })
                        }
                      />
                      <Label htmlFor={platform.key}>{platform.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}

            {currentStep === 3 && (
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-6">Doplň údaje k inzerátu</CardTitle>
                
                <div className="space-y-6">
                  {/* Veřejný název */}
                  <div className="space-y-2">
                    <Label htmlFor="publicName">Veřejný název</Label>
                    <Input
                      id="publicName"
                      placeholder="Např. Senior React Developer"
                      value={formData.jobDetails.publicName}
                      onChange={(e) => updateFormData('jobDetails', { publicName: e.target.value })}
                    />
                  </div>

                  {/* Popis pozice */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Popis pozice</Label>
                    <Textarea
                      id="description"
                      placeholder="Popište pozici..."
                      value={formData.jobDetails.description}
                      onChange={(e) => updateFormData('jobDetails', { description: e.target.value })}
                      rows={6}
                    />
                  </div>

                  {/* Typ */}
                  <div className="space-y-2">
                    <Label htmlFor="type">Typ</Label>
                    <Select value={formData.jobDetails.type} onValueChange={(value) => updateFormData('jobDetails', { type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte typ" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pracovní úvazek */}
                  <div className="space-y-2">
                    <Label>Pracovní úvazek</Label>
                    <RadioGroup value={formData.jobDetails.workType} onValueChange={(value) => updateFormData('jobDetails', { workType: value as 'full-time' | 'part-time' })}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full-time" id="full-time" />
                        <Label htmlFor="full-time">Full-time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="part-time" id="part-time" />
                        <Label htmlFor="part-time">Part-time</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Pracoviště */}
                  <div className="space-y-2">
                    <Label>Pracoviště</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {workplaceOptions.map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.value}
                            checked={formData.jobDetails.workplace.includes(option.value)}
                            onCheckedChange={(checked) => {
                              const newWorkplace = toggleArrayItem(formData.jobDetails.workplace, option.value)
                              updateFormData('jobDetails', { workplace: newWorkplace })
                            }}
                          />
                          <Label htmlFor={option.value}>{option.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Místo pracoviště */}
                  <div className="space-y-2">
                    <Label htmlFor="workplaceAddress">Místo pracoviště</Label>
                    <Input
                      id="workplaceAddress"
                      placeholder="Adresa pracoviště"
                      value={formData.jobDetails.workplaceAddress}
                      onChange={(e) => updateFormData('jobDetails', { workplaceAddress: e.target.value })}
                    />
                  </div>

                  {/* Profese */}
                  <div className="space-y-2">
                    <Label>Profese</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {professions.map(profession => (
                        <div key={profession} className="flex items-center space-x-2">
                          <Checkbox
                            id={profession}
                            checked={formData.jobDetails.professions.includes(profession)}
                            onCheckedChange={(checked) => {
                              const newProfessions = toggleArrayItem(formData.jobDetails.professions, profession)
                              updateFormData('jobDetails', { professions: newProfessions })
                            }}
                          />
                          <Label htmlFor={profession}>{profession}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Odvětví */}
                  <div className="space-y-2">
                    <Label>Odvětví</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {industries.map(industry => (
                        <div key={industry} className="flex items-center space-x-2">
                          <Checkbox
                            id={industry}
                            checked={formData.jobDetails.industries.includes(industry)}
                            onCheckedChange={(checked) => {
                              const newIndustries = toggleArrayItem(formData.jobDetails.industries, industry)
                              updateFormData('jobDetails', { industries: newIndustries })
                            }}
                          />
                          <Label htmlFor={industry}>{industry}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Plat */}
                  <div className="space-y-4">
                    <Label>Plat</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="salaryFrom">Od</Label>
                        <Input
                          id="salaryFrom"
                          type="number"
                          placeholder="0"
                          value={formData.jobDetails.salary.from || ''}
                          onChange={(e) => updateFormData('jobDetails', { 
                            salary: { ...formData.jobDetails.salary, from: Number(e.target.value) }
                          })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="salaryTo">Do</Label>
                        <Input
                          id="salaryTo"
                          type="number"
                          placeholder="0"
                          value={formData.jobDetails.salary.to || ''}
                          onChange={(e) => updateFormData('jobDetails', { 
                            salary: { ...formData.jobDetails.salary, to: Number(e.target.value) }
                          })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="currency">Měna</Label>
                        <Select value={formData.jobDetails.salary.currency} onValueChange={(value) => updateFormData('jobDetails', { 
                          salary: { ...formData.jobDetails.salary, currency: value }
                        })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CZK">CZK</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="period">Období</Label>
                        <Select value={formData.jobDetails.salary.period} onValueChange={(value) => updateFormData('jobDetails', { 
                          salary: { ...formData.jobDetails.salary, period: value }
                        })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hodina">Hodina</SelectItem>
                            <SelectItem value="měsíc">Měsíc</SelectItem>
                            <SelectItem value="rok">Rok</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Vzdělání */}
                  <div className="space-y-2">
                    <Label htmlFor="education">Vzdělání</Label>
                    <Select value={formData.jobDetails.education} onValueChange={(value) => updateFormData('jobDetails', { education: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte vzdělání" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Jazykové znalosti */}
                  <div className="space-y-2">
                    <Label>Jazykové znalosti</Label>
                    <div className="space-y-2">
                      {formData.jobDetails.languages.map((language, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Jazyk"
                            value={language.name}
                            onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                          />
                          <Select value={language.level} onValueChange={(value) => updateLanguage(index, 'level', value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Úroveň" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A1">A1</SelectItem>
                              <SelectItem value="A2">A2</SelectItem>
                              <SelectItem value="B1">B1</SelectItem>
                              <SelectItem value="B2">B2</SelectItem>
                              <SelectItem value="C1">C1</SelectItem>
                              <SelectItem value="C2">C2</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLanguage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button onClick={addLanguage} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Přidat jazyk
                      </Button>
                    </div>
                  </div>

                  {/* Years of experience */}
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of experience</Label>
                    <Select value={formData.jobDetails.experience} onValueChange={(value) => updateFormData('jobDetails', { experience: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte zkušenosti" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Práce je vhodná pro */}
                  <div className="space-y-2">
                    <Label>Práce je vhodná pro</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {suitableFor.map(item => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox
                            id={item}
                            checked={formData.jobDetails.suitableFor.includes(item)}
                            onCheckedChange={(checked) => {
                              const newSuitableFor = toggleArrayItem(formData.jobDetails.suitableFor, item)
                              updateFormData('jobDetails', { suitableFor: newSuitableFor })
                            }}
                          />
                          <Label htmlFor={item}>{item}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Informace o společnosti */}
                  <div className="space-y-2">
                    <Label htmlFor="companyInfo">Informace o společnosti</Label>
                    <Textarea
                      id="companyInfo"
                      placeholder="Informace o společnosti..."
                      value={formData.jobDetails.companyInfo}
                      onChange={(e) => updateFormData('jobDetails', { companyInfo: e.target.value })}
                      rows={3}
                    />
                  </div>

                  {/* Informace o recruiterovi */}
                  <div className="space-y-2">
                    <Label htmlFor="recruiterInfo">Informace o recruiterovi</Label>
                    <Textarea
                      id="recruiterInfo"
                      placeholder="Informace o recruiterovi..."
                      value={formData.jobDetails.recruiterInfo}
                      onChange={(e) => updateFormData('jobDetails', { recruiterInfo: e.target.value })}
                      rows={3}
                    />
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {skills.map(skill => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={formData.jobDetails.skills.includes(skill)}
                            onCheckedChange={(checked) => {
                              const newSkills = toggleArrayItem(formData.jobDetails.skills, skill)
                              updateFormData('jobDetails', { skills: newSkills })
                            }}
                          />
                          <Label htmlFor={skill}>{skill}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}

            {currentStep === 4 && (
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-6">Nastavení inzerce</CardTitle>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Doba inzerce</Label>
                    <Select value={formData.settings.duration} onValueChange={(value) => updateFormData('settings', { duration: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 dní</SelectItem>
                        <SelectItem value="14">14 dní</SelectItem>
                        <SelectItem value="30">30 dní</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="autoUpdate">Automatická aktualizace</Label>
                    <Select value={formData.settings.autoUpdate} onValueChange={(value) => updateFormData('settings', { autoUpdate: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 dní</SelectItem>
                        <SelectItem value="14">14 dní</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            )}

            {currentStep === 5 && (
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-6">Kontrola</CardTitle>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formData.platforms).filter(([_, enabled]) => enabled).map(([platform, _]) => (
                      <Card key={platform} className="p-4">
                        <CardHeader>
                          <CardTitle className="text-lg">{platform.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <strong>Veřejný název:</strong> {formData.jobDetails.publicName}
                            </div>
                            <div>
                              <strong>Typ:</strong> {jobTypes.find(t => t.value === formData.jobDetails.type)?.label}
                            </div>
                            <div>
                              <strong>Úvazek:</strong> {formData.jobDetails.workType === 'full-time' ? 'Full-time' : 'Part-time'}
                            </div>
                            <div>
                              <strong>Plat:</strong> {formData.jobDetails.salary.from} - {formData.jobDetails.salary.to} {formData.jobDetails.salary.currency}/{formData.jobDetails.salary.period}
                            </div>
                            <div>
                              <strong>Doba inzerce:</strong> {formData.settings.duration} dní
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Zpět
            </Button>
            
            <Button
              onClick={handleContinue}
            >
              {currentStep === 5 ? 'Dokončit' : 'Pokračovat'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
