import React from "react"

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/)

    if (!boldMatch && !italicMatch) {
      parts.push(remaining)
      break
    }

    const firstBold = boldMatch ? boldMatch.index! : Infinity
    const firstItalic = italicMatch ? italicMatch.index! : Infinity
    const isBoldFirst = firstBold <= firstItalic

    const match = isBoldFirst ? boldMatch! : italicMatch!
    const idx = match.index!
    const before = remaining.slice(0, idx)
    if (before) parts.push(before)

    if (isBoldFirst) {
      parts.push(<strong key={key++}>{match[1]}</strong>)
    } else {
      parts.push(<em key={key++}>{match[1]}</em>)
    }

    remaining = remaining.slice(idx + match[0].length)
  }

  return parts
}

export function FormattedContent({ text }: { text: string }) {
  const lines = text.split("\n")

  const elements: React.ReactNode[] = []
  let listItems: React.ReactNode[] = []
  let inList = false
  let key = 0

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={key++} className="list-disc list-inside space-y-1">{listItems}</ul>)
      listItems = []
      inList = false
    }
  }

  for (const line of lines) {
    const listMatch = line.match(/^[-*]\s+(.+)/)
    if (listMatch) {
      inList = true
      listItems.push(<li key={`${key}-${listItems.length}`}>{parseInline(listMatch[1])}</li>)
    } else {
      flushList()
      if (line === "") {
        elements.push(<br key={key++} />)
      } else {
        elements.push(<p key={key++} className="mb-2 last:mb-0">{parseInline(line)}</p>)
      }
    }
  }
  flushList()

  return <>{elements}</>
}
