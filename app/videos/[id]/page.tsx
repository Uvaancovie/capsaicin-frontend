import { notFound } from 'next/navigation'

async function fetchVideo(id: string) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  try { const res = await fetch(`${API}/videos`); if (!res.ok) return null; const data = await res.json(); return data.find((v: any) => String(v.id) === String(id)) || null } catch (e) { return null }
}

export default async function VideoPage({ params }: { params: { id: string } }) {
  const video = await fetchVideo(params.id)
  if (!video) return notFound()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <p className="text-gray-700 mb-4">{video.description}</p>
      {video.video_url && (
        <div className="aspect-video">
          <iframe src={video.video_url} title={video.title} className="w-full h-full" />
        </div>
      )}
    </div>
  )
}
