"use client"

import { useEffect, useRef } from "react"

interface TerminalProps {
  logs: Array<{
    timestamp: string
    message: string
    type: "info" | "error" | "success" | "warning"
  }>
}

const Terminal = ({ logs }: TerminalProps) => {
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="terminal" ref={terminalRef}>
      {logs.map((log, index) => (
        <div key={index} className="terminal-line">
          <span className="terminal-timestamp">[{log.timestamp}]</span>
          <span className={`terminal-${log.type}`}>{log.message}</span>
        </div>
      ))}
    </div>
  )
}

export default Terminal
