"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
}

export function CodeBlock({ children, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="relative group my-6">
      {/* Code window header */}
      <div className="flex items-center justify-between bg-muted/50 border border-border rounded-t-lg px-4 py-2">
        <div className="flex items-center gap-2">
          {/* Window controls */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
          </div>
          {filename && <span className="text-sm text-muted-foreground ml-2">{filename}</span>}
          {language && !filename && <span className="text-sm text-muted-foreground ml-2">{language}</span>}
        </div>

        {/* Copy button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      {/* Code content */}
      <pre className="bg-muted border border-t-0 border-border rounded-b-lg p-4 overflow-x-auto">
        <code className="text-sm font-mono text-foreground leading-relaxed">{children}</code>
      </pre>
    </div>
  )
}
