'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'

export function ShopFilters({ 
  currentCategory, 
  currentSearch,
  categories 
}: { 
  currentCategory: string
  currentSearch: string
  categories: string[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState(currentSearch)

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchInput) {
      params.set('search', searchInput)
    } else {
      params.delete('search')
    }
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchInput('')
    router.push('/shop')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="bg-red-600 hover:bg-red-700">
          Search
        </Button>
      </form>

      {/* Category Filters */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700">Categories</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!currentCategory ? 'default' : 'outline'}
            onClick={() => handleCategoryChange('')}
            className={!currentCategory ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            All Products
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={currentCategory === cat ? 'default' : 'outline'}
              onClick={() => handleCategoryChange(cat)}
              className={currentCategory === cat ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(currentCategory || currentSearch) && (
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  )
}