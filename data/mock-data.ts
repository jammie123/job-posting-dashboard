export interface MarketplaceItem {
  title: string
  perex: string
  description: string
  validFrom?: string
  validTo?: string
  howToUse?: string
  upgrade?: string
  progress?: string
  package?: boolean
  features?: MarketplaceItem[]
  prize?: string
  category?: string
  icon?: string
}

export interface MarketplaceCategory {
  title: string
  items: MarketplaceItem[]
  category?: string
}

export const marketplaceCategories: MarketplaceCategory[] = [

  {
    title: "Nástup uchazeče",
    items: [
      {
        title: "Preboarding",
        perex: "Pomáhá připravit vše potřebné pro hladký nástup nového zaměstnance.",
        description:
          "Zjednodušte proces adaptace nových zaměstnanců a zajistěte, že se od prvního dne budou cítit vítáni a informováni. Perfektní start pro dlouhodobé profesionální vztahy.",
        validFrom: "22.10.2024",
        validTo: "22.10.2026",
        howToUse:
          "Jednoduše přesunete kandidáta do Preboardingu např. ze stavu hired a můžete si nastavit checklist úkolů, co se musí vyřídit do dne nástupu - papíry od doktora, vyplněná smlouva, kartička zaměstnance při dne nástupu a případně telefon nebo počítač. Seznam úkolů je sdílený se všemi zůčastněnými lidmi, který jsou zodpovědný za daný úkol.",
      },
      {
        title: "Arnold",
        perex: "Nástroj pro sběr zpětné vazby od kandidátů, ale i vašich zaměstnanců.",
        description:
          "Získejte cenné názory a zlepšete své HR procesy s Arnoldem, který vám umožní posílit vztahy s kandidáty a zaměstnanci prostřednictvím konstruktivní zpětné vazby.",
      },
    ],
  },
  {
    title: "Propagace a branding",
    items: [
      {
        title: "Kariérní stránky",
        perex: "Vytvořte personalizované stránky a přilákejte nové talenty.",
        description:
          "Prezentujte svou firmu v nejlepším světle a přitáhněte top talent s atraktivními, na míru vytvořenými kariérními stránkami, které odrážejí vaši firemní kulturu.",
      },
      {
        title: "Design zpráv",
        perex: "Všechny zprávy kandidátům v designu Vaší značky.",
        description:
          "Zajistěte konzistentní a profesionální komunikaci s potenciálními zaměstnanci s pomocí šablon, které reflektují vizuální identitu vaší společnosti.",
      },
      {
        title: "Firemní profil na Jobs.cz a Prace.cz",
        perex: "Zveřejněte své firemní profil na Jobs.cz a Prace.cz a oslovte více kandidátů.",
        description:
          "",
      },
    ],
  },
  {
    title: "Nábor a zpracování kandidátů",
    items: [
      {
        title: "Počet účtů v Teamiu",
        perex: "Správa předplacených uživatelských účtů",
        description: "Spravujte předplacené uživatelské účty pro váš tým.",
        validFrom: "26.11.2024",
        validTo: "26.11.2026",
        progress: "38/50 uživatelů",
      },

      {
        title: "LinkedIn plugin",
        perex: "Snadný import kandidátů z LinkedIn přímo do Teamia.",
        description:
          "Zefektivněte nábor tím, že využijete náš plugin pro přímý import profilů z LinkedIn, což vám umožní rychle oslovit kvalifikované kandidáty.",
      },
      {
        title: "Nový referral",
        perex: "Dopřejte si nový referral program pro vaše zaměstnance.",
        description:
          "",
      },
      {
        title: "Náborový proces na míru",
        perex: "Přizpůsobte si postup náboru pro každou pozici individuálně.",
        description:
          "Optimalizujte svůj nábor s flexibilními procesy, které lze přizpůsobit specifickým potřebám a požadavkům každé pozice.",
      },
      {
        title: "Dokup uživatelů",
        perex: "Přidejte další uživatele a zapojte celý tým do náboru.",
        description:
          "Rozšíření týmu o další členy umožní efektivnější a rychlejší nábor, což zvýší vaše šance na úspěch ve vyhledávání talentů.",
      },

      {
        title: "Dotazníky se zamítnutím",
        perex: "Usnadněte si selekci kandidátů podle klíčových kritérií.",
        description:
          "Streamline your candidate selection process by quickly identifying the right fits with our advanced screening tools.",
        validFrom: "21.3.2024",
        validTo: "21.3.2030",
      },
      {
        title: "Přístup k modulu Konta kreditů",
        perex: "Správa kreditů pro inzerci a další služby.",
        description: "Efektivně spravujte kredity pro různé služby a inzerci v rámci platformy.",
        validFrom: "19.7.2023",
        validTo: "19.7.2029",
      },
      {
        title: "Export reakcí uchazečů (API)",
        perex: "Automatický export dat o uchazečích",
        description: "Exportujte data o uchazečích pomocí API pro další zpracování ve vašich systémech.",
        validFrom: "7.7.2022",
        validTo: "8.7.2030",
      },
      {
        title: "Teamio přídavná role Náborář",
        perex: "Rozšíření pro náborové specialisty.",
        description: "Speciální role s rozšířenými možnostmi pro náborové specialisty ve vašem týmu.",
        validFrom: "13.12.2022",
        validTo: "13.12.2030",
      },
      {
        title: "Talent pools",
        perex: "Vytváření a správa talentových poolů.",
        description: "Organizujte a udržujte kontakt s talentovanými kandidáty pro budoucí příležitosti.",
        validFrom: "30.8.2022",
        validTo: "30.8.2026",
      },
      {
        title: "Náborový tým",
        perex: "Nástroje pro efektivní spolupráci náborového týmu.",
        description:
          "Zlepšete koordinaci a spolupráci v rámci náborového týmu s pokročilými nástroji pro týmovou práci.",
        validFrom: "25.1.2022",
        validTo: "8.7.2030",
      },
      {
        title: "Statistiky na míru",
        perex: "Analýza a vizulizace dat o uchazečích a jejich reakcích přesně na míru.",
        description:
          ""
      },
      {
        title: "Teamio školení a konfigurace",
        perex: "Zjištěte veškeré finty Teamia a jak je používat.",
        description:
          ""
      },
    ],
  },

  {
    title: "Teamio",
    items: [
      {
        title: "Teamio Profesinal",
        package: true,
        perex: "Kompletní balíček profesionálních nástrojů pro nábor.",
        description: "Získejte přístup ke všem pokročilým funkcím a nástrojům pro efektivní nábor.",
        validFrom: "20.12.2024",
        validTo: "20.12.2040",
        features: [
          {
            title: "Mobilní aplikace",
            perex: "Identifikace hovorů od uchazečů a jejich CVček odkudkoliv.",
            description:
              "Buďte v kontaktu s kandidáty i na cestách díky naší mobilní aplikaci, která umožňuje snadnou identifikaci a správu hovorů a dokumentů.",
            upgrade:
              "Tato funkce je součástí vyššího balíčku Teamio Enterprice. V případě, že přejdete na vyšší balíček, funkcionalitu spolu s dalšími budete mít zadarmo.",
          },
          {
            title: "Náborový proces na míru",
            perex: "Přizpůsobte si postup náboru pro každou pozici individuálně.",
            description:
              "Optimalizujte svůj nábor s flexibilními procesy, které lze přizpůsobit specifickým potřebám a požadavkům každé pozice.",
          },
          {
            title: "LinkedIn plugin",
            perex: "Snadný import kandidátů z LinkedIn přímo do Teamia.",
            description:
              "Zefektivněte nábor tím, že využijete náš plugin pro přímý import profilů z LinkedIn, což vám umožní rychle oslovit kvalifikované kandidáty.",
          },
          {
            title: "Custom Role",
            perex: "Flexibilita v definování rolí a oprávnění.",
            description:
              "Vytvořte vlastní role s specifickými oprávněními, které odpovídají unikátním potřebám vašeho týmu a procesů.",
          },
        ],
      },
    ],
  },
  {
    title: "Zabezpečení",
    items: [
      {
        title: "SSO",
        perex: "Jednoduché a bezpečné přihlášení pro všechny vaše aplikace.",
        description:
          "Zvyšte bezpečnost a efektivitu vašeho náborového týmu integrací SSO, která umožní bezpečný a rychlý přístup k vašim systémům s jedinými přihlašovacími údaji.",
        validFrom: "23.12.2024",
        validTo: "28.11.2025",
      },
    ],
  },
  {
    title: "Inzerce a kredity",
    category: "Jednorázová inzerce",
    items: [
      {
        title: "Inzerát na Jobs.cz - LIGHT",
        perex: "Každý inzerát je vystaven na 30 dní",
        description: "Inzerát na 30 dní bez automatického přesunutí na začátek výpisu.",
        prize: "6 900 Kč",
        icon: "jobs"
      },
      {
        title: "Inzerát na Jobs.cz - STANDARD",
        perex: "Každý inzerát je vystaven na 30 dní",
        description: "Inzerát na 30 dní. Každý týden přesuneme váš inzerát na začátek výpisu vyhledávaných pozic.",
        prize: "8 400 Kč",
        icon: "jobs"
      },
      {
        title: "Inzerát na Prace.cz - Mini",
        perex: "Každý inzerát je vystaven na 10 dní",
        description: "",
        prize: "2 990 Kč",
        icon: "prace"
      },
      {
        title: "Inzerát na Prace.cz - STANDARD",
        perex: "Každý inzerát je vystaven na 30 dní",
        description: "Inzerát na 30 dní. Každý týden přesuneme váš inzerát na začátek výpisu vyhledávaných pozic.",
        prize: "4 500 Kč",
        icon: "prace"
      },
      {
        title: "Inzerát na Práce za rohem",
        perex: "Každý inzerát je vystaven na 30 dní",
        description: "Inzerát na 30 dní. Oslovení kandidátů hledající práci v blízkém okolí přímo do jejich mobilů.",
        prize: "3 900 Kč",
        icon: "career"
      },
      {
        title: "Inzerát na Atmoskop.cz",
        perex: "Každý inzerát je vystaven na 30 dní",
        description: "",
        prize: "3 500 Kč",
        icon: "intranet"
      },
    ],
  },
  {
    title: "Inzerce a kredity",
    category: "Brigády",
    items: [
      {
        title: "Brigáda na Jobs.cz, Prace.cz a Práce za rohem",
        perex: "Každý inzerát je vystaven na 10 dní",
        description: "",
        prize: "490 Kč",
        icon: "jobs"
      },
      {
        title: "Balíček 3 brigád na Jobs.cz, Prace.cz a Práce za rohem",
        perex: "Každý inzerát je vystaven na 10 dní",
        description: "Balíček je možné vyčerpat do 1 roku",
        prize: "1 350 Kč",
        icon: "jobs"
      },
    ],
  },
  {
    title: "Inzerce a kredity",
    category: "Balíčky inzerátů",
    items: [

      {
        title: "Balíček 3 inzerátů na Jobs.cz - STANDARD s čerpáním 3 měsíce",
        perex: "Každý inzerát je vystaven na 30 dní",
        description: "Balíček je možné vyčerpat do 1 roku",
        prize: "17 900 Kč",
        icon: "jobs"
      },
      {
        title: "Balíček 3 inzerátů na Jobs.cz - STANDARD testovaci",
        perex: "Každý inzerát je vystaven na 30 dní",
        description: "Balíček je možné vyčerpat do 1 roku",
        prize: "22 900 Kč",
        icon: "jobs"
      },
      {
        title: "Balíček 3 inzerátů na Prace.cz - STANDARD s čerpáním 3 měsíce",
        perex: "Každý inzerát je vystaven na 30 dní",
        description: "Balíček je možné vyčerpat do 1 roku",
        prize: "9 500 Kč",
        icon: "prace"
      },
      {
        title: "Balíček 3 inzerátů na Prace.cz - STANDARD",
        perex: "Každý inzerát je vystaven na 30 dní",
        description: "Balíček je možné vyčerpat do 1 roku",
        prize: "11 000 Kč",
        icon: "prace"
      },
      {
        title: "Balíček 5 inzerátů na Prace.cz - STANDARD",
        perex: "Každý inzerát je vystaven na 30 dní",
        description: "Balíček je možné vyčerpat do 1 roku",
        prize: "16 700 Kč",
        icon: "prace"
      },
      {
        title: "Balíček 3 inzerátů na Práce za rohem - s čerpáním 3 měsíce",
        perex: "Každý inzerát je vystaven na 30 dní",
        description: "Balíček je možné vyčerpat do 1 roku",
        prize: "8 300 Kč",
        icon: "career"
      },
      {
        title: "Balíček 3 inzerátů na Práce za rohem",
        perex: "Každý inzerát je vystaven na 30 dní",
        description: "Vystavení 3 inzerátů na 30 dní během 1 roku přímo do mobilní aplikace. Balíček je možné vyčerpat do 1 roku",
        prize: "10 400 Kč",
        icon: "career"
      }
    ],
  },
  {
    title: "Inzerce a kredity",
    category: "Kombi balíčky",
    items: [
      {
        title: "KOMBI 5 - Balíček inzerátů na Jobs.cz, Prace.cz a Práce za rohem",
        perex: "Předplatné 5 inzerátů na Jobs.cz nebo 10 inzerátů na Prace.cz nebo 10 inzerátů na Práce za rohem nebo 10 inzerátů na Atmoskop.cz",
        description: "Vystavujte jen na jednom portálu nebo kombinujte inzerci podle potřeby Každý inzerát je vystaven na 30 dní, přičemž na Jobs.cz a Prace.cz se 1× týdně přesune na začátek výpisu pozic Balíček je možné vyčerpat do 1 roku",
        prize: "32 500 Kč",
        icon: "jobs"
      },
      {
        title: "KOMBI 10 - Balíček inzerátů na Jobs.cz, Prace.cz a Práce za rohem",
        perex: "Předplatné 10 inzerátů na Jobs.cz nebo 20 inzerátů na Prace.cz nebo 20 inzerátů na Práce za rohem nebo 20 inzerátů na Atmoskop.cz",
        description: "Vystavujte jen na jednom portálu nebo kombinujte inzerci podle potřeby Každý inzerát je vystaven na 30 dní, přičemž na Jobs.cz a Prace.cz se 1× týdně přesune na začátek výpisu pozic Balíček je možné vyčerpat do 1 roku",
        prize: "53 500 Kč",
        icon: "jobs"
      },
      {
        title: "KOMBI 20 - Balíček inzerátů na Jobs.cz, Prace.cz a Práce za rohem",
        perex: "Předplatné 20 inzerátů na Jobs.cz nebo 40 inzerátů na Prace.cz nebo 40 inzerátů na Práce za rohem nebo 40 inzerátů na Atmoskop.cz",
        description: "Vystavujte jen na jednom portálu nebo kombinujte inzerci podle potřeby Každý inzerát je vystaven na 30 dní, přičemž na Jobs.cz a Prace.cz se 1× týdně přesune na začátek výpisu pozic Balíček je možné vyčerpat do 1 roku",
        prize: "85 000 Kč",
        icon: "jobs"
      },

      {
        title: "KOMBI 5 + Teamio PRO 20",
        perex: "Předplatné 5 inzerátů na Jobs.cz nebo 10 inzerátů na Prace.cz nebo 10 inzerátů na Práce za rohem nebo 10 inzerátů na Atmoskop.cz + placená edice Teamio KOMBI",
        description: "Každý inzerát je vystaven na 30 dní, přičemž na Jobs.cz a Prace.cz se 1× týdně přesune na začátek výpisu pozic Balíček inzerátů KOMBI je možné vyčerpat do 1 roku Platnost služby Teamio KOMBI je 14 měsíců. Po vyčerpání posledního inzerátu ze zakoupeného balíčku se platnost služby Teamio KOMBI zkracuje na 62 dní.",
        prize: "37 250 Kč",
        icon: "jobs"
      },
      {
        title: "KOMBI 10 + Teamio PRO 20",
        perex: "Předplatné 10 inzerátů na Jobs.cz nebo 20 inzerátů na Prace.cz nebo 20 inzerátů na Práce za rohem nebo 20 inzerátů na Atmoskop.cz + placená edice Teamio KOMBI",
        description: "Každý inzerát je vystaven na 30 dní, přičemž na Jobs.cz a Prace.cz se 1× týdně přesune na začátek výpisu pozic Balíček inzerátů KOMBI je možné vyčerpat do 1 roku Platnost služby Teamio KOMBI je 14 měsíců. Po vyčerpání posledního inzerátu ze zakoupeného balíčku se platnost služby Teamio KOMBI zkracuje na 62 dní.",
        prize: "63 000 Kč",
        icon: "jobs"
      }
    ],
  },


]


