"use client"

import { useEffect } from "react"
import { ReactFlowProvider } from "reactflow"
import { useTheme } from "./components/theme-provider"
import { ThemeToggle } from "./components/theme-toggle"
import DataFlowDiagram from "./components/DataFlowDiagram"
import SidePanel from "./components/SidePanel"
import Terminal from "./components/Terminal"
import PowerBIPanel from "./components/PowerBIPanel"
import { useDataFlowStore } from "./store/dataFlowStore"
import "reactflow/dist/style.css"

function App() {
  const { theme } = useTheme()
  const { activeNode, isDemo, startDemo, logs } = useDataFlowStore()

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"
  }, [theme])

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Data Flow Demo</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={startDemo}
            disabled={isDemo}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDemo ? "Démo en cours..." : "Lancer la démo"}
          </button>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        <div className="w-full md:w-2/3 h-1/2 md:h-full">
          <ReactFlowProvider>
            <DataFlowDiagram />
          </ReactFlowProvider>
        </div>

        <div className="w-full md:w-1/3 h-1/2 md:h-full flex flex-col">
          {activeNode === "powerbi" ? <PowerBIPanel /> : <SidePanel />}
          <Terminal logs={logs} />
        </div>
      </div>
    </div>
  )
}

export default App
