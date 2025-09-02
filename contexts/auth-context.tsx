"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export type UserRole = "CUSTOMER" | "ADMIN" | "STAFF" | "DELIVERY"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  address?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, redirectUrl?: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterData, redirectUrl?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

interface RegisterData {
  email: string
  password: string
  name: string
  role: UserRole
  phone?: string
  address?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getRoleBasedRedirect = (role: UserRole): string => {
  switch (role) {
    case "CUSTOMER":
      return "/customer"
    case "ADMIN":
      return "/admin"
    case "STAFF":
      return "/staff"
    case "DELIVERY":
      return "/delivery"
    default:
      return "/"
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as UserRole,
        phone: session.user.phone,
      }
    : null

  const login = async (email: string, password: string, redirectUrl?: string) => {
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setIsLoading(false)
        return { success: false, error: "Invalid email or password" }
      }

      if (result?.ok) {
        // Handle guest cart merging
        const guestCart = localStorage.getItem("pharmacy_cart_guest")
        if (guestCart) {
          localStorage.setItem("pharmacy_cart_merge_pending", guestCart)
        }

        setIsLoading(false)

        // Get user role from session after successful login
        const response = await fetch("/api/auth/session")
        const sessionData = await response.json()

        if (sessionData?.user?.role) {
          const targetUrl = redirectUrl || getRoleBasedRedirect(sessionData.user.role as UserRole)
          router.push(targetUrl)
        }

        return { success: true }
      }

      setIsLoading(false)
      return { success: false, error: "Login failed" }
    } catch (error) {
      setIsLoading(false)
      return { success: false, error: "An error occurred during login" }
    }
  }

  const register = async (userData: RegisterData, redirectUrl?: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        // Auto-login after successful registration
        const loginResult = await login(userData.email, userData.password, redirectUrl)
        setIsLoading(false)
        return loginResult
      }

      setIsLoading(false)
      return { success: false, error: data.error || "Registration failed" }
    } catch (error) {
      setIsLoading(false)
      return { success: false, error: "An error occurred during registration" }
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    localStorage.removeItem("pharmacy_cart_merge_pending")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading: isLoading || status === "loading",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
