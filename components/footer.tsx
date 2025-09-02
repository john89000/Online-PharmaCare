"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function Footer() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Hide footer on auth (login/register) page
  if (pathname === "/auth") return null

  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img src="/JOHN%20OITO.jpg" alt="Store owner" className="w-full h-full object-cover" />
          </div>
          <div className="text-sm text-gray-700">© {new Date().getFullYear()} Pharmacy Platform</div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          {user ? (
            <Link href="/customer" className="text-emerald-600">Dashboard</Link>
          ) : (
            <Link href="/auth">Sign in</Link>
          )}
        </div>
      </div>
    </footer>
  )
}
