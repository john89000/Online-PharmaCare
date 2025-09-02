"use client"

import { useAuth } from "@/contexts/auth-context"
import { mockProducts } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, ArrowLeft, AlertTriangle, Package, Calendar, Building, Pill } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, notFound } from "next/navigation"

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect to auth if not logged in
  if (!user) {
    router.push("/auth")
    return null
  }

  const product = mockProducts.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price)
  }

  const handleAddToCart = () => {
    // This page relies on the CartProvider addToCart being available in the client tree
    // We'll lazily import the cart context to avoid module ordering issues
    import("@/contexts/cart-context").then((mod) => {
      const { useCart } = mod
      const { addToCart } = useCart()
      addToCart(product)
      router.push("/products")
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/products" className="inline-flex items-center text-emerald-600 hover:text-emerald-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="relative aspect-square">
                  <Image
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-4 py-2">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{product.category.name}</Badge>
                    {product.requiresPrescription && (
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Prescription Required
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-600">{formatPrice(product.price)}</p>
                  <p className="text-sm text-muted-foreground">{product.packSize}</p>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span className="font-medium">Availability:</span>
                  </div>
                  <div className="flex items-center">
                    {product.inStock ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-green-600 font-medium">In Stock ({product.stockQuantity} available)</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-red-600 font-medium">Out of Stock</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart */}
            {user.role === "CUSTOMER" && (
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>

                {product.requiresPrescription && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-800">Prescription Required</p>
                        <p className="text-sm text-orange-700 mt-1">
                          You'll need to upload a valid prescription before checkout.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Pill className="w-4 h-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Active Ingredient</p>
                      <p className="font-medium">{product.activeIngredient}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Dosage</p>
                      <p className="font-medium">{product.dosage}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Manufacturer</p>
                      <p className="font-medium">{product.manufacturer}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Expiry Date</p>
                      <p className="font-medium">{new Date(product.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
