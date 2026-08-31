"use client"

import { useState } from "react"
import { LeftMenu } from "@/components/left-menu"
import { TopHeader } from "@/components/top-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronRight, Plus } from "lucide-react"
import { mockChannels } from "@/data/mock-channels"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChannelConfig, AttributeMapping } from "@/types/channel-mapping"

export default function JobboardsPage() {
  const [selectedChannel, setSelectedChannel] = useState<ChannelConfig | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrování kanálů podle vyhledávání
  const filteredChannels = mockChannels.filter(channel =>
    (channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
    channel.type === "jobboard" // Pouze pracovní portály
  )
  
  const handleChannelSelect = (channel: ChannelConfig) => {
    setSelectedChannel(channel)
  }
  
  const handleBack = () => {
    setSelectedChannel(null)
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Pracovní portály (Jobboards)</h1>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Přidat nový portál
            </Button>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChannels.map((channel) => (
                  <div 
                    key={channel.id} 
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleChannelSelect(channel)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{channel.name}</h3>
                        <p className="text-sm text-gray-500">
                          {channel.active ? (
                            <span className="inline-flex items-center text-green-600">
                              <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                              Aktivní
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-gray-500">
                              <span className="mr-1 h-2 w-2 rounded-full bg-gray-300"></span>
                              Neaktivní
                            </span>
                          )}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
                
                {filteredChannels.length === 0 && (
                  <div className="text-center p-8 bg-white rounded-lg shadow-sm col-span-full">
                    <p className="text-gray-500">Žádné pracovní portály nenalezeny</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <Button
                variant="outline"
                className="mb-6"
                onClick={handleBack}
              >
                Zpět na seznam
              </Button>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedChannel.name}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedChannel.active ? "Aktivní" : "Neaktivní"} • {selectedChannel.type}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Upravit</Button>
                    <Button variant={selectedChannel.active ? "destructive" : "default"}>
                      {selectedChannel.active ? "Deaktivovat" : "Aktivovat"}
                    </Button>
                  </div>
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
                      {selectedChannel.mappings
                        .filter(mapping => mapping.mapped)
                        .map((mapping, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="py-3">
                            <div className="flex items-center">
                              <span>{mapping.sfxField}</span>
                              {mapping.sfxField.includes('*') && (
                                <span className="ml-2 text-xs text-red-500">Povinné</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <span>{mapping.importField}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Nemapované atributy</h3>
                  <div className="text-sm text-gray-500">
                    {selectedChannel.mappings.filter(m => !m.mapped).length > 0 ? (
                      <ul className="list-disc pl-5">
                        {selectedChannel.mappings
                          .filter(mapping => !mapping.mapped)
                          .map((mapping, index) => (
                            <li key={index}>{mapping.sfxField}</li>
                          ))}
                      </ul>
                    ) : (
                      <p>Všechny atributy jsou namapované</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 