"use client"

import Link from "next/link"
import { Package, LogOut, Info, Home, ShoppingCart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

export default function Header() {
  const { user, logout } = useAuth()
  const { items, getTotalPrice } = useCart()

  const dashboardHref = user?.role === "ADMIN" ? "/admin" : user?.role === "DELIVERY" ? "/delivery" : "/customer"

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-7 w-7 text-emerald-600" />
            <span className="text-lg font-bold text-emerald-700">PharmaCare</span>
          </Link>

          <nav className="flex-1 flex items-center justify-center space-x-6">
            <Link href="/products" className="text-gray-700 hover:text-emerald-600 font-medium flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link href="/about" className="text-gray-700 hover:text-emerald-600 font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </Link>

            {user ? (
              <>
                <Link href="/products" className="text-gray-700 hover:text-emerald-600 font-medium">
                  Products
                </Link>

                <Link href="/orders" className="text-gray-700 hover:text-emerald-600 font-medium">
                  Orders
                </Link>

                {/* Dashboard: show role-aware dropdown for ADMIN and DELIVERY */}
                {user?.role === "ADMIN" || user?.role === "DELIVERY" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-150 focus:outline-none px-2 py-1 rounded hover:bg-emerald-50">
                        <span>Dashboard</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="w-48 p-1">
                      {user?.role === "ADMIN" ? (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/admin/orders" className="w-full">Manage Orders</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/admin/products" className="w-full">Manage Products</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/admin/prescriptions" className="w-full">Prescriptions</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="w-full">Admin Home</Link>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/delivery" className="w-full">View Deliveries</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/delivery/pending" className="w-full">Pending Pickups</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/delivery/completed" className="w-full">Completed</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/delivery/assignments" className="w-full">Assignments</Link>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href={dashboardHref} className="text-gray-700 hover:text-emerald-600 font-medium">
                    Dashboard
                  </Link>
                )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative text-gray-700 hover:text-emerald-600 focus:outline-none" aria-label="Open cart preview">
                        <ShoppingCart className="h-5 w-5" />
                        {items.length > 0 && (
                          <span className="absolute -top-2 -right-3 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-none text-white bg-emerald-600 rounded-full">
                            {items.length}
                          </span>
                        )}
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-80 p-2">
                      {items.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Your cart is empty</div>
                      ) : (
                        <div className="space-y-2">
                          {items.slice(0, 4).map((it, idx) => (
                            <DropdownMenuItem key={`${it.product.id}-${idx}`} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img src={it.product.imageUrl || "/placeholder.svg"} alt={it.product.name} className="h-10 w-10 rounded object-cover" />
                                <div className="min-w-0">
                                  <div className="text-sm font-medium truncate">{it.product.name}</div>
                                  <div className="text-xs text-muted-foreground">Qty: {it.quantity}</div>
                                </div>
                              </div>
                              <div className="text-sm font-medium">KSh {Number(it.product.price * it.quantity).toLocaleString()}</div>
                            </DropdownMenuItem>
                          ))}

                          {items.length > 4 && (
                            <div className="px-3 text-sm text-muted-foreground">+{items.length - 4} more items</div>
                          )}

                          <DropdownMenuSeparator />
                          <div className="px-3">
                            <div className="flex items-center justify-between text-sm font-medium mb-2">
                              <span>Subtotal</span>
                              <span>KSh {getTotalPrice().toLocaleString()}</span>
                            </div>
                            <div className="flex gap-2">
                              <Link href="/cart">
                                <Button variant="outline" className="w-full">View Cart</Button>
                              </Link>
                              <Link href="/checkout">
                                <Button className="w-full bg-emerald-600">Checkout</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
              </>
            ) : null}
          </nav>

          <div className="flex items-center justify-end w-36">
            {user ? (
              <Button variant="ghost" onClick={() => logout()} aria-label="Log out">
                <LogOut className="h-5 w-5 text-red-600" />
              </Button>
            ) : (
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
