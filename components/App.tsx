"use client"

import { useEffect } from "react"
import { ReactFlowProvider } from "reactflow"
import { useTheme } from "./theme-provider"
import { ThemeToggle } from "./theme-toggle"
import DataFlowDiagram from "./DataFlowDiagram"
import SidePanel from "./SidePanel"
import PowerBIPanel from "./PowerBIPanel"
import { useDataFlowStore } from "../store/dataFlowStore"
import "reactflow/dist/style.css"

export default function App() {
  const { theme } = useTheme()
  const { activeNode } = useDataFlowStore()

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : ""
    document.body.style.background = "linear-gradient(180deg, #616E76 0%, #A12A2F 112.94%)"
  }, [theme])

  return (
    <div className="min-h-screen text-gray-100 transition-colors duration-200 pt-6 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl shadow-lg py-3 px-6 flex items-center gap-4 border border-[#A12A2F]/20">
          <img src="components/logo.png" alt="Logo" className="h-10" />
          <h1 className="text-2xl font-bold text-black">Flux de visualisation des sources de donnée</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-120px)]">
        <div className="w-full md:w-2/3 h-1/2 md:h-full">
          <ReactFlowProvider>
            <DataFlowDiagram />
          </ReactFlowProvider>
        </div>

        <div className="w-full md:w-1/3 h-1/2 md:h-full flex flex-col">
          {activeNode === "powerbi" ? <PowerBIPanel /> : <SidePanel />}
        </div>
      </div>
    </div>
  )
}
