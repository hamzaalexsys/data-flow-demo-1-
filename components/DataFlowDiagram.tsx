"use client"

import type React from "react"
import { useCallback, useEffect, useMemo } from "react"
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
  type NodeTypes,
  useEdgesState,
  useNodesState,
} from "reactflow"
import { motion } from "framer-motion"
import { useDataFlowStore } from "../store/dataFlowStore"
import DataNode from "./nodes/DataNode"
import SourceNode from "./nodes/SourceNode"

// Définition des types de nœuds personnalisés
const nodeTypes: NodeTypes = {
  dataNode: DataNode,
  sourceNode: SourceNode,
}

// Composant pour animer les flèches avec Framer Motion
const AnimatedEdge = ({ id, sourceX, sourceY, targetX, targetY, style = {} }: any) => {
  const { isDemo, activeNode } = useDataFlowStore()

  // Détermine si cette flèche doit être active en fonction du nœud actif
  const isActive = useMemo(() => {
    const edgeMap: Record<string, string[]> = {
      source: [],
      bronze: ["edge-source-bronze"],
      silver: ["edge-source-bronze", "edge-bronze-silver"],
      gold: ["edge-source-bronze", "edge-bronze-silver", "edge-silver-gold"],
      semantic: ["edge-source-bronze", "edge-bronze-silver", "edge-silver-gold", "edge-gold-semantic"],
      powerbi: [
        "edge-source-bronze",
        "edge-bronze-silver",
        "edge-silver-gold",
        "edge-gold-semantic",
        "edge-semantic-powerbi",
      ],
    }

    return isDemo && edgeMap[activeNode]?.includes(id)
  }, [id, isDemo, activeNode])

  // Points de contrôle pour créer une courbe sinusoïdale
  const dx = targetX - sourceX
  const dy = targetY - sourceY
  const controlX1 = sourceX + dx * 0.25
  const controlY1 = sourceY + dy * 0.1
  const controlX2 = sourceX + dx * 0.75
  const controlY2 = sourceY + dy * 0.9

  // Définition du chemin SVG
  const path = `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`

  return (
    <g>
      <defs>
        <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0066ff" />
          <stop offset="100%" stopColor="#00ccff" />
        </linearGradient>
      </defs>
      <path
        id={id}
        d={path}
        fill="none"
        stroke={`url(#gradient-${id})`}
        strokeWidth={isActive ? 4 : 2}
        style={{ ...style }}
      />
      {isActive && (
        <motion.circle
          r={6}
          fill="#00ccff"
          filter="url(#glow)"
          initial={{ offsetDistance: "0%" }}
          animate={{
            offsetDistance: "100%",
            transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          }}
          style={{ offsetPath: `path("${path}")` }}
        />
      )}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </g>
  )
}

const edgeTypes = {
  animated: AnimatedEdge,
}

const DataFlowDiagram = () => {
  const { setActiveNode, activeNode, isDemo, setIsDemo } = useDataFlowStore()

  // Définition des nœuds initiaux
  const initialNodes: Node[] = [
    {
      id: "source",
      type: "sourceNode",
      data: { label: "Sources" },
      position: { x: 50, y: 150 },
    },
    {
      id: "bronze",
      type: "dataNode",
      data: { label: "Bronze" },
      position: { x: 250, y: 150 },
    },
    {
      id: "silver",
      type: "dataNode",
      data: { label: "Silver" },
      position: { x: 450, y: 150 },
    },
    {
      id: "gold",
      type: "dataNode",
      data: { label: "Gold" },
      position: { x: 650, y: 150 },
    },
    {
      id: "semantic",
      type: "dataNode",
      data: { label: "Modèle sémantique" },
      position: { x: 850, y: 150 },
    },
    {
      id: "powerbi",
      type: "dataNode",
      data: { label: "Power BI" },
      position: { x: 1050, y: 150 },
    },
  ]

  // Définition des connexions entre les nœuds
  const initialEdges: Edge[] = [
    {
      id: "edge-source-bronze",
      source: "source",
      target: "bronze",
      type: "animated",
      animated: true,
    },
    {
      id: "edge-bronze-silver",
      source: "bronze",
      target: "silver",
      type: "animated",
      animated: true,
    },
    {
      id: "edge-silver-gold",
      source: "silver",
      target: "gold",
      type: "animated",
      animated: true,
    },
    {
      id: "edge-gold-semantic",
      source: "gold",
      target: "semantic",
      type: "animated",
      animated: true,
    },
    {
      id: "edge-semantic-powerbi",
      source: "semantic",
      target: "powerbi",
      type: "animated",
      animated: true,
    },
  ]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Gestion du clic sur un nœud
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setActiveNode(node.id)
    },
    [setActiveNode],
  )

  // Effet pour la démo automatique
  useEffect(() => {
    if (isDemo) {
      const stages = ["source", "bronze", "silver", "gold", "semantic", "powerbi"]
      let currentStage = 0

      const interval = setInterval(() => {
        if (currentStage < stages.length) {
          const stage = stages[currentStage]
          setActiveNode(stage)

          // Ne plus ajouter de logs spécifiques à chaque étape
          if (stage === "powerbi") {
            setIsDemo(false)
          }

          currentStage++
        } else {
          clearInterval(interval)
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isDemo, setActiveNode, setIsDemo])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default DataFlowDiagram
