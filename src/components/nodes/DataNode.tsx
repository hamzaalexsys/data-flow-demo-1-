/**
 * @description Composant pour les nœuds de données dans le diagramme
 * Représente les différentes étapes du pipeline: Bronze, Silver, Gold, etc.
 */
import { memo } from "react"
import { Handle, Position } from "reactflow"
import { useDataFlowStore } from "../../store/dataFlowStore"

const DataNode = ({ id, data }: { id: string; data: { label: string } }) => {
  const { activeNode } = useDataFlowStore()
  const isActive = activeNode === id

  // Couleurs spécifiques pour chaque type de nœud
  const getNodeColor = () => {
    switch (id) {
      case "bronze":
        return "from-amber-500 to-amber-700"
      case "silver":
        return "from-gray-300 to-gray-500"
      case "gold":
        return "from-yellow-400 to-yellow-600"
      case "semantic":
        return "from-purple-500 to-purple-700"
      case "powerbi":
        return "from-blue-500 to-blue-700"
      default:
        return "from-blue-500 to-blue-700"
    }
  }

  return (
    <div
      className={`px-4 py-2 rounded-lg shadow-lg w-48 text-center transition-all duration-300 ${
        isActive ? "ring-2 ring-blue-500 scale-110" : ""
      } bg-gradient-to-br ${getNodeColor()} text-white`}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <div className="font-bold">{data.label}</div>
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  )
}

export default memo(DataNode)
