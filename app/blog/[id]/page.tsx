import React from 'react'
import { notFound } from 'next/navigation'

async function fetchPost(id: string) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  try {
    const res = await fetch(`${API}/blog/${id}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return await res.json()
  } catch (e) { return null }
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  // `params` should be awaited in Next.js dynamic route handlers
  const { id } = await params as unknown as { id: string }
  const post = await fetchPost(String(id))
  if (!post) return notFound()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  )
}
