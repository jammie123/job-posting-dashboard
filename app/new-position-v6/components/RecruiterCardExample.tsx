"use client"

import { RecruiterCard } from "./RecruiterCard"

export default function RecruiterCardExample() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ukázka RecruiterCard</h2>
      <RecruiterCard 
        fullname="Jan Novák" 
        role="Náborář"
        onChange={(members) => console.log("Tým byl aktualizován:", members)}
      />
    </div>
  )
} 