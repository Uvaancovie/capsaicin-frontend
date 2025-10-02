"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CMSLive({ resource, initial }: { resource: 'blog' | 'advice' | 'all', initial: any[] }) {
  const [items, setItems] = useState<any[]>(initial || [])

  useEffect(() => {
    const src = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/products/stream'
    const evt = new EventSource(src)

    const handleEvent = (e: any) => {
      try {
        const data = JSON.parse(e.data)
        if (!e.type) return
        // when resource is 'all', accept both blog and advice events
        const created = e.type.endsWith('_created')
        const updated = e.type.endsWith('_updated')
        const deleted = e.type.endsWith('_deleted')
        if (resource === 'all') {
          if (created) setItems(prev => [data, ...prev])
          if (updated) setItems(prev => prev.map(it => (it.id === data.id ? data : it)))
          if (deleted) setItems(prev => prev.filter(it => it.id !== data.id))
        } else {
          if (e.type === `${resource}_created`) setItems(prev => [data, ...prev])
          if (e.type === `${resource}_updated`) setItems(prev => prev.map(it => (it.id === data.id ? data : it)))
          if (e.type === `${resource}_deleted`) setItems(prev => prev.filter(it => it.id !== data.id))
        }
      } catch (err) { }
    }

    // Subscribe to both blog and advice events to support 'all'
    const events = ['blog_created','blog_updated','blog_deleted','advice_created','advice_updated','advice_deleted']
    for (const ev of events) evt.addEventListener(ev, handleEvent)

    return () => { evt.close() }
  }, [resource])

  return (
    <div className="space-y-4">
      {items.map(it => (
        <div key={it.id} className="border rounded p-4">
          <h3 className="font-semibold text-lg"><Link href={`/blog/${it.slug || it.id}`}>{it.title}</Link></h3>
          <p className="text-sm text-gray-600">{it.excerpt}</p>
        </div>
      ))}
    </div>
  )
}
