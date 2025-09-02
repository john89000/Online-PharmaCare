declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      phone?: string
    }
  }

  interface User {
    role: string
    phone?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    phone?: string
  }
}
