"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CMSLive({ resource, initial }: { resource: 'blog' | 'advice', initial: any[] }) {
  const [items, setItems] = useState<any[]>(initial || [])

  useEffect(() => {
    const src = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/products/stream'
    const evt = new EventSource(src)

    const onCreated = (e: any) => {
      try {
        const data = JSON.parse(e.data)
        if (e.type === 'message') return
      } catch (err) { }
    }

    const handleEvent = (e: any) => {
      try {
        const data = JSON.parse(e.data)
        if (!e.type) return
        if (e.type === `${resource}_created`) setItems(prev => [data, ...prev])
        if (e.type === `${resource}_updated`) setItems(prev => prev.map(it => (it.id === data.id ? data : it)))
        if (e.type === `${resource}_deleted`) setItems(prev => prev.filter(it => it.id !== data.id))
      } catch (err) { }
    }

    // Subscribe to specific events
    evt.addEventListener(`${resource}_created`, handleEvent)
    evt.addEventListener(`${resource}_updated`, handleEvent)
    evt.addEventListener(`${resource}_deleted`, handleEvent)

    return () => { evt.close() }
  }, [resource])

  return (
    <div className="space-y-4">
      {items.map(it => (
        <div key={it.id} className="border rounded p-4">
          <h3 className="font-semibold text-lg"><Link href={`/${resource}/${it.id}`}>{it.title}</Link></h3>
          <p className="text-sm text-gray-600">{it.excerpt}</p>
        </div>
      ))}
    </div>
  )
}
