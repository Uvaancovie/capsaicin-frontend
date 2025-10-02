import Link from 'next/link'
import CMSLiveWrapper from '@/components/cms-live-wrapper'

async function fetchCombined() {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  try {
    const [bRes, aRes] = await Promise.all([
      fetch(`${API}/blog`, { next: { revalidate: 60 } }),
      fetch(`${API}/advice`, { next: { revalidate: 60 } })
    ])
    const blogs = bRes.ok ? await bRes.json() : []
    const advice = aRes.ok ? await aRes.json() : []
    const merged = [...(blogs || []), ...(advice || [])]
    // sort by createdAt descending if present
    merged.sort((x: any, y: any) => (new Date(y.createdAt || y.created_at || 0).getTime()) - (new Date(x.createdAt || x.created_at || 0).getTime()))
    return merged
  } catch (e) { return [] }
}

export default async function BlogPage() {
  const posts = await fetchCombined()
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Articles</h1>
      <CMSLiveWrapper resource="all" initial={posts} />
    </div>
  )
}
