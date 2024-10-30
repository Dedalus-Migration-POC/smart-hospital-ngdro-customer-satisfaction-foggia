export type User = {
  name: string;
  jwt: string;
  roles: UserRole[];
}

export type UserRole = 'ROLE_ADMIN' | 'ROLE_OPERATOR' | 'ROLE_USER'
