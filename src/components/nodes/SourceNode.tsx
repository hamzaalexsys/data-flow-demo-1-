"use client"

/**
 * @description Composant pour le nœud source dans le diagramme
 * Contient des sous-nœuds pour les différents types de sources (CSV, API, Excel)
 */
import { memo, useState } from "react"
import { Handle, Position } from "reactflow"
import { useDataFlowStore } from "../../store/dataFlowStore"

const SourceNode = ({ id, data }: { id: string; data: { label: string } }) => {
  const { activeNode, setActiveNode, setActiveSource, addLog } = useDataFlowStore()
  const isActive = activeNode === id
  const [expanded, setExpanded] = useState(false)

  const handleSourceClick = (sourceType: string) => {
    setActiveSource(sourceType)
    addLog(`Source sélectionnée: ${sourceType}`)
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
    if (!expanded) {
      setActiveNode("source")
    }
  }

  return (
    <div
      className={`px-4 py-2 rounded-lg shadow-lg w-48 transition-all duration-300 ${
        isActive ? "ring-2 ring-blue-500 scale-110" : ""
      } bg-gradient-to-br from-green-500 to-green-700 text-white`}
    >
      <div className="font-bold text-center cursor-pointer" onClick={toggleExpand}>
        {data.label}
        <span className="ml-2">{expanded ? "▼" : "►"}</span>
      </div>

      {expanded && (
        <div className="mt-2 space-y-1">
          <div
            className="bg-green-600 p-1 rounded cursor-pointer hover:bg-green-800 transition-colors"
            onClick={() => handleSourceClick("csv")}
          >
            CSV
          </div>
          <div
            className="bg-green-600 p-1 rounded cursor-pointer hover:bg-green-800 transition-colors"
            onClick={() => handleSourceClick("api")}
          >
            API REST
          </div>
          <div
            className="bg-green-600 p-1 rounded cursor-pointer hover:bg-green-800 transition-colors"
            onClick={() => handleSourceClick("excel")}
          >
            Excel
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  )
}

export default memo(SourceNode)
