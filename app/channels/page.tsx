"use client"

import { useState, useRef } from "react"
import { LeftMenu } from "@/components/left-menu"
import { TopHeader } from "@/components/top-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight, Plus, Upload, Edit, Check } from "lucide-react"
import { mockChannels } from "@/data/mock-channels"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChannelConfig, AttributeMapping } from "@/types/channel-mapping"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { XmlViewer } from "@/components/channel/xml-viewer"
import Link from "next/link"
import { ProfesiaIcon, PraceZaRohemIcon, KarierniStrankyIcon, ExportPozicIcon } from "@/components/icons/job-portal-icons"

export default function ChannelsPage() {
  const [selectedChannel, setSelectedChannel] = useState<ChannelConfig | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editingMapping, setEditingMapping] = useState<{index: number, field: string} | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filtrování kanálů podle vyhledávání
  const filteredChannels = mockChannels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.type.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Jen jobboardy (pracovní portály)
  const jobboards = filteredChannels.filter(channel => channel.type === "jobboard")
  
  const handleChannelSelect = (channel: ChannelConfig) => {
    setSelectedChannel(channel)
    setSelectedFile(null)
  }
  
  const handleBack = () => {
    setSelectedChannel(null)
    setSelectedFile(null)
  }

  // Funkce pro nahrání XML nebo JSON souboru
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Funkce pro zahájení editace mapování
  const startEditing = (index: number, field: string) => {
    setEditingMapping({ index, field })
  }

  // Funkce pro uložení editovaného mapování
  const saveMapping = (index: number, newValue: string) => {
    if (!selectedChannel) return

    const newMappings = [...selectedChannel.mappings];
    newMappings[index] = {
      ...newMappings[index],
      importField: newValue,
      mapped: newValue !== "Don't map this field"
    };

    const updatedChannel = {
      ...selectedChannel,
      mappings: newMappings
    };

    setSelectedChannel(updatedChannel);
    setEditingMapping(null);

    toast({
      title: "Mapování aktualizováno",
      description: "Atribut byl úspěšně namapován",
      duration: 3000
    });
  }

  // Funkce pro zpracování navrženého mapování z XML/JSON
  const handleMappingsSuggested = (suggestedMappings: Array<{sfxField: string, importField: string}>) => {
    if (!selectedChannel) return;

    const newMappings = [...selectedChannel.mappings];
    
    suggestedMappings.forEach(suggestion => {
      const mappingIndex = newMappings.findIndex(
        mapping => mapping.sfxField === suggestion.sfxField
      );
      
      if (mappingIndex !== -1) {
        newMappings[mappingIndex] = {
          ...newMappings[mappingIndex],
          importField: suggestion.importField,
          mapped: true
        };
      }
    });
    
    setSelectedChannel({
      ...selectedChannel,
      mappings: newMappings
    });
    
    toast({
      title: "Mapování rozpoznáno",
      description: `Bylo rozpoznáno a automaticky namapováno ${suggestedMappings.length} atributů.`,
      duration: 3000
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="left-menu">
        <LeftMenu />
      </div>
      <div className="main-content pl-[60px] xl:pl-[140px]">
        <div className="top-header">
          <TopHeader userName="Anna K." companyName="Acme Corporation s.r.o." />
        </div>
        
        <main className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Seznam pracovních portálů</h1>
            <Link href="/channels/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Vytvořit kanál
              </Button>
            </Link>
          </div>
          
          {!selectedChannel ? (
            <>
              <div className="flex items-center mb-6 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Vyhledat portál..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid gap-4">
                {jobboards.map((channel) => (
                  <div 
                    key={channel.id} 
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleChannelSelect(channel)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {channel.name.includes("Profesia") && <ProfesiaIcon />}
                        {channel.name.includes("Práce za rohem") && <PraceZaRohemIcon />}
                        {channel.name.includes("Kariérní stránky") && <KarierniStrankyIcon />}
                        {channel.name.includes("Export") && <ExportPozicIcon />}
                        <div>
                          <h3 className="text-lg font-semibold">{channel.name}</h3>
                          <p className="text-sm text-gray-500">
                            {channel.active ? (
                              <span className="inline-flex items-center text-green-600">
                                <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                                Aktivní portál
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-gray-500">
                                <span className="mr-1 h-2 w-2 rounded-full bg-gray-300"></span>
                                Neaktivní
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
                
                {jobboards.length === 0 && (
                  <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">Žádné pracovní portály nenalezeny</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                >
                  Zpět na seznam
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline">
                    Upravit kanál
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Nahrát XML/JSON
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".xml,.json"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">
                      <div className="flex items-center gap-3">
                        {selectedChannel.name.includes("Profesia") && <ProfesiaIcon />}
                        {selectedChannel.name.includes("Práce za rohem") && <PraceZaRohemIcon />}
                        {selectedChannel.name.includes("Kariérní stránky") && <KarierniStrankyIcon />}
                        {selectedChannel.name.includes("Export") && <ExportPozicIcon />}
                        {selectedChannel.name}
                      </div>
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedChannel.active ? "Aktivní" : "Neaktivní"} • {selectedChannel.type}
                    </p>
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="mb-6">
                    <div className="flex items-center p-2 bg-gray-100 rounded mb-4">
                      <span className="text-sm">Nahraný soubor: {selectedFile.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => setSelectedFile(null)}
                      >
                        Zrušit
                      </Button>
                    </div>
                    <div className="mb-6">
                      <XmlViewer 
                        xmlFile={selectedFile} 
                        onMappingsSuggested={handleMappingsSuggested}
                      />
                    </div>
                  </div>
                )}

                {!selectedFile && (
                  <div className="mb-6 text-sm text-gray-500">
                    Pro automatické mapování atributů nahrajte XML nebo JSON soubor pomocí tlačítka "Nahrát XML/JSON" výše.
                    Nebo můžete ručně mapovat atributy kliknutím na ikonu úpravy v tabulce níže.
                  </div>
                )}
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="w-1/2 py-3 font-medium">Atributy v systému</TableHead>
                        <TableHead className="w-1/2 py-3 font-medium">Atributy v {selectedChannel.name}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedChannel.mappings.map((mapping, index) => (
                        <TableRow key={index} className="hover:bg-gray-50 group">
                          <TableCell className="py-3">
                            <div className="flex items-center">
                              <span>{mapping.sfxField}</span>
                              {mapping.sfxField.includes('*') && (
                                <span className="ml-2 text-xs text-red-500">Povinné</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="flex items-center justify-between">
                              {editingMapping && editingMapping.index === index ? (
                                <div className="flex-1">
                                  <Select
                                    defaultValue={mapping.importField}
                                    onValueChange={(value) => saveMapping(index, value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Vybrat atribut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Don't map this field">Nemapovat</SelectItem>
                                      <SelectItem value="Title">Title</SelectItem>
                                      <SelectItem value="Description">Description</SelectItem>
                                      <SelectItem value="Location">Location</SelectItem>
                                      <SelectItem value="Salary">Salary</SelectItem>
                                      <SelectItem value="Required Skills">Required Skills</SelectItem>
                                      <SelectItem value="Experience">Experience</SelectItem>
                                      <SelectItem value="Employment Type">Employment Type</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              ) : (
                                <>
                                  <span className={mapping.mapped ? "" : "text-gray-400 italic"}>
                                    {mapping.importField}
                                  </span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => startEditing(index, "importField")}
                                    className="ml-2 invisible group-hover:visible hover:bg-gray-100"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 