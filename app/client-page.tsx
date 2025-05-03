"use client"

import dynamic from "next/dynamic"

// Importer le composant App de manière dynamique avec { ssr: false }
const DynamicApp = dynamic(() => import("../components/App"), { ssr: false })

export default function ClientPage() {
  return <DynamicApp />
}
