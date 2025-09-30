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
  externalLink?: boolean
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
        title: "Preboarding zaměstnanců ",
        perex: "Připravte nového zaměstnance na nástup ve vaší firmě. ",
        description:
          "Mezi přijetím nového zaměstnance a jeho nástupem je období, které můžete využít na posilnění zaměstnanecké zkušenosti. Díky Preboardingu zaměstnanců můžete udržovat kontakt s novým zaměstnancem a máte celý nástupní proces pod kontrolou.",
        validFrom: "22.10.2024",
        validTo: "22.10.2026",
        howToUse:
          "Jednoduše přesunete kandidáta do Preboardingu např. ze stavu hired a můžete si nastavit checklist úkolů, co se musí vyřídit do dne nástupu - papíry od doktora, vyplněná smlouva, kartička zaměstnance při dne nástupu a případně telefon nebo počítač. Seznam úkolů je sdílený se všemi zůčastněnými lidmi, který jsou zodpovědný za daný úkol.",
      },
      {
        title: "Onboarding zaměstnanců s Arnoldem ",
        perex: "Zlepšete zkušenost nováčků ve firmě a odhalte potenciální problémy včas. ",
        description:
          "S Onboardingem od Arnolda sledujete první měsíce nováčka v nové firmě poté, co kliknete v Teamiu na tlačítko „Nástup“. Díky sérii krátkých, dynamických konverzací získáte informace o tom, jaký měl nováček první den v práci, jak se seznamuje s novou rolí a jak se mu spolupracuje s kolegy. Díky Onboardingu tak nejenom zlepšujete zážitek kandidáta z nástupu, ale můžete včas odhalit i potenciální problémy. A to vše automatizovaně, přímo z Teamia. ",
      },
    ],
  },
  {
    title: "Propagace a branding",
    items: [
      {
        title: "Kariérní stránky",
        perex: "Jednoduché a hezké stránky s výpisem pozic, které si vytvoříte na pár kliknutí. ",
        description:
          "Vytvoření jednoduchých kariérních stránek přímo v Teamiu. Nastavíte si je sami, bez potřeby pomoci IT specialistů. Do přednastavené šablony nahrajete logo, obrázky a texty a vaše kariérní stránky s aktuálními nabídkami jsou na světě. ",       
      },
      {
        title: "Kariérní stránky Standard ",
        perex: "Nechte si vytvořit kariérní stránky na doméně Jobs.cz podle vašeho dizajnu. ",
        description:
          "Kariérní stránky jsou výkladní skříní vaši společnosti. Chcete-li něco speciálního, připravíme vám kariérní stránky podle vašeho dizajnu. Atraktivní grafické prvky, video, nebo filtrovaní jen mezi vašimi nabídkami, to vše je s Kariérními stránkami možné.  ",       
      },
      {
        title: "Design e-mailových zpráv ",
        perex: "Odesílejte e-maily kandidátům s hlavičkou a v barvách vaší firmy. ",
        description:
          "Nahraďte e-mailovou šablonu Teamio svou vlastní. Vaše logo a barvy zabezpečí, že vaše komunikace bude konzistentní a profesionální. Posilněte vaši značku zaměstnavatele při každém jednom e-mailu, který kandidátům odešlete. ",
      },
      {
        title: "Logo v detailu inzerátu (Jobs.cz, Prace.cz)",
        perex: "Díky logu zobrazenému v detailu inzerátu bude váš inzerát atraktivnější.",
        description:
          "Zajistěte konzistentní a profesionální komunikaci s potenciálními zaměstnanci s pomocí šablon, které reflektují vizuální identitu vaší společnosti.",
        externalLink: true
        },
      {
        title: "Firemní profil na Jobs.cz a Prace.cz",
        perex: "Zatraktivněte se přímo na Jobs.cz nebo Práce.cz. ",
        description:
          "S Firemním profilem na našich pracovních portálech rozpovíte příběh vaší společnosti hned vedle pracovních nabídek. Součástí jsou také firemní medailonky přímo v inzerátu. Ukažte, co je u vás zajímavé a čeho si zaměstnanci nejvíce cení a získejte pozornost potenciálních uchazečů. ",
        externalLink: true
      },
    ],
  },
  {
    title: "Nábor a zpracování kandidátů",
    items: [
      {
        title: "Teamio Free",
        package: false,
        perex: "Základní balíček pro vystavení náboru a jednoduchá správa kandidátů.",
        description: "Získejte přístup ke všem pokročilým funkcím a nástrojům pro efektivní nábor.",
        validFrom: "20.12.2024",
        validTo: "20.12.2040",
        
      },
      {
        title: "Počet účtů v Teamiu",
        perex: "Správa předplacených uživatelských účtů",
        description: "Spravujte předplacené uživatelské účty pro váš tým.",
        validFrom: "26.11.2024",
        validTo: "26.11.2026",
        progress: "38/50 uživatelů",
      },

      {
        title: "Rozšíření do prohlížeče pro sourcing ",
        perex: "Uložte si kontaktní údaje kandidátů ze stránek jako LinkedIn nebo Facebook. ",
        description:
          "Rozšíření do prohlížeče pro sourcing automaticky načítá kontaktní údaje z LinkedInu nebo jiných sociálních sítí a webstránek, čímž se eliminuje potřeba manuálního kopírování. Jedním kliknutím tak uložíte jméno, e-mailovou adresu, telefonní číslo přímo do Teamia. Kromě toho rozšíření umožňuje okamžité zpracování uchazečů – prověří je v archivu talentů, upozorní na duplicity a umožní přidání poznámek o zdroji kontaktu. Tento doplněk je dostupný pro prohlížeče Google Chrome a Microsoft Edge a jeho instalace je jednoduchá – stačí jej přidat do prohlížeče a začít využívat jeho funkce. ",
      },
      {
        title: "Teamio Referral ",
        perex: "Mějte doporučení od zaměstnanců pod palcem přímo v Teamiu. ",
        description:
          "Zaměstnanecké doporučení jsou efektivním způsobem, jak získat kontakt na relevantní kandidáty. S novým Teamio referralem máte všechny doporučení pod kontrolou včetně automatického propojení s nábory v Teamiu. ",
      },

      {
        title: "Dokup uživatelů",
        perex: "Zapojte do náboru další kolegy nad rámec uživatelů vaší edice. ",
        description:
          "Je vám s kolegy v Teamiu těsno a potřebujete přizvat další liniové manažery nebo kolegy z HR? Žádný problém. Teamio umožňuje dokup uživatelů také bez změny edice Teamia. Stačí nám napsat. ",
      },

      {
        title: "Flexidotazníky s preselekcí ",
        perex: "Automatický předvýběr pouze kandidátů, který splňují vaše požadavky. ",
        description:
          "Flexidotazníky vám pomáhají efektivně vybírat kandidáty a šetřit čas při náboru. Díky preselekci, bodovému hodnocení a automatickému zamítnutí umožňují lepší třídění uchazečů podle jejich odpovědí. Tímto způsobem se můžete soustředit jen na relevantní uchazeče. ",
        validFrom: "21.3.2024",
        validTo: "21.3.2030",
      },

      {
        title: "Automatický export došlých reakcí ",
        perex: "Nechte si posílat odpovědi od kandidátů do vašeho systému. ",
        description: "Inzerujete-li na našich portálech, ale samotný nábor spravujete v jiné aplikaci nežli Teamio, můžete využít automatického exportu došlých reakcí. Všechny uchazeče vám budeme automaticky přeposílat, abyste je měli na jednom místě. ",
        validFrom: "7.7.2022",
        validTo: "8.7.2030",
      },

      {
        title: "Uživatelské role na míru",
        perex: "Vytvořte si nové role a nastavte kolegům oprávnění podle vašich potřeb. ",
        description: "Díky uživatelským rolím na míru si nastavíte oprávnění v Teamiu podle vašich potřeb a firemních procesů. Máte v týmu brigádníky, kde potřebujete oprávnění omezit? Nebo chcete, aby linioví manažeři fungovali autonomněji a potřebujete jim rozšířit pravomoci? To vše zvládnete v Teamiu na pár kliknutí. ",
        validFrom: "30.8.2022",
        validTo: "30.8.2026",
      },
      {
        title: "Databáze životopisů",
        perex: "Odkryjte si životopisy uchazečů, který se ohlížejí po nových příležitostech",
        description: "Odkryjte si životopisy uchazečů, který se ohlížejí po nových příležitostech. Databáze životopisů v Teamiu je ideálním řešením pro firmy, které potřebují rychle obsadit pracovní pozice a nechtějí spoléhat jen na reakce na inzeráty. Díky široké nabídce kandidátů a jednoduchému systému vyhledávání lze efektivně oslovit relevantní uchazeče. Mezi anonymizovanými životopisy můžete vyhledávat a označovat si zajímavé kandidáty bezplatně. K odkrytí kontaktních údajů je třeba mít zakoupený CV balík.",
        validFrom: "30.8.2022",
        validTo: "30.8.2026",
      },

      {
        title: "Statistiky na míru",
        perex: "Analýza a vizulizace dat o uchazečích a jejich reakcích přesně na míru.",
        description:
          ""
      },
      {
        title: "Teamio školení a konfigurace",
        perex: "Proškolte vaše kolegy a využívejte veškeré možnosti, které Teamio nabízí. ",
        description:
          "Úvodní školení do Teamia jde na nás. Chcete-li s odstupem času proškolit nové zaměstnance, naši specialisti přijdou k vám do firmy a pomůžou s nastavením a vysvětlením všech Teamio funkcí. "
      },
    ],
  },

  {
    title: "Zabezpečení",
    items: [
      {
        title: "Bezpečné přihlášení přes SSO ",
        perex: "Přihlaste se do Teamia s přihlašovacími údaji do vaší firemní sítě. ",
        description:
          "Single sign-on (SSO) umožňuje bezpečné a pohodlné přihlášení do Teamia pomocí vašich firemních přihlašovacích údajů. Už nemusíte pamatovat další hesla ani procházet dvoufaktorovou autentizací – stačí jediné přihlášení a máte přístup k systému bez zbytečných komplikací. ",
        validFrom: "23.12.2024",
        validTo: "28.11.2025",
      },
    ],
  },
  {
    title: "Inzerce a zvýraznění",
    category: "Inzerce a zvýraznění",
    items: [
      {
        title: "Jednorázová inzerce, balíčky a kredity",
        perex: "Zakoupení jednorázové inzerce na Jobs.cz, Prace.cz nebo Práce za rohem",
        description: "Inzerát na 30 dní bez automatického přesunutí na začátek výpisu.",
        externalLink: true
      },
      {
        title: "Zvýraznění inzerátu",
        perex: "Chcete zvýraznit svůj inzerát na Jobs.cz, Prace.cz nebo Práce za rohem?",
        description: "Inzerát na 30 dní bez automatického přesunutí na začátek výpisu.",
        externalLink: true
      },
      {
        title: "Zahraniční inzerce",
        perex: "Začněte zvýrazňovat svůj inzerát na zahraničních portálech.",
        description: "Inzerát na 30 dní bez automatického přesunutí na začátek výpisu.",
        externalLink: true
      },     
      {
        title: "Data z inzerovaných mezd ",
        perex: "Získejte statistiku inzerovaných mezd a nastavte odměňování atraktivně. ",
        description: "Mzdy táhnou. Nastavte je v inzerci tak, aby byli konkurenceschopné a zároveň jste nepřepláceli. Služba Inzerované mzdy sbírá a denně aktualizuje mzdová data ze všech pracovních portálů Alma Career v Česku a na Slovensku a nabízí tak unikátní vhled do toho, jak inzerují ostatní firmy. ",

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
]


