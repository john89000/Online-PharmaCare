export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  inStock: boolean
  stockQuantity: number
  imageUrl: string
  requiresPrescription: boolean
  manufacturer: string
  activeIngredient: string
  dosage: string
  packSize: string
  expiryDate: string
  tags: string[]
}

export interface ProductCategory {
  id: string
  name: string
  description: string
  icon: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ProductFilters {
  category?: string
  priceRange?: [number, number]
  requiresPrescription?: boolean
  inStock?: boolean
  searchQuery?: string
}
