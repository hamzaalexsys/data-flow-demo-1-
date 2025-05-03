"use client"

import { useEffect, useState } from "react"
import { useDataFlowStore } from "../store/dataFlowStore"
import { fetchNodeData } from "../services/api"
import DataTable from "./DataTable"

const SidePanel = () => {
  const { activeNode, activeSource } = useDataFlowStore()
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
          setLoading(false)
        })
    }
  }, [activeNode, activeSource])

  if (!activeNode) {
    return (
      <div className="p-4 h-full overflow-auto border-l border-[#A12A2F] dark:border-[#A12A2F]">
        <p className="text-center text-gray-300 dark:text-gray-300 mt-10">
          Sélectionnez un nœud dans le diagramme pour voir les détails
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4 h-full overflow-auto border-l border-[#A12A2F] dark:border-[#A12A2F]">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A12A2F]"></div>
        </div>
      </div>
    )
  }

  const getNodeTitle = () => {
    if (activeNode === "source" && activeSource) {
      const sourceTitles: Record<string, string> = {
        habous: "Source: Habous",
        men: "Source: MEN (Massar)",
        esup: "Source: ESUP",
        ofppt: "Source: OFPPT"
      }
      return sourceTitles[activeSource] || `Source: ${activeSource.toUpperCase()}`
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
        "Les données brutes provenant de différentes sources comme Habous, MEN (Massar), ESUP, et OFPPT.",
      bronze:
        "La couche Bronze contient les données brutes mais nettoyées. Les problèmes d'encodage, de séparateurs et de format sont résolus à cette étape.",
      silver:
        "La couche Silver applique un typage correct aux données et normalise les colonnes pour assurer la cohérence.",
      gold: "La couche Gold contient des vues agrégées et des métriques calculées, prêtes pour l'analyse.",
      semantic:
        "Le modèle sémantique définit les relations entre les tables, les mesures et les dimensions pour l'analyse.",
      powerbi:
        'Power BI utilise le modèle sémantique pour créer des visualisations et des tableaux de bord interactifs.',
    }

    if (activeNode === "source" && activeSource) {
      const sourceDescriptions: Record<string, string> = {
        habous: "Fiche individualisée des élèves des écoles traditionnelles (identité, Code Massar, résultat annuel, couverture sociale).",
        men: "Registre Massar des élèves du primaire/secondaire (Code Massar officiel, décision annuelle).",
        esup: "Étudiants inscrits dans les universités et grandes écoles (Licence / Master / Doctorat).",
        ofppt: "Stagiaires des Centres de Formation OFPPT (Technicien, Technicien Spécialisé, Qualification).",
      }

      return sourceDescriptions[activeSource] || descriptions[activeNode]
    }

    return descriptions[activeNode] || ""
  }

  return (
    <div className="p-4 h-full overflow-auto border-l border-[#A12A2F] dark:border-[#A12A2F]">
      <h2 className="text-xl font-bold mb-4">{getNodeTitle()}</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-200 dark:text-gray-200">{getNodeDescription()}</p>
      </div>

      {data && (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Schéma</h3>
            <pre className="bg-[#5A6770] dark:bg-[#5A6770] p-3 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(data.schema, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Aperçu des données</h3>
            {data.data && data.data.length > 0 ? (
              <DataTable data={data.data} />
            ) : (
              <p className="text-gray-300 dark:text-gray-300">Aucune donnée disponible</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default SidePanel
