"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { LeftMenu } from "@/components/left-menu"
import { TopHeader } from "@/components/top-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Upload, Plus } from "lucide-react"
import { AttributeSelector } from "@/components/channel/attribute-selector"
import { XmlViewer } from "@/components/channel/xml-viewer"
import { mockChannels } from "@/data/mock-channels"
import { AttributeMapping, ChannelConfig } from "@/types/channel-mapping"

export default function ChannelPage() {
  const [selectedChannel, setSelectedChannel] = useState<ChannelConfig>(mockChannels[0])
  const [mappings, setMappings] = useState<AttributeMapping[]>(selectedChannel.mappings)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active") // "active" nebo "inactive"

  // Filtrované kanály podle aktivního stavu
  const activeChannels = mockChannels.filter(channel => channel.active)
  const inactiveChannels = mockChannels.filter(channel => !channel.active)
  
  // Filtrování dle vyhledávání
  const filteredMappings = mappings.filter(mapping =>
    mapping.sfxField.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mapping.importField.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Změna vybraného kanálu
  const handleChannelChange = (channel: ChannelConfig) => {
    setSelectedChannel(channel)
    setMappings(channel.mappings)
  }

  // Funkce pro nahrání XML souboru
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      // V reálné aplikaci by zde byla logika pro parsování XML souboru
      // a vytvoření nového mapování na základě jeho obsahu
    }
  }

  // Funkce pro změnu mapování atributu
  const handleMappingChange = (index: number, newValue: string) => {
    const newMappings = [...mappings];
    newMappings[index] = {
      ...newMappings[index],
      importField: newValue,
      mapped: newValue !== "Don't map this field"
    };
    setMappings(newMappings);
  }

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
          <PageHeader 
            title="Mapování kanálů" 
            counts={{}} 
          />
          <p className="text-gray-500 mb-6">
            Nakonfigurujte mapování atributů pozice na externí pracovní portály
          </p>

          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Kanály</h2>
                
                <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="active">Aktivní</TabsTrigger>
                    <TabsTrigger value="inactive">Neaktivní</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active">
                    <div className="space-y-2">
                      {activeChannels.map((channel) => (
                        <Button 
                          key={channel.id}
                          variant={selectedChannel.id === channel.id ? "default" : "ghost"}
                          className="w-full justify-start text-left"
                          onClick={() => handleChannelChange(channel)}
                        >
                          {channel.name}
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                            {channel.type}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="inactive">
                    <div className="space-y-2">
                      {inactiveChannels.map((channel) => (
                        <Button 
                          key={channel.id}
                          variant={selectedChannel.id === channel.id ? "default" : "ghost"}
                          className="w-full justify-start text-left"
                          onClick={() => handleChannelChange(channel)}
                        >
                          {channel.name}
                          <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                            {channel.type}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-4">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Přidat kanál
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">
                    Konfigurace kanálu: {selectedChannel.name}
                    <span className="ml-2 text-sm text-gray-500">({selectedChannel.type})</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => document.getElementById('fileInput')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Nahrát XML
                    </Button>
                    <input
                      type="file"
                      id="fileInput"
                      accept=".xml"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  {selectedFile ? (
                    <div>
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
                        <XmlViewer xmlFile={selectedFile} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 mb-4">
                      Nahrajte XML soubor s atributy nebo upravte mapování ručně.
                    </div>
                  )}
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Vyhledat atribut..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="w-1/2 py-3 font-medium">Atributy v systému</TableHead>
                        <TableHead className="w-1/2 py-3 font-medium">Atributy v {selectedChannel.name}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMappings.map((mapping, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="flex items-center">
                            <div className="flex items-center">
                              <span>{mapping.sfxField}</span>
                              {mapping.sfxField.includes('*') && (
                                <span className="ml-2 text-xs text-red-500">Povinné</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-between">
                              <span className={mapping.mapped ? "" : "text-gray-400 italic"}>
                                {mapping.importField}
                              </span>
                              <AttributeSelector 
                                value={mapping.importField} 
                                onChange={(value) => handleMappingChange(index, value)} 
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline">Zrušit</Button>
                <Button>Uložit mapování</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 