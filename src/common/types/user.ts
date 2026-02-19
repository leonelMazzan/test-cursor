export interface User {
  id?: number
  email: string
  passwordHash: string
}

export interface AuthUser {
  id: number
  email: string
}
