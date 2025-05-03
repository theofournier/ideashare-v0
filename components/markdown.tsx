"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <ReactMarkdown>{content}</ReactMarkdown>
}
