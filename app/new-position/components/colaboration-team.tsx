"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus } from "lucide-react"

type UserRole = "HR administrátor" | "Recruiter" | "Liniový manažer"

interface TeamMember {
  id: string
  name: string
  email: string
  role: UserRole
  isOwner?: boolean
}

interface ColaborationTeamProps {
  onChange?: (members: TeamMember[]) => void
}

export function ColaborationTeam({ onChange }: ColaborationTeamProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    role: "Recruiter",
  })

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Jan Novák",
      email: "jan.novak@company.cz",
      role: "HR administrátor",
      isOwner: true,
    },
    {
      id: "2",
      name: "Petra Svobodová",
      email: "petra.svobodova@company.cz",
      role: "Recruiter",
    },
    {
      id: "3",
      name: "Martin Dvořák",
      email: "martin.dvorak@company.cz",
      role: "Recruiter",
    },
    {
      id: "4",
      name: "Lucie Nováková",
      email: "lucie.novakova@company.cz",
      role: "Recruiter",
    },
    {
      id: "5",
      name: "Tomáš Procházka",
      email: "tomas.prochazka@company.cz",
      role: "Recruiter",
    },
    {
      id: "6",
      name: "Kateřina Veselá",
      email: "katerina.vesela@company.cz",
      role: "Recruiter",
    },
  ])

  const [isColleaguesDialogOpen, setIsColleaguesDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
    ...Array.from({ length: 15 }, (_, i) => ({
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

  const handleRemoveMember = (id: string) => {
    const updatedMembers = teamMembers.filter((member) => !member.isOwner && member.id !== id)
    setTeamMembers(updatedMembers)
    onChange?.(updatedMembers)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tým spolupracovníků</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border">
          <div className="divide-y">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm">{member.role}</span>
                  {member.isOwner ? (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Vlastník</span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Odebrat
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Dialog open={isColleaguesDialogOpen} onOpenChange={setIsColleaguesDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Přidat kolegu do náboru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
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
                              {colleague.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")}
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

        {/* Add the manual entry dialog separately */}
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
      </CardContent>
    </Card>
  )
}

