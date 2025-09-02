"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} redirectUrl={redirectUrl} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} redirectUrl={redirectUrl} />
        )}
      </div>
    </div>
  )
}
