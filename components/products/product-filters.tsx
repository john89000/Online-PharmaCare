"use client"

import { useState } from "react"
import type { ProductFilters, ProductCategory } from "@/types/product"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

interface ProductFiltersProps {
  categories: ProductCategory[]
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  onClearFilters: () => void
}

export function ProductFiltersComponent({ categories, filters, onFiltersChange, onClearFilters }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange || [0, 2000])

  const handleSearchChange = (searchQuery: string) => {
    onFiltersChange({ ...filters, searchQuery })
  }

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === categoryId ? undefined : categoryId,
    })
  }

  const handlePrescriptionChange = (requiresPrescription: boolean) => {
    onFiltersChange({
      ...filters,
      requiresPrescription: filters.requiresPrescription === requiresPrescription ? undefined : requiresPrescription,
    })
  }

  const handleStockChange = (inStock: boolean) => {
    onFiltersChange({
      ...filters,
      inStock: filters.inStock === inStock ? undefined : inStock,
    })
  }

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange)
    onFiltersChange({ ...filters, priceRange: newRange })
  }

  const hasActiveFilters =
    filters.category ||
    filters.requiresPrescription !== undefined ||
    filters.inStock !== undefined ||
    filters.priceRange ||
    filters.searchQuery

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search medications..."
              value={filters.searchQuery || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Categories */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Categories</Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={filters.category === category.id}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <Label htmlFor={category.id} className="text-sm cursor-pointer">
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Price Range: KES {priceRange[0]} - KES {priceRange[1]}
            </Label>
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={2000}
              min={0}
              step={50}
              className="w-full"
            />
          </div>

          {/* Prescription Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Prescription</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prescription-required"
                  checked={filters.requiresPrescription === true}
                  onCheckedChange={() => handlePrescriptionChange(true)}
                />
                <Label htmlFor="prescription-required" className="text-sm cursor-pointer">
                  Prescription Required
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="over-counter"
                  checked={filters.requiresPrescription === false}
                  onCheckedChange={() => handlePrescriptionChange(false)}
                />
                <Label htmlFor="over-counter" className="text-sm cursor-pointer">
                  Over-the-Counter
                </Label>
              </div>
            </div>
          </div>

          {/* Stock Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Availability</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock === true}
                onCheckedChange={() => handleStockChange(true)}
              />
              <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                In Stock Only
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
