"use client"

import type { Product } from "@/types/product"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Eye, AlertTriangle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price)
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="relative aspect-square mb-3">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover rounded-md"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-emerald-600">{formatPrice(product.price)}</p>
            <p className="text-xs text-muted-foreground">{product.packSize}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="secondary" className="text-xs">
            {product.category.name}
          </Badge>
          {product.requiresPrescription && (
            <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Prescription
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="flex-1 text-sm mb-4">{product.description}</CardDescription>

        <div className="text-xs text-muted-foreground mb-4">
          <p>
            <span className="font-medium">Active:</span> {product.activeIngredient}
          </p>
          <p>
            <span className="font-medium">Dosage:</span> {product.dosage}
          </p>
          <p>
            <span className="font-medium">Manufacturer:</span> {product.manufacturer}
          </p>
        </div>

        <div className="flex gap-2 mt-auto">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full bg-transparent" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>

          {product.inStock && onAddToCart && (
            <Button
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
