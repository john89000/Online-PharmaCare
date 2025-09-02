"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LogoutPage() {
  const { logout } = useAuth()

  useEffect(() => {
    // Perform logout immediately when the page mounts
    logout()
  }, [logout])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-xl w-full p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">You have been signed out</h2>
        <p className="text-sm text-muted-foreground mb-6">Thanks for visiting — you were signed out successfully.</p>

        <div className="flex gap-3">
          <Link href="/">
            <Button className="flex-1">Return to Home</Button>
          </Link>
          <Link href="/auth">
            <Button variant="outline" className="flex-1">Sign in again</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
