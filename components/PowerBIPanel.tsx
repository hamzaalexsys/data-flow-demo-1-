"use client"

import { useState } from "react"

const PowerBIPanel = () => {
  const [loading] = useState(false)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-3/4 border-l border-[#A12A2F] dark:border-[#A12A2F]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A12A2F]"></div>
      </div>
    )
  }

  return (
    <div className="h-3/4 border-l border-[#A12A2F] dark:border-[#A12A2F]">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Visualisation des données</h2>
      </div>

      <div className="h-5/6 flex flex-col items-center justify-center p-8">
        <div className="bg-[#5A6770] p-12 rounded-md shadow-lg text-center">
          <h3 className="text-2xl font-bold mb-6">Accéder au tableau de bord</h3>
          <p className="mb-8 text-lg">
            Cliquez sur le bouton ci-dessous pour accéder à votre tableau de bord complet
          </p>
          <a 
            href="https://app.powerbi.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-[#A12A2F] hover:bg-[#7a1f23] text-white font-semibold rounded-md transition-colors duration-300"
          >
            Ouvrir le tableau de bord
          </a>
        </div>
      </div>
    </div>
  )
}

export default PowerBIPanel
