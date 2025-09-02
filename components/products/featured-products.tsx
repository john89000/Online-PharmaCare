"use client"

import { ProductCard } from "@/components/products/product-card"
import { mockProducts } from "@/data/products"
import { useCart } from "@/contexts/cart-context"

export function FeaturedProducts() {
  const { addToCart } = useCart()

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommended for you</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockProducts.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
        ))}
      </div>
    </div>
  )
}
