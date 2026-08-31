"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Users } from "lucide-react"

type UserRole = "HR administrátor" | "Recruiter" | "Liniový manažer" | "Náborář"

interface TeamMember {
  id: string
  name: string
  email: string
  role: UserRole
  isOwner?: boolean
}

interface RecruiterCardProps {
  avatar?: string
  fullname: string
  role?: string
  onChange?: (members: TeamMember[]) => void
}

export function RecruiterCard({ avatar, fullname, role = "Náborář", onChange }: RecruiterCardProps) {
  const [isColleaguesDialogOpen, setIsColleaguesDialogOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    role: "Recruiter",
  })
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: fullname || "Jan Novák",
      email: "jan.novak@company.cz",
      role: role as UserRole,
      isOwner: true,
    }
  ])

  // Add mock data for company colleagues
  const companyColleagues: TeamMember[] = [
    {
      id: "c1",
      name: "Adam Černý",
      email: "adam.cerny@company.cz",
      role: "Recruiter",
    },
    {
      id: "c2",
      name: "Barbora Malá",
      email: "barbora.mala@company.cz",
      role: "HR administrátor",
    },
    {
      id: "c3",
      name: "Cyril Havel",
      email: "cyril.havel@company.cz",
      role: "Liniový manažer",
    },
    {
      id: "c4",
      name: "Dana Veselá",
      email: "dana.vesela@company.cz",
      role: "Recruiter",
    },
    {
      id: "c5",
      name: "Emil Novotný",
      email: "emil.novotny@company.cz",
      role: "Liniový manažer",
    },
    // Add more colleagues to simulate a larger list
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `c${i + 6}`,
      name: `Kolega ${i + 1}`,
      email: `kolega${i + 1}@company.cz`,
      role: ["Recruiter", "HR administrátor", "Liniový manažer"][i % 3] as UserRole,
    })),
  ]

  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.role) {
      const member: TeamMember = {
        id: Math.random().toString(36).substr(2, 9),
        name: newMember.name,
        email: newMember.email,
        role: newMember.role as UserRole,
      }

      const updatedMembers = [...teamMembers, member]
      setTeamMembers(updatedMembers)
      onChange?.(updatedMembers)
      setNewMember({ role: "Recruiter" })
      setIsDialogOpen(false)
    }
  }

  const filteredColleagues = companyColleagues.filter(
    (colleague) =>
      colleague.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      colleague.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      colleague.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddColleague = (colleague: TeamMember) => {
    if (!teamMembers.some((member) => member.id === colleague.id)) {
      const updatedMembers = [...teamMembers, colleague]
      setTeamMembers(updatedMembers)
      onChange?.(updatedMembers)
    }
    setIsColleaguesDialogOpen(false)
  }

  // Funkce pro získání iniciál z celého jména
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
  }

  return (
    <>
      <Card className="overflow-hidden border border-gray-200 p-3 gap-3 flex flex-col bg-transparent shadow-none">

        <CardContent className="p-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              {avatar ? (
                <AvatarImage src={avatar} alt={fullname} />
              ) : (
                <AvatarFallback className="bg-gray-200">{getInitials(fullname)}</AvatarFallback>
              )}
            </Avatar>
            <div className="w-full">
              <p className="font-medium text-sm w-full">{fullname}</p>
              <p className="text-xs text-muted-foreground">{role}</p>
            </div>
            <Button 
            variant="ghost" 
            className="w-full p-3 m-0 font-normal max-w-fit" 
            onClick={() => setIsColleaguesDialogOpen(true)}
          >
            <UserPlus className="w-3" />
          </Button>
          </div>
          
          {teamMembers.length > 1 && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-xs text-muted-foreground">{teamMembers.length - 1} dalších</p>
              {/* <div className="flex flex-wrap">
                {teamMembers.slice(1).map((member) => (
                  <div key={member.id} className="flex items-center gap-2 py-2 rounded-md bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div> */}
            </div>
          )}
        </CardContent>

      </Card>

      {/* Dialog pro výběr kolegů */}
      <Dialog open={isColleaguesDialogOpen} onOpenChange={setIsColleaguesDialogOpen}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Vybrat kolegu</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Vyhledat kolegu podle jména, emailu nebo role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground mb-4">{filteredColleagues.length} uživatelů</p>
            <div className="max-h-[400px] overflow-y-auto border rounded-md">
              {filteredColleagues.length > 0 ? (
                <div className="divide-y">
                  {filteredColleagues.map((colleague) => (
                    <div
                      key={colleague.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleAddColleague(colleague)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {getInitials(colleague.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{colleague.name}</p>
                          <p className="text-sm text-muted-foreground">{colleague.email}</p>
                        </div>
                      </div>
                      <span className="text-sm">{colleague.role}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground mb-4">Žádní kolegové nenalezeni</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsColleaguesDialogOpen(false)
                      setIsDialogOpen(true)
                    }}
                  >
                    Přidat nového kolegu
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pro přidání nového kolegy */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Přidat nového kolegu do náboru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Jméno a příjmení</Label>
              <Input
                id="name"
                value={newMember.name || ""}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newMember.email || ""}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newMember.role}
                onValueChange={(value) => setNewMember({ ...newMember, role: value as UserRole })}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Vyberte roli" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recruiter">Recruiter</SelectItem>
                  <SelectItem value="Liniový manažer">Liniový manažer</SelectItem>
                  <SelectItem value="HR administrátor">HR administrátor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Zrušit
            </Button>
            <Button onClick={handleAddMember}>Přidat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 