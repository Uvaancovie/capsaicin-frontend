'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, FilterIcon, X } from "lucide-react";
import { useLoading } from "@/components/loading-provider";

const categories = ['Vitamins', 'Pain Relief', 'Weight Loss', 'Jewellery'];

interface ShopFiltersProps {
  currentCategory: string;
  currentSearch: string;
}

export function ShopFilters({ currentCategory, currentSearch }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoading, setLoadingMessage } = useLoading();
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const handleCategoryChange = (category: string) => {
    setLoading(true);
    setLoadingMessage(`Loading ${category} products...`);
    
    const params = new URLSearchParams(searchParams);
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    params.delete('page'); // Reset to page 1 when filtering
    
    const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
    router.push(newUrl);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage(`Searching for "${searchInput}"...`);
    
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset to page 1 when searching
    
    const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
    router.push(newUrl);
  };

  const clearFilters = () => {
    setLoading(true);
    setLoadingMessage('Loading all products...');
    setSearchInput('');
    router.push('/shop');
  };

  const hasActiveFilters = currentCategory || currentSearch;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-4"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Category Filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Category:</span>
          </div>
          <Select
            value={currentCategory || 'all'}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {currentCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Category: {currentCategory}
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Search: "{currentSearch}"
                <button
                  onClick={() => {
                    setSearchInput('');
                    const params = new URLSearchParams(searchParams);
                    params.delete('search');
                    const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
                    router.push(newUrl);
                  }}
                  className="ml-2 hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}