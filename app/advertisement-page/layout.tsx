import type React from "react"
export default function AdvertisementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gray-100 pr-[60px]">{children}</div>
}

