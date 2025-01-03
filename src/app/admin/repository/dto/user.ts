export type User = {
  jwt: string
  roles: UserRole[]
  name?: string
  unit?: string[]
}

export type UserRole = 'ADMIN' | 'OPERATOR' | 'USER'
