"use client"

import { useAuth } from "@/contexts/auth-context"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { User, LogOut, Settings, Package, Truck } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const { user, logout } = useAuth()

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "delivery":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Settings className="h-4 w-4" />
      case "delivery":
        return <Truck className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-emerald-700">PharmaCare</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/products" className="text-gray-700 hover:text-emerald-600 font-medium">
                Products
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="text-gray-700 hover:text-emerald-600 font-medium">
                  Dashboard
                </Link>
              )}
              {user.role === "delivery" && (
                <Link href="/delivery" className="text-gray-700 hover:text-emerald-600 font-medium">
                  Deliveries
                </Link>
              )}
            </div>
          )}

          {/* User Menu */}
          {user ? (
            <div className="flex items-center space-x-4">
              {user.role === "customer" && <CartDrawer />}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">{user.name}</span>
                      <Badge variant="secondary" className={`text-xs ${getRoleColor(user.role)}`}>
                        <span className="flex items-center space-x-1">
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </span>
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Settings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
