"use client"

/**
 * @description Panneau latéral qui affiche les détails du nœud sélectionné
 * Montre la description, le schéma JSON et un aperçu des données
 */
import { useEffect, useState } from "react"
import { useDataFlowStore } from "../store/dataFlowStore"
import { fetchNodeData } from "../services/api"
import DataTable from "./DataTable"

const SidePanel = () => {
  const { activeNode, activeSource, addLog } = useDataFlowStore()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeNode) {
      setLoading(true)
      fetchNodeData(activeNode, activeSource)
        .then((result) => {
          setData(result)
          setLoading(false)
        })
        .catch((error) => {
          addLog(`Erreur lors du chargement des données: ${error.message}`, "error")
          setLoading(false)
        })
    }
  }, [activeNode, activeSource, addLog])

  if (!activeNode) {
    return (
      <div className="p-4 h-full overflow-auto border-l border-gray-200 dark:border-gray-700">
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          Sélectionnez un nœud dans le diagramme pour voir les détails
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4 h-full overflow-auto border-l border-gray-200 dark:border-gray-700">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  const getNodeTitle = () => {
    if (activeNode === "source" && activeSource) {
      return `Source: ${activeSource.toUpperCase()}`
    }

    const titles: Record<string, string> = {
      source: "Sources de données",
      bronze: "Couche Bronze",
      silver: "Couche Silver",
      gold: "Couche Gold",
      semantic: "Modèle Sémantique",
      powerbi: "Power BI",
    }

    return titles[activeNode] || activeNode
  }

  const getNodeDescription = () => {
    const descriptions: Record<string, string> = {
      source:
        "Les données brutes provenant de différentes sources comme des fichiers CSV, des API REST ou des fichiers Excel.",
      bronze:
        "La couche Bronze contient les données brutes mais nettoyées. Les problèmes d'encodage, de séparateurs et de format sont résolus à cette étape.",
      silver:
        "La couche Silver applique un typage correct aux données et normalise les colonnes pour assurer la cohérence.",
      gold: "La couche Gold contient des vues agrégées et des métriques calculées, prêtes pour l'analyse.",
      semantic:
        "Le modèle sémantique définit les relations entre les tables, les mesures et les dimensions pour l'analyse.",
      powerbi:
        "Power BI utilise le modèle sémantique pour créer des visualisations et des tableaux de bord interactifs.",
    }

    if (activeNode === "source" && activeSource) {
      const sourceDescriptions: Record<string, string> = {
        csv: "Fichiers CSV contenant des données tabulaires avec des séparateurs comme des virgules ou des points-virgules.",
        api: "API REST fournissant des données au format JSON ou XML via des requêtes HTTP.",
        excel: "Fichiers Excel contenant des données structurées en feuilles de calcul.",
      }

      return sourceDescriptions[activeSource] || descriptions[activeNode]
    }

    return descriptions[activeNode] || ""
  }

  return (
    <div className="p-4 h-3/4 overflow-auto border-l border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4">{getNodeTitle()}</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-700 dark:text-gray-300">{getNodeDescription()}</p>
      </div>

      {data && (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Schéma</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(data.schema, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Aperçu des données</h3>
            {data.data && data.data.length > 0 ? (
              <DataTable data={data.data} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default SidePanel
