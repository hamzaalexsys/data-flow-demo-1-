import { create } from "zustand"

interface Log {
  timestamp: string
  message: string
  type: "info" | "error" | "success" | "warning"
}

interface DataFlowState {
  activeNode: string
  activeSource: string | null
  logs: Log[]
  isDemo: boolean
  setActiveNode: (nodeId: string) => void
  setActiveSource: (sourceType: string) => void
  addLog: (message: string, type?: "info" | "error" | "success" | "warning") => void
  clearLogs: () => void
  startDemo: () => void
  setIsDemo: (isDemo: boolean) => void
}

export const useDataFlowStore = create<DataFlowState>((set) => ({
  activeNode: "",
  activeSource: null,
  logs: [],
  isDemo: false,

  setActiveNode: (nodeId) => set({ activeNode: nodeId }),

  setActiveSource: (sourceType) => set({ activeSource: sourceType }),

  addLog: (message, type = "info") =>
    set((state) => ({
      logs: [
        ...state.logs,
        {
          timestamp: new Date().toLocaleTimeString(),
          message,
          type,
        },
      ].slice(-50), // Garder seulement les 50 derniers logs
    })),

  clearLogs: () => set({ logs: [] }),

  startDemo: () => {
    set({ isDemo: true, activeNode: "", logs: [] })
  },

  setIsDemo: (isDemo) => set({ isDemo }),
}))
