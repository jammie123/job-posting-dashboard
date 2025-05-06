import type { ReactNode } from "react"

export interface Product {
  id: string
  name: string
  description: string
  type: "highlight" | "top" 
  prize: string
  status: "active" | "inactive"
  dateValidFrom: string
  dateValidTo: string
  namePortal: string
  logoPortal: string
}

export const mockProducts: Product[] = [
  {
    id: "p001",
    name: "Zvýraznění inzerátu na Práce za rohem",
    type: "highlight",
    description: "Inzerát bude zvýrazněn po dobu 14 dní v relevantních výsledcích hledání v mobilní aplikaci Práce za rohem. Získáte tak vyšší návštěvnost inzerátu.",
    prize: "1 500 Kč",
    status: "active",
    dateValidFrom: "2024-04-01",
    dateValidTo: "2024-04-15",
    namePortal: "prace za rohem",
    logoPortal: "PraceZaRohemIcon"
  },
  {
    id: "p002",
    name: "SUPERMAX",
    type: "highlight",
    description: "Inzerát bude 3 dny na prvních místech ve výsledcích vyhledávání na Prace.cz. Získáte od uchazečů až o 64 % více reakcí proti inzerátu bez zvýraznění.",
    prize: "3 200 Kč",
    status: "active",
    dateValidFrom: "2024-04-02",
    dateValidTo: "2024-04-05",
    namePortal: "prace.cz",
    logoPortal: "PraceIcon"
  },
  {
    id: "p003",
    name: "JobTips",
    type: "highlight",
    description: "Inzerát bude 3 dny umístěn na prvních místech v relevantních výsledcích hledání na Jobs.cz. Získáte tak až o 120 % vyšší návštěvnost inzerátu.",
    prize: "4 500 Kč",
    status: "active",
    dateValidFrom: "2024-04-03",
    dateValidTo: "2024-04-06",
    namePortal: "jobs.cz",
    logoPortal: "JobsIcon"
  },
  {
    id: "p004",
    name: "Jednorázové topování (aktualizace) inzerátu",
    type: "top",
    description: "Váš inzerát vyskočí na horní pozici v příslušných výsledcích hledání na Jobs.cz. Na horní pozici pak zůstane, dokud nepřibudou novější inzeráty. Můžete tak získat až o 120 % shlédnutí víc.",
    prize: "4 500 Kč",
    status: "active",
    dateValidFrom: "2024-04-03",
    dateValidTo: "2024-04-03",
    namePortal: "jobs.cz",
    logoPortal: "JobsIcon"
  },
  {
    id: "p005",
    name: "Jednorázové topování (aktualizace) inzerátu na Prace.cz",
    type: "top",
    description: "Váš inzerát vyskočí na horní pozici v příslušných výsledcích hledání na Prace.cz. Na horní pozici pak zůstane, dokud nepřibudou novější inzeráty. Můžete tak získat až o 120 % shlédnutí víc.",
    prize: "4 500 Kč",
    status: "active",
    dateValidFrom: "2024-04-03",
    dateValidTo: "2024-04-06",
    namePortal: "prace.cz",
    logoPortal: "PraceIcon"
  }
]