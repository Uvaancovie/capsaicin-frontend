"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Menu, ShoppingCart, User, LogOut, Search, ChevronDown } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { useLoading } from "@/components/loading-provider"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { items } = useCart()
  const { user, logout } = useAuth()
  const { setLoading, setLoadingMessage } = useLoading()
  const router = useRouter()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const categories = [
    { name: "Vitamins", href: "/shop?category=Vitamins" },
    { name: "Pain Relief", href: "/shop?category=Pain+Relief" },
    { name: "Weight Loss", href: "/shop?category=Weight+Loss" },
    { name: "Jewellery", href: "/shop?category=Jewellery" },
  ]

  const navigation = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Blog", href: "/blog" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const handleNavigation = async (href: string, label: string) => {
    setLoading(true)
    setLoadingMessage(`Loading ${label}...`)
    router.push(href)
    // Loading will be cleared by page component
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleNavigation(`/shop?search=${encodeURIComponent(searchQuery.trim())}`, 'search results')
    }
  }

  const handleCategoryClick = (category: { name: string, href: string }) => {
    handleNavigation(category.href, category.name)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Cape Pharm</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href, item.name)}
                className="text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                {item.name}
              </button>
            ))}
            
            {/* Shop Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-red-600 font-medium">
                  Shop <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleNavigation('/shop', 'Shop')}>
                  All Products
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem key={category.name} onClick={() => handleCategoryClick(category)}>
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pr-10"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="hidden md:block text-sm text-gray-600">
                  Welcome, {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
            <Link href="/admin" className="hidden md:block">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="flex items-center mb-4">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pr-10"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full px-3"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                  
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setIsOpen(false)
                        handleNavigation(item.href, item.name)
                      }}
                      className="text-gray-600 hover:text-red-600 font-medium transition-colors py-2 text-left"
                    >
                      {item.name}
                    </button>
                  ))}
                  
                  {/* Mobile Shop Categories */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-gray-800">Shop Categories</h4>
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        handleNavigation('/shop', 'Shop')
                      }}
                      className="text-gray-600 hover:text-red-600 font-medium transition-colors py-2 text-left w-full"
                    >
                      All Products
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => {
                          setIsOpen(false)
                          handleCategoryClick(category)
                        }}
                        className="text-gray-600 hover:text-red-600 font-medium transition-colors py-2 text-left w-full"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      handleNavigation('/admin', 'Admin')
                    }}
                    className="text-gray-600 hover:text-red-600 font-medium transition-colors py-2 text-left border-t pt-4"
                  >
                    Admin
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
