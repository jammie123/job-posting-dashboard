"use client"

import { PageHeaderEshop } from "@/components/page-header-eshop"
import { LeftMenu } from "@/components/left-menu"
import { TopHeader } from "@/components/top-header"
import { MarketplaceItemCard } from "@/components/marketplace-item-card"
import { TeamioCard } from "@/components/teamio-card"
import { marketplaceCategories, MarketplaceCategory, MarketplaceItem } from "@/data/mock-data"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

// Styly pro tisk
const printStyles = `
  @media print {
    main.container {
      margin-left: 3rem !important;
      margin-right: 3rem !important;
    }
    
    /* Skrytí komponent při tisku */
    .left-menu, 
    .top-header,
    .filter-buttons,
    .teamio-sidebar {
      display: none !important;
    }
    
    /* Zrušení levého paddingu při tisku */
    .main-content {
      padding-left: 0 !important;
    }
    
    /* Plná šířka pro hlavní obsah */
    .content-container {
      width: 100% !important;
    }
    
    /* Větší mezery mezi položkami při tisku */
    .category-container, 
    .subcategory-container {
      margin-bottom: 2rem !important;
    }
    
    /* Nastavení dvou sloupců pro mřížku při tisku */
    .item-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
  }
`;

export default function EshopV2Page() {
  // Vždy používáme všechny položky bez filtrování
  const allItems = marketplaceCategories;
  
  // Stav pro vyhledávací dotaz
  const [searchQuery, setSearchQuery] = useState("");
  
  // Stav pro aktivní kategorii filtru
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Získáme data pro Teamio kartu - najdeme kategorii Teamio a první položku s package==true
  const teamioCategory = marketplaceCategories.find(category => category.title === "Teamio");
  const premiumTeamioItem = teamioCategory?.items.find(item => item.package === true);
  
  // Debugging function to log the state of categories and items
  const logCategoryStats = () => {
    console.log("All categories count:", allItems.length);
    allItems.forEach((category, i) => {
      console.log(`Category ${i+1}: ${category.title}, Items: ${category.items.length}`);
    });
  };

  // Group items by subcategory for categories that have them
  const groupItemsBySubcategory = (category: MarketplaceCategory): Record<string, MarketplaceItem[]> => {
    if (!category.items || category.items.length === 0) return {}
    
    // Check if this category has subcategories (like "Inzerce a kredity")
    const hasSubcategories = category.items.some(item => 'category' in item)
    
    if (!hasSubcategories) return { default: category.items }
    
    // Group items by their subcategory
    return category.items.reduce((acc: Record<string, MarketplaceItem[]>, item: MarketplaceItem) => {
      const subcategory = (item as any).category || 'default'
      if (!acc[subcategory]) acc[subcategory] = []
      acc[subcategory].push(item)
      return acc
    }, {})
  }

  // Funkce pro filtrování položek podle vyhledávacího dotazu
  const filterItemsBySearchQuery = (items: MarketplaceItem[]): MarketplaceItem[] => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(query) || 
      (item.perex && item.perex.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  };
  
  // Log stats při inicializaci
  useEffect(() => {
    console.log("Component mounted, displaying all items without filtering");
    logCategoryStats();
  }, []);

  // Filtrování kategorií podle aktivního filtru
  const filteredCategories = activeCategory === "all" 
    ? allItems 
    : allItems.filter(category => {
        if (activeCategory === "inzerce" && category.title === "Inzerce a zvýraznění") return true;
        if (activeCategory === "nabor" && (category.title === "Nábor a zpracování kandidátů" || category.title === "Nástup uchazeče")) return true;
        if (activeCategory === "propagace" && category.title === "Propagace a branding") return true;
        return false;
      });

  // Funkce pro filtrování položek podle aktivních služeb (s validFrom a validTo)
  const filterActiveItems = (items: MarketplaceItem[]): MarketplaceItem[] => {
    if (activeCategory !== "active") return items;
    return items.filter(item => item.validFrom && item.validTo);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vložení stylů pro tisk */}
      <style jsx global>{printStyles}</style>

      <div className="left-menu">
        <LeftMenu />
      </div>
      <div className="main-content pl-[60px] xl:pl-[140px]">
        <div className="top-header">
          <TopHeader userName="Anna K." companyName="Acme Corporation s.r.o." />
        </div>
        <main className="container mx-auto px-6 py-8 print:px-12">
          {/* Header sekce */}
          <div className="flex justify-between items-center mt-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Eshop</h1>
          </div>
          
          {/* Filtrovací tlačítka */}
          <div className="filter-buttons flex flex-wrap gap-2 mb-8 relative">
            <Button 
              variant={activeCategory === "all" ? "secondary" : "outline"}
              onClick={() => setActiveCategory("all")}
              className="rounded-full text-xs py-1 h-8"
              size="sm"
            >
              Všechny služby
            </Button>
            <Button 
              variant={activeCategory === "nabor" ? "secondary" : "outline"}
              onClick={() => setActiveCategory("nabor")}
              className="rounded-full text-xs py-1 h-8"
              size="sm"
            >
              Nábor a zpracování
            </Button>
            <Button 
              variant={activeCategory === "inzerce" ? "secondary" : "outline"}
              onClick={() => setActiveCategory("inzerce")}
              className="rounded-full text-xs py-1 h-8"
              size="sm"
            >
              Inzerce
            </Button>
            <Button 
              variant={activeCategory === "propagace" ? "secondary" : "outline"}
              onClick={() => setActiveCategory("propagace")}
              className="rounded-full text-xs py-1 h-8"
              size="sm"
            >
              Propagace a branding
            </Button>
                        {/* Vertikální oddělovač */}
                        <div className="h-8 border-l border-gray-300 mx-2"></div>
            <Button 
              variant={activeCategory === "active" ? "secondary" : "outline"}
              onClick={() => setActiveCategory("active")}
              className="rounded-full text-xs py-1 h-8"
              size="sm"
            >
              Aktivní služby
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
            

            
            <Button 
              variant="outline"
              className="rounded-full text-xs py-1 h-8 flex items-center gap-1"
              size="sm"
              onClick={() => window.open('https://www.lmc.eu/cs-cz/faktury', '_blank')}
            >
              Zaplacené faktury
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
            <div className="absolute right-0 ">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
                <Search className="h-5 w-5 text-gray-400 " />
              </div>
              <input
                type="search"
                className="block w-[300px] p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Vyhledej addon, službu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            
            </div> 
          </div>
          
          {/* Layout with right sidebar */}
          <div className="flex gap-6">
            {/* Main content */}
            <div className="content-container flex-1">
              {/* All Marketplace Categories */}
              <div className="rounded-lg flex flex-col gap-4">
                {filteredCategories.map((category, categoryIndex) => {
                  // Pro kategorii Teamio, musíme filtrovat pouze položky s package==false
                  // pro ostatní kategorie zobrazujeme všechny položky
                  let displayItems = category.title === "Teamio" 
                    ? category.items.filter(item => item.package === false)
                    : category.items;
                  
                  // Aplikujeme filtrování podle vyhledávacího dotazu
                  displayItems = filterItemsBySearchQuery(displayItems);
                  
                  // Aplikujeme filtrování podle aktivních služeb
                  displayItems = filterActiveItems(displayItems);
                  
                  // Pokud kategorie nemá žádné položky k zobrazení, přeskočíme ji
                  if (displayItems.length === 0) return null;
                  
                  // Decide layout based on category title - column for "Inzerce", grid for others
                  const isInzerceCategory = category.title === "Inzerce a kredity";
                  const gridClassName = isInzerceCategory
                    ? "grid grid-cols-1 gap-4" // Column layout for "Inzerce"
                    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 item-grid"; // Standard grid for others with print override

                  // Group items by subcategory if this is Inzerce a kredity
                  const groupedItems = isInzerceCategory 
                    ? groupItemsBySubcategory({ ...category, items: displayItems })
                    : { default: displayItems };
                    
                  // Debug groupedItems
                  console.log(`Category ${category.title} grouped items:`, groupedItems);

                  return (
                    <div key={categoryIndex} className="category-container mb-12 last:mb-0">
                      {/* Display category title */}
                      <h2 className="text-md font-semibold text-gray-600 mb-4">{category.category ? category.category : category.title}</h2>
                      
                      {Object.keys(groupedItems).length === 0 ? (
                        <div className="text-gray-500 italic">Žádné položky v této kategorii</div>
                      ) : (
                        /* Render items grouped by subcategory */
                        Object.entries(groupedItems).map(([subcategory, items]) => (
                          <div key={subcategory} className="subcategory-container mb-8 last:mb-0">
                            {/* Display subcategory title if it's not the default group */}
                            {subcategory !== 'default' && (
                              <h3 className="text-lg font-medium mb-4 text-gray-700">{subcategory}</h3>
                            )}
                            
                            {items.length === 0 ? (
                              <div className="text-gray-500 italic">Žádné položky v této podkategorii</div>
                            ) : (
                              <div className={gridClassName}>
                                {/* Render all items in this subcategory */}
                                {items.map((item: MarketplaceItem, itemIndex: number) => (
                                  <MarketplaceItemCard
                                    key={itemIndex}
                                    title={item.title}
                                    perex={item.perex}
                                    description={item.description}
                                    validFrom={item.validFrom}
                                    validTo={item.validTo}
                                    howToUse={item.howToUse}
                                    upgrade={item.upgrade}
                                    progress={item.progress}
                                    {...(item as any).prize ? { prize: (item as any).prize } : {}}
                                    {...(item.icon ? { icon: item.icon } : {})}
                                    {...(item.externalLink ? { externalLink: item.externalLink } : {})}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Right sidebar for premium TeamioCard */}
            {premiumTeamioItem && (
              <div className="teamio-sidebar w-80 hidden lg:block">
                <TeamioCard item={premiumTeamioItem} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 