"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, Clock, ShoppingCart, User, Zap, X } from "lucide-react"

type DashboardItem = {
  label: string
  href?: string
  icon?: React.ReactNode
  onClick?: () => void
}

interface DashboardPanelProps {
  open: boolean
  onClose: () => void
  role?: string
  items?: DashboardItem[]
}

export default function DashboardPanel({ open, onClose, role, items }: DashboardPanelProps) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const panelRef = useRef<HTMLElement | null>(null)

  // mount/unmount with a short closing animation
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined
    if (open) {
      setMounted(true)
      setClosing(false)
      // focus the panel when opened
      t = setTimeout(() => panelRef.current?.focus(), 50)
      document.body.style.overflow = "hidden"
    } else if (mounted) {
      setClosing(true)
      document.body.style.overflow = ""
      t = setTimeout(() => {
        setMounted(false)
        setClosing(false)
      }, 300)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)

    return () => {
      if (t) clearTimeout(t)
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, mounted, onClose])

  const defaultItems: DashboardItem[] = [
    { label: "Active Orders", href: "/orders", icon: <Package className="h-4 w-4" /> },
    { label: "Pending Prescriptions", href: "/prescriptions", icon: <Clock className="h-4 w-4" /> },
    { label: "Cart Items", href: "/cart", icon: <ShoppingCart className="h-4 w-4" /> },
    { label: "Profile", href: "/customer", icon: <User className="h-4 w-4" /> },
    { label: "Quick Action", href: "/customer", icon: <Zap className="h-4 w-4" /> },
  ]

  const menuItems = items || defaultItems

  if (!mounted) return null

  // responsive classes: on md+ screens slide from right (translate-x), on small screens dropdown from top (translate-y)
  const base = "fixed bg-white shadow-xl transform transition-transform duration-300 focus:outline-none"
  const mdPanel = "md:top-0 md:right-0 md:h-full md:w-80"
  const smPanel = "top-0 left-0 right-0 w-full max-h-80 overflow-auto rounded-b-md"
  const translateClass = open && !closing ? "md:translate-x-0 sm:translate-y-0" : "md:translate-x-full sm:-translate-y-full"

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-stretch">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} aria-hidden />

      <aside
        ref={panelRef as any}
        tabIndex={-1}
        className={`${base} ${mdPanel} ${smPanel} ${translateClass}`}
        aria-modal="true"
        role="dialog"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Dashboard</h3>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.href ? (
                <Link href={item.href} onClick={onClose}>
                  <Button className="w-full justify-start rounded-md px-3 py-2 hover:bg-emerald-50" variant="ghost">
                    <span className="mr-3">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </Button>
                </Link>
              ) : (
                <Button onClick={() => { item.onClick?.(); onClose(); }} className="w-full justify-start rounded-md px-3 py-2 hover:bg-emerald-50" variant="ghost">
                  <span className="mr-3">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Button>
              )}
            </div>
          ))}
        </div>
  </aside>
    </div>
  )
}
