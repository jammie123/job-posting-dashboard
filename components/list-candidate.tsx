"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  FileText,
  MoreHorizontal,
  Search,
  Tag,
  ThumbsDown,
  ThumbsUp,
  Eye,
} from "lucide-react"
import { format } from "date-fns"
import { cs } from "date-fns/locale"

// Define the candidate data structure
export interface Candidate {
  id?: string
  fullname: string
  phone: string
  stage: string
  "date-application": string
  "date-last-contacts": string
  evaluation: "Up" | "Down" | null
  attachments: string[]
  notes: string
  source: string
  tags: string[]
  "date-of-interview": string | null
}

interface ListCandidateProps {
  candidates?: Candidate[]
}

export function ListCandidate({ candidates = [] }: ListCandidateProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof Candidate; direction: "asc" | "desc" } | null>(null)

  // Filter states
  const [stageFilter, setStageFilter] = useState<string>("")
  const [evaluationFilter, setEvaluationFilter] = useState<string>("")
  const [sourceFilters, setSourceFilters] = useState<string[]>([])
  const [tagFilters, setTagFilters] = useState<string[]>([])
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false)

  // Generate IDs for candidates if they don't have one
  const candidatesWithIds = useMemo(() => {
    return candidates.map((candidate, index) => ({
      ...candidate,
      id: candidate.id || `candidate-${index}`,
    }))
  }, [candidates])

  // Get unique values for filters
  const uniqueStages = useMemo(() => {
    return Array.from(new Set(candidatesWithIds.map((c) => c.stage)))
  }, [candidatesWithIds])

  const uniqueSources = useMemo(() => {
    return Array.from(new Set(candidatesWithIds.map((c) => c.source)))
  }, [candidatesWithIds])

  const uniqueTags = useMemo(() => {
    const allTags = candidatesWithIds.flatMap((c) => c.tags)
    return Array.from(new Set(allTags))
  }, [candidatesWithIds])

  // Filter candidates based on all filters
  const filteredCandidates = useMemo(() => {
    return candidatesWithIds.filter((candidate) => {
      // Text search filter
      const matchesSearch =
        !searchQuery.trim() ||
        candidate.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.stage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Stage filter
      const matchesStage = !stageFilter || candidate.stage === stageFilter

      // Evaluation filter
      const matchesEvaluation =
        !evaluationFilter ||
        (evaluationFilter === "Up" && candidate.evaluation === "Up") ||
        (evaluationFilter === "Down" && candidate.evaluation === "Down") ||
        (evaluationFilter === "None" && candidate.evaluation === null)

      // Source filter
      const matchesSource = sourceFilters.length === 0 || sourceFilters.includes(candidate.source)

      // Tags filter (candidate must have at least one of the selected tags)
      const matchesTags = tagFilters.length === 0 || candidate.tags.some((tag) => tagFilters.includes(tag))

      return matchesSearch && matchesStage && matchesEvaluation && matchesSource && matchesTags
    })
  }, [candidatesWithIds, searchQuery, stageFilter, evaluationFilter, sourceFilters, tagFilters])

  // Sort candidates
  const sortedCandidates = useMemo(() => {
    if (!sortConfig) return filteredCandidates

    return [...filteredCandidates].sort((a, b) => {
      if (a[sortConfig.key] === null) return sortConfig.direction === "asc" ? -1 : 1
      if (b[sortConfig.key] === null) return sortConfig.direction === "asc" ? 1 : -1

      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
  }, [filteredCandidates, sortConfig])

  // Handle sorting
  const requestSort = (key: keyof Candidate) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Handle checkbox selection
  const toggleSelectAll = () => {
    if (selectedCandidates.length === sortedCandidates.length) {
      setSelectedCandidates([])
    } else {
      setSelectedCandidates(sortedCandidates.map((c) => c.id!))
    }
  }

  const toggleSelectCandidate = (id: string) => {
    if (selectedCandidates.includes(id)) {
      setSelectedCandidates(selectedCandidates.filter((cId) => cId !== id))
    } else {
      setSelectedCandidates([...selectedCandidates, id])
    }
  }

  // Toggle source filter
  const toggleSourceFilter = (source: string) => {
    setSourceFilters((prev) => (prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]))
  }

  // Toggle tag filter without closing dropdown
  const toggleTagFilter = (tag: string, e?: React.MouseEvent) => {
    // Prevent the dropdown from closing
    e?.preventDefault()

    setTagFilters((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Toggle all tags without closing dropdown
  const toggleAllTags = (e?: React.MouseEvent) => {
    // Prevent the dropdown from closing
    e?.preventDefault()

    if (tagFilters.length === uniqueTags.length) {
      setTagFilters([])
    } else {
      setTagFilters([...uniqueTags])
    }
  }

  // Clear tag selection without closing dropdown
  const clearTagSelection = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setTagFilters([])
  }

  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    try {
      return format(new Date(dateString), "d. MMM yyyy", { locale: cs })
    } catch (error) {
      return dateString
    }
  }

  // Get stage color
  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "předvybraný":
        return "bg-blue-100 text-blue-800"
      case "pozvaný":
        return "bg-purple-100 text-purple-800"
      case "neposouzený":
        return "bg-gray-100 text-gray-800"
      case "zamítnutá":
      case "zamítnutý":
        return "bg-red-100 text-red-800"
      case "přijatý":
      case "přijatá":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
  }

  // Reset all filters
  const resetFilters = () => {
    setStageFilter("")
    setEvaluationFilter("")
    setSourceFilters([])
    setTagFilters([])
    setSearchQuery("")
  }

  // Check if any filters are active
  const hasActiveFilters =
    stageFilter || evaluationFilter || sourceFilters.length > 0 || tagFilters.length > 0 || searchQuery

  // Custom checkbox component that doesn't close the dropdown
  const CustomCheckbox = ({
    checked,
    onChange,
    children,
  }: { checked: boolean; onChange: (e: React.MouseEvent) => void; children: React.ReactNode }) => {
    return (
      <div
        className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-muted/50 rounded-sm"
        onClick={onChange}
      >
        <div className="flex items-center justify-center h-4 w-4 mr-2 rounded-sm border border-primary">
          {checked && <Check className="h-3 w-3 text-primary" />}
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Hledat kandidáty..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Stav kandidáta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny stavy</SelectItem>
                {uniqueStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={evaluationFilter} onValueChange={setEvaluationFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Hodnocení" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechna hodnocení</SelectItem>
                <SelectItem value="Up">Pozitivní</SelectItem>
                <SelectItem value="Down">Negativní</SelectItem>
                <SelectItem value="None">Bez hodnocení</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[160px] justify-between">
                  <span className="truncate">
                    {sourceFilters.length === 0
                      ? "Zdroj"
                      : sourceFilters.length === 1
                        ? sourceFilters[0]
                        : `${sourceFilters.length} zdrojů`}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[180px]">
                <DropdownMenuLabel>Zdroje</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {uniqueSources.map((source) => (
                  <DropdownMenuCheckboxItem
                    key={source}
                    checked={sourceFilters.includes(source)}
                    onCheckedChange={() => toggleSourceFilter(source)}
                  >
                    {source}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu open={tagDropdownOpen} onOpenChange={setTagDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[160px] justify-between" aria-expanded={tagDropdownOpen}>
                  <div className="flex items-center gap-1 truncate">
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    {tagFilters.length === 0
                      ? "Štítky"
                      : tagFilters.length === 1
                        ? tagFilters[0]
                        : `${tagFilters.length} štítků`}
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[220px]" onCloseAutoFocus={(e) => e.preventDefault()}>
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Štítky</span>
                  <span className="text-xs text-muted-foreground">
                    {tagFilters.length} z {uniqueTags.length} vybráno
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[200px] overflow-y-auto py-1">
                  <CustomCheckbox
                    checked={tagFilters.length === uniqueTags.length && uniqueTags.length > 0}
                    onChange={toggleAllTags}
                  >
                    <span className="font-medium">Vybrat vše</span>
                  </CustomCheckbox>
                  <DropdownMenuSeparator />
                  {uniqueTags.map((tag) => (
                    <CustomCheckbox
                      key={tag}
                      checked={tagFilters.includes(tag)}
                      onChange={(e) => toggleTagFilter(tag, e)}
                    >
                      <div className="flex items-center w-full">
                        <Tag className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{tag}</span>
                      </div>
                    </CustomCheckbox>
                  ))}
                </div>
                {tagFilters.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button variant="outline" size="sm" className="w-full text-xs" onClick={clearTagSelection}>
                        Vymazat výběr
                      </Button>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Resetovat
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Zobrazit informace
            </Button>
            {selectedCandidates.length > 0 && (
              <Button variant="outline" size="sm">
                Hromadná akce ({selectedCandidates.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] sticky left-0 bg-white z-10">
                <Checkbox
                  checked={selectedCandidates.length === sortedCandidates.length && sortedCandidates.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all candidates"
                />
              </TableHead>
              <TableHead className="w-[70px] sticky left-[40px] bg-white z-10"></TableHead>
              <TableHead className="min-w-[180px] sticky left-[110px] bg-white z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-4 after:shadow-[inset_-12px_0_8px_-16px_rgba(0,0,0,0.2)] after:pointer-events-none">
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("fullname")}>
                  Jméno kandidáta
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Přílohy</TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("stage")}>
                  Stav
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("date-application")}>
                  Datum přihlášení
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="min-w-[180px]">
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("date-last-contacts")}>
                  Poslední kontakt
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("date-of-interview")}>
                  Datum pohovoru
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("evaluation")}>
                  Hodnocení
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("source")}>
                  Zdroj
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Tagy</TableHead>
              <TableHead>Poznámky</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center sticky left-0 bg-white">
                  Žádní kandidáti nebyli nalezeni.
                </TableCell>
              </TableRow>
            ) : (
              sortedCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="sticky left-0 bg-white z-10">
                    <Checkbox
                      checked={selectedCandidates.includes(candidate.id!)}
                      onCheckedChange={() => toggleSelectCandidate(candidate.id!)}
                      aria-label={`Select ${candidate.fullname}`}
                    />
                  </TableCell>
                  <TableCell className="sticky left-[40px] bg-white z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Otevřít menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Zobrazit profil</DropdownMenuItem>
                        <DropdownMenuItem>Upravit</DropdownMenuItem>
                        <DropdownMenuItem>Změnit stav</DropdownMenuItem>
                        <DropdownMenuItem>Přidat poznámku</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="font-medium sticky left-[110px] bg-white z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-4 after:shadow-[inset_-12px_0_8px_-16px_rgba(0,0,0,0.2)] after:pointer-events-none">
                    {candidate.fullname}
                  </TableCell>
                  <TableCell>
                    {candidate.attachments.length > 0 ? (
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>{candidate.attachments.length}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(candidate.stage)}`}>
                      {candidate.stage}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(candidate["date-application"])}</TableCell>
                  <TableCell>{formatDate(candidate["date-last-contacts"])}</TableCell>
                  <TableCell>{formatDate(candidate["date-of-interview"])}</TableCell>
                  <TableCell>
                    {candidate.evaluation === "Up" ? (
                      <ThumbsUp className="h-5 w-5 text-green-600" />
                    ) : candidate.evaluation === "Down" ? (
                      <ThumbsDown className="h-5 w-5 text-red-600" />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{candidate.source}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {candidate.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {candidate.notes ? (
                      <div className="flex gap-2 items-center">
                        <Avatar className="h-6 w-6 mt-0.5">
                          <AvatarFallback className="text-xs font-medium uppercase">
                            {getInitials(candidate.fullname)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground truncate max-w-[240px]">{candidate.notes}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

