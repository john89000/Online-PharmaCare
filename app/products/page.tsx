"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { Navbar } from "@/components/layout/navbar"
import { ProductCard } from "@/components/products/product-card"
import { ProductFiltersComponent } from "@/components/products/product-filters"
import { mockProducts, productCategories } from "@/data/products"
import type { Product, ProductFilters } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, SlidersHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProductsPage() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()
  const [filters, setFilters] = useState<ProductFilters>({})
  const [sortBy, setSortBy] = useState<string>("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = mockProducts.filter((product) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.activeIngredient.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query))

        if (!matchesSearch) return false
      }

      // Category filter
      if (filters.category && product.category.id !== filters.category) {
        return false
      }

      // Prescription filter
      if (filters.requiresPrescription !== undefined && product.requiresPrescription !== filters.requiresPrescription) {
        return false
      }

      // Stock filter
      if (filters.inStock !== undefined && product.inStock !== filters.inStock) {
        return false
      }

      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange
        if (product.price < min || product.price > max) {
          return false
        }
      }

      return true
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "category":
          return a.category.name.localeCompare(b.category.name)
        default:
          return 0
      }
    })

    return filtered
  }, [filters, sortBy])

  // Redirect to auth if not logged in
  if (!user) {
    router.push("/auth")
    return null
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product)
  }

  const clearFilters = () => {
    setFilters({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Browse our comprehensive selection of quality medications and health products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <ProductFiltersComponent
              categories={productCategories}
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>

                <p className="text-sm text-muted-foreground">{filteredAndSortedProducts.length} products found</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="price-low">Price (Low to High)</SelectItem>
                    <SelectItem value="price-high">Price (High to Low)</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={user.role === "customer" ? handleAddToCart : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">No products found</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
