import Link from 'next/link'

async function fetchVideos() {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  try { const res = await fetch(`${API}/videos`, { next: { revalidate: 60 } }); if (!res.ok) return []; return await res.json() } catch (e) { return [] }
}

export default async function VideosPage() {
  const items = await fetchVideos()
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Videos</h1>
      <div className="space-y-4">
        {items.length === 0 && <div className="text-gray-600">No videos yet.</div>}
        {items.map((it: any) => (
          <div key={it.id} className="border rounded p-4">
            <h3 className="font-semibold"><Link href={`/videos/${it.id}`}>{it.title}</Link></h3>
            <p className="text-sm text-gray-600">{it.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
