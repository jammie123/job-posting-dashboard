"use client"

import { PageHeaderEshop } from "@/components/page-header-eshop"
import { LeftMenu } from "@/components/left-menu"
import { MarketplaceItemCard } from "@/components/marketplace-item-card"
import { TeamioItemCard } from "@/components/teamio-item-card"
import { marketplaceCategories, MarketplaceCategory, MarketplaceItem } from "@/data/mock-data"
import { UserJobs, FilterType } from "./user-jobs"
import { useState, useEffect } from "react"

export default function EshopV2Page() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Vždy používáme všechny položky bez filtrování
  const allItems = marketplaceCategories;
  
  // Debugging function to log the state of categories and items
  const logCategoryStats = () => {
    console.log("Active filter:", activeFilter);
    console.log("Search query:", searchQuery);
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

  // Handle filter change from UserJobs component - pouze pro vizuální účely, nemá efekt na zobrazená data
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter === activeFilter ? "all" : filter);
  }

  // Handle search input change - zachováno, ale nemá efekt na zobrazená data
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Nefiltrujeme položky
  }

  // Log stats při inicializaci
  useEffect(() => {
    console.log("Component mounted, displaying all items without filtering");
    logCategoryStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <LeftMenu />
      <div className="pl-[60px] xl:pl-[140px]">
        <main className="container mx-auto px-6 py-8 space-y-8">
          {/* UserJobs jako samostatná sekce na začátku stránky */}
          <UserJobs 
            activeFilter={activeFilter} 
            onFilterChange={handleFilterChange} 
          />
          
          {/* All Marketplace Categories in a single container */}
          <div className="rounded-lg flex flex-col gap-4 p-6">
            {/* Search input field */}
            <div className="mb-4 mx-4">
              <input
                type="text"
                placeholder="Vyhledat addon, službu nebo balíček (vyhledávání aktuálně nefunkční)"
                className="w-full max-w-sm px-4 py-4 border border-gray-200 text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            {allItems.map((category, categoryIndex) => {
              // Use all items in the category
              const otherItems = category.items;

              // Decide layout based on category title - column for "Inzerce", grid for others
              const isInzerceCategory = category.title === "Inzerce a kredity";
              const useOneColumnLayout = isInzerceCategory || activeFilter === "active-purchased";
              const gridClassName = useOneColumnLayout
                ? "grid grid-cols-1 gap-4" // Column layout for "Inzerce" or active services
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4"; // Standard grid for others

              // Group items by subcategory if this is Inzerce a kredity
              const groupedItems = isInzerceCategory 
                ? groupItemsBySubcategory(category)
                : { default: otherItems };
                
              // Debug groupedItems
              console.log(`Category ${category.title} grouped items:`, groupedItems);

              return (
                <div key={categoryIndex} className="mb-12 mx-4 last:mb-0">
                  {/* Display category title */}
                  <h2 className="text-md font-semibold text-gray-600 mb-4"> {category.category ? category.category : category.title}</h2>
                  
                  {Object.keys(groupedItems).length === 0 ? (
                    <div className="text-gray-500 italic">Žádné položky v této kategorii</div>
                  ) : (
                    /* Render items grouped by subcategory */
                    Object.entries(groupedItems).map(([subcategory, items]) => (
                      <div key={subcategory} className="mb-8 last:mb-0">
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
        </main>
      </div>
    </div>
  );
} 