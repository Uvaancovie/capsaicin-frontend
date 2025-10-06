'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'

export function JewelleryFilters({ currentSearch }: { currentSearch: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState(currentSearch)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchInput) {
      params.set('search', searchInput)
    } else {
      params.delete('search')
    }
    router.push(`/jewellery?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearchInput('')
    router.push('/jewellery')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search jewellery..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="bg-red-600 hover:bg-red-700">
          Search
        </Button>
      </form>

      {/* Clear Search */}
      {currentSearch && (
        <Button 
          variant="outline" 
          onClick={clearSearch}
          className="w-full"
        >
          Clear Search
        </Button>
      )}
    </div>
  )
}