"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export default function AdminCMSManager({ resource }: { resource: 'blog' | 'advice' | 'videos' }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<any>({ title: '', excerpt: '', content: '', video_url: '' })
  const { toast } = useToast()
  const [previewHtml, setPreviewHtml] = useState<string>('')

  const fetchAll = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${resource}`)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to fetch', variant: 'destructive' })
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [resource])

  // Compute previewHtml using dynamic imports to avoid static build-time imports
  useEffect(() => {
    let mounted = true
    async function computePreview() {
      try {
        const [markedModule, DOMPurifyModule] = await Promise.all([
          import('marked'),
          import('dompurify')
        ])
        const DOMPurify = DOMPurifyModule.default || DOMPurifyModule
        // marked module may export parse as named or as default.parse depending on bundle
        const parseFn = (markedModule && (markedModule.parse || (markedModule.default && markedModule.default.parse))) || ((s: string) => String(s))
        const md = form.content || ''
        const html = parseFn(md || '')
        const clean = DOMPurify.sanitize(html)
        if (mounted) setPreviewHtml(clean)
      } catch (err) {
        // if modules can't be loaded (build env), fallback to plain text
        if (mounted) setPreviewHtml(String(form.content || '').replace(/</g, '&lt;'))
      }
    }

    computePreview()
    return () => { mounted = false }
  }, [form.content])

  const startAdd = () => { setEditing(null); setForm({ title: '', excerpt: '', content: '', video_url: '' }) }

  const handleSave = async () => {
    try {
      let res
      if (editing) {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${resource}/${editing.id}`, { method: 'PUT', body: JSON.stringify(form), headers: { 'Content-Type': 'application/json' } })
      } else {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${resource}`, { method: 'POST', body: JSON.stringify(form), headers: { 'Content-Type': 'application/json' } })
      }
      if (!res.ok) throw new Error('Save failed')
      await fetchAll()
      toast({ title: 'Saved', description: 'Saved successfully' })
      setEditing(null)
    } catch (e) { toast({ title: 'Error', description: String(e), variant: 'destructive' }) }
  }

  const handleEdit = (it: any) => { setEditing(it); setForm({ title: it.title || '', excerpt: it.excerpt || '', content: it.content || '', video_url: it.video_url || '' }) }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${resource}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      await fetchAll()
      toast({ title: 'Deleted' })
    } catch (e) { toast({ title: 'Error', description: String(e), variant: 'destructive' }) }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{resource.toUpperCase()}</h3>
        <Button onClick={startAdd}>Add</Button>
      </div>

      {(editing || true) && (
        <Card>
          <CardHeader>
            <CardTitle>{editing ? 'Edit' : 'New'} {resource}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              {resource === 'videos' && (
                <>
                  <Label>Video URL (or upload via backend)</Label>
                  <Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
                </>
              )}
              <Label>Excerpt</Label>
              <Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
              <Label>Content (Markdown supported)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} />
                <div className="prose max-w-none p-2 border rounded bg-white">
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(it => (
          <Card key={it.id}>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{it.title}</h4>
                  <p className="text-sm text-gray-600">{it.excerpt}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(it)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(it.id)}>Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
