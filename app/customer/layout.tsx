export const metadata = {
  title: "Customer - PharmaCare",
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  // Header is rendered globally in app/layout.tsx. Do not render it here to avoid duplication.
  return <>{children}</>
}
