"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Shield, Truck, Users, ArrowRight, Heart, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Package className="h-12 w-12 text-emerald-600" />
              <h1 className="text-4xl font-bold text-emerald-700">PharmaCare</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your trusted online pharmacy platform. Quality medications, fast delivery, and professional care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push("/auth")}>
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Licensed & Safe</CardTitle>
                <CardDescription>
                  All medications are sourced from licensed suppliers and verified for quality
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Truck className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Fast Delivery</CardTitle>
                <CardDescription>Quick and reliable delivery to your doorstep with real-time tracking</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Professional Care</CardTitle>
                <CardDescription>Expert pharmacists available for consultation and medication guidance</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* User Types */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Join as</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card
                className="group hover:shadow-lg transition-shadow cursor-pointer hover:bg-emerald-50 active:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                onClick={() => router.push("/auth")}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if ((e as any).key === "Enter") router.push("/auth")
                }}
              >
                <CardHeader className="text-center">
                  <Users className="h-10 w-10 text-emerald-600 group-hover:text-emerald-800 mx-auto mb-2" />
                  <CardTitle className="group-hover:text-emerald-700">Customer</CardTitle>
                  <CardDescription className="group-hover:text-emerald-600">Browse and order medications online</CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="group hover:shadow-lg transition-shadow cursor-pointer hover:bg-emerald-50 active:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                onClick={() => router.push("/auth")}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if ((e as any).key === "Enter") router.push("/auth")
                }}
              >
                <CardHeader className="text-center">
                  <Package className="h-10 w-10 text-emerald-600 group-hover:text-emerald-800 mx-auto mb-2" />
                  <CardTitle className="group-hover:text-emerald-700">Admin</CardTitle>
                  <CardDescription className="group-hover:text-emerald-600">Manage inventory and oversee operations</CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="group hover:shadow-lg transition-shadow cursor-pointer hover:bg-emerald-50 active:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                onClick={() => router.push("/auth")}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if ((e as any).key === "Enter") router.push("/auth")
                }}
              >
                <CardHeader className="text-center">
                  <Truck className="h-10 w-10 text-emerald-600 group-hover:text-emerald-800 mx-auto mb-2" />
                  <CardTitle className="group-hover:text-emerald-700">Delivery Staff</CardTitle>
                  <CardDescription className="group-hover:text-emerald-600">Handle deliveries and customer service</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">
            {user.role === "ADMIN" && "Manage your pharmacy operations from here."}
            {user.role === "CUSTOMER" && "Browse our wide selection of quality medications."}
            {user.role === "DELIVERY" && "View your delivery assignments and routes."}
          </p>
        </div>

        {/* Role-specific dashboard content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.role === "CUSTOMER" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Browse Products
                  </CardTitle>
                  <CardDescription>Find the medications you need</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/products">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Shop Now</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Order History
                  </CardTitle>
                  <CardDescription>View your past orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Orders
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {user.role === "ADMIN" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Manage Products
                  </CardTitle>
                  <CardDescription>Add, edit, and organize inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Admin Dashboard</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>Manage customer and staff accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {user.role === "DELIVERY" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Active Deliveries
                  </CardTitle>
                  <CardDescription>View your current delivery assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">View Deliveries</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Completed Orders
                  </CardTitle>
                  <CardDescription>Track your delivery history</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    View History
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
