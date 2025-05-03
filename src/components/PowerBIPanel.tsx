"use client"

/**
 * @description Panneau qui intègre un rapport Power BI
 * Utilise la bibliothèque powerbi-client-react pour afficher le rapport
 */
import { useEffect, useState } from "react"
import { PowerBIEmbed } from "powerbi-client-react"
import { models } from "powerbi-client"
import { fetchPowerBIConfig } from "../services/api"
import { useDataFlowStore } from "../store/dataFlowStore"

const PowerBIPanel = () => {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { addLog } = useDataFlowStore()

  useEffect(() => {
    setLoading(true)
    fetchPowerBIConfig()
      .then((data) => {
        setConfig(data)
        setLoading(false)
        addLog("Rapport Power BI chargé avec succès", "success")
      })
      .catch((error) => {
        addLog(`Erreur lors du chargement du rapport Power BI: ${error.message}`, "error")
        setLoading(false)
      })
  }, [addLog])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-3/4 border-l border-gray-200 dark:border-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="p-4 h-3/4 border-l border-gray-200 dark:border-gray-700">
        <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded">
          <p className="font-bold">Information</p>
          <p>
            Pour afficher le rapport Power BI, vous devez configurer un token d'accès. Consultez le README.md pour les
            instructions sur l'obtention d'un token Power BI.
          </p>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Modèle sémantique pour Power BI</h2>
          <p className="mb-4">
            Le modèle sémantique définit la structure des données pour l'analyse dans Power BI. Il comprend:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Tables de faits (mesures)</li>
            <li>Tables de dimensions (attributs)</li>
            <li>Relations entre les tables</li>
            <li>Mesures calculées (DAX)</li>
            <li>Hiérarchies</li>
          </ul>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Exemple de mesure DAX</h3>
            <pre className="text-sm overflow-x-auto">
              {`Moyenne Générale = 
AVERAGE(Students[NoteMath] + Students[NotePhysique]) / 2`}
            </pre>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-3/4 border-l border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Rapport Power BI: Résultats du BAC 2024</h2>
      </div>

      <div className="h-5/6">
        <PowerBIEmbed
          embedConfig={{
            type: "report",
            id: config.reportId,
            embedUrl: config.embedUrl,
            accessToken: config.accessToken,
            tokenType: models.TokenType.Embed,
            settings: {
              panes: {
                filters: {
                  expanded: false,
                  visible: true,
                },
              },
              background: models.BackgroundType.Transparent,
            },
          }}
          cssClassName="h-full w-full"
        />
      </div>
    </div>
  )
}

export default PowerBIPanel
