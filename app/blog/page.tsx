import Link from 'next/link'
import CMSLiveWrapper from '@/components/cms-live-wrapper'

async function fetchPosts() {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  try {
    const res = await fetch(`${API}/blog`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return await res.json()
  } catch (e) { return [] }
}

export default async function BlogPage() {
  const posts = await fetchPosts()
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      <CMSLiveWrapper resource="blog" initial={posts} />
    </div>
  )
}
