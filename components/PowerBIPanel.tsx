"use client"

import { useState } from "react"

const PowerBIPanel = () => {
  const [loading] = useState(false)

  const dashboards = [
    {
      id: "habous-social",
      name: "Habous Appui Social",
      url: "https://app.powerbi.com/reportEmbed?reportId=fa4d49f3-f82f-4d5d-8891-0ddba84d114d&autoAuth=true&ctid=d6c5bbe2-0dd0-4148-a86c-ffe8f3e95c29"
    },
    {
      id: "habous-infrastructure",
      name: "Habous Etablissement/Infrastructure",
      url: "https://app.powerbi.com/reportEmbed?reportId=a28db75a-70db-4d20-9ad6-29b6eade5a04&autoAuth=true&ctid=d6c5bbe2-0dd0-4148-a86c-ffe8f3e95c29"
    },
    {
      id: "habous-personnel",
      name: "Habous Personnel",
      url: "https://app.powerbi.com/reportEmbed?reportId=0ec35f92-2fee-4017-85e9-5c338fcb57b5&autoAuth=true&ctid=d6c5bbe2-0dd0-4148-a86c-ffe8f3e95c29"
    },
    {
      id: "habous-scolarite",
      name: "Habous Scolarité des élèves",
      url: "https://app.powerbi.com/reportEmbed?reportId=8fd6e01e-9512-458b-a0cc-9247b8a0615d&autoAuth=true&ctid=d6c5bbe2-0dd0-4148-a86c-ffe8f3e95c29"
    }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-3/4 border-l border-[#A12A2F] dark:border-[#A12A2F]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A12A2F]"></div>
      </div>
    )
  }

  return (
    <div className="h-3/4 border-l border-[#A12A2F] dark:border-[#A12A2F] overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Visualisation des données</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {dashboards.map((dashboard) => (
          <div 
            key={dashboard.id} 
            className="bg-white dark:bg-[#2D3748] p-6 rounded-md shadow-lg text-center border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-bold mb-4">{dashboard.name}</h3>
            <a 
              href={dashboard.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-[#A12A2F] hover:bg-[#7a1f23] text-white font-semibold rounded-md transition-colors duration-300"
            >
              Ouvrir le tableau de bord
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PowerBIPanel
