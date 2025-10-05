'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, X } from "lucide-react";
import { useLoading } from "@/components/loading-provider";

interface JewelleryFiltersProps {
  currentSearch: string;
}

export function JewelleryFilters({ currentSearch }: JewelleryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoading, setLoadingMessage } = useLoading();
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage(`Searching jewellery for "${searchInput}"...`);
    
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    
    const newUrl = params.toString() ? `/jewellery?${params.toString()}` : '/jewellery';
    router.push(newUrl);
  };

  const clearSearch = () => {
    setLoading(true);
    setLoadingMessage('Loading all jewellery...');
    setSearchInput('');
    router.push('/jewellery');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search jewellery..."
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

        {/* Clear Search */}
        {currentSearch && (
          <Button
            variant="outline"
            onClick={clearSearch}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear Search
          </Button>
        )}
      </div>

      {/* Active Search Display */}
      {currentSearch && (
        <div className="mt-4 pt-4 border-t">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Searching: "{currentSearch}"
            <button
              onClick={clearSearch}
              className="ml-2 hover:bg-green-200 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}