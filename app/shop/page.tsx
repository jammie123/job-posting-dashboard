"use client"

import { PageHeaderEshop } from "@/components/page-header-eshop"
import { LeftMenu } from "@/components/left-menu"
import { MarketplaceItemCard } from "@/components/marketplace-item-card"
import { TeamioItemCard } from "@/components/teamio-item-card"
import { marketplaceCategories } from "@/data/mock-data"
import { useState } from "react"

export default function EshopPage() {
  const [activeTab, setActiveTab] = useState("all")

  // Filter categories based on the active tab
  const filteredCategories = marketplaceCategories.filter((category) => {
    if (activeTab === "all") return true

    // Check if any item in the category matches the active tab
    return category.items.some((item) => {
      switch (activeTab) {
        
        case "recruitment":
          return item.perex?.toLowerCase().includes("nábor") || category.title?.toLowerCase().includes("nábor")
        case "promotion":
          return item.perex?.toLowerCase().includes("propagace") || category.title?.toLowerCase().includes("propagace")
        case "security":
          return (
            item.perex?.toLowerCase().includes("zabezpečení") || category.title?.toLowerCase().includes("zabezpečení")
          )
        case "job-portals":
          return item.perex?.toLowerCase().includes("inzerce") || category.title?.toLowerCase().includes("inzerce")
        case "active-purchased":
          return item.validFrom && item.validTo
        default:
          return true
      }
    })
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <LeftMenu />
      <div className="pl-[60px] xl:pl-[140px]">
        <PageHeaderEshop title="E-shop" onTabChange={setActiveTab} />
        <main className="container mx-auto px-6 py-8 space-y-8">
          {/* All Marketplace Categories in a single container */}
          <div className="rounded-lg flex flex-col gap-4 p-6">
            {filteredCategories.map((category, categoryIndex) => {
              // Find the first package item (if any)
              const packageItem = category.items.find((item) => item.package)

              // Get all other items (including any additional package items)
              const otherItems = packageItem ? category.items.filter((item) => item !== packageItem) : category.items

              return (
                <div key={categoryIndex} className="mb-8 last:mb-0">
                  {!packageItem && <h2 className="text-xl font-semibold mb-6"> {category.category ? category.category : category.title}</h2>}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">


                    {/* Render all other items */}
                    {otherItems.map((item, itemIndex) => (
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
                        package={item.package}
                        features={item.features}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}

