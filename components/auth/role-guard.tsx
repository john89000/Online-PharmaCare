"use client"

import type React from "react"

import { useAuth, type UserRole } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallbackPath?: string
}

export function RoleGuard({ allowedRoles, children, fallbackPath = "/" }: RoleGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || !allowedRoles.includes(user.role))) {
      router.push(fallbackPath)
    }
  }, [user, isLoading, allowedRoles, fallbackPath, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
