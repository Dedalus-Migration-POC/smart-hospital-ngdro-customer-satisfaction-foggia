import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { User, UserRole } from './dto/user'
import { of, throwError } from 'rxjs'

const Users: Record<UserRole, User> = {
  ADMIN: {
    name: 'Administrator',
    roles: ['ADMIN'],
    jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJTQ01vY2siLCJpYXQiOjE3Mjg5NzQ3NTQsImV4cCI6MTc2MDUxMDc1NCwiYXVkIjoid3d3LmRlZGFsdXMuY29tIiwic3ViIjoiYWRtaW5Ac3VydmV5LmRlZGFsdXMubXMiLCJmaXJzdG5hbWUiOiJBZG1pbiIsImxhc3RuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQHN1cnZleS5tcyIsInJvbGUiOlsiUk9MRV9BRE1JTiIsIlJPTEVfT1BFUkFUT1IiLCJST0xFX1VTRVIiXX0.MURwcvADg5uUVrtcxCET6ACZjujFw2HjTMzzyBV1y8A',
  },
  OPERATOR: {
    name: 'Operator',
    roles: ['OPERATOR'],
    jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJTQ01vY2siLCJpYXQiOjE3Mjg5NzQ3NTQsImV4cCI6MTc2MDUxMDc1NCwiYXVkIjoid3d3LmRlZGFsdXMuY29tIiwic3ViIjoiYWRtaW5Ac3VydmV5LmRlZGFsdXMubXMiLCJmaXJzdG5hbWUiOiJPcGVyYXRvciIsImxhc3RuYW1lIjoiT3BlcmF0b3IiLCJlbWFpbCI6Im9wZXJhdG9yQHN1cnZleS5tcyIsInJvbGUiOlsiUk9MRV9PUEVSQVRPUiIsIlJPTEVfVVNFUiJdfQ.ma_oLROwsB0DKtunDB_-5DBE404wexdc2_6jtNCdbkw',
  },
  USER: {
    name: 'User',
    roles: ['USER'],
    jwt: '',
  },
}

@Injectable({ providedIn: 'root' })
export class IamService {
  constructor(private http: HttpClient) {}

  // public loginMock(role: UserRole) {
  //   const user = Users[role]
  //   window.localStorage.setItem('profile', JSON.stringify(user))
  //   window.document.cookie = `access_token=${user.jwt}; Path=/; Expires=Thu, 01 Jan 2025 00:00:01 GMT;`
  //   return of(user)
  // }

  public login(payload: {
    username?: string
    password?: string
    refresh_token?: string
  }) {
    let body = new URLSearchParams()
    if (payload.username && payload.password) {
      body.set('grant_type', 'password')
      body.set('scope', 'openid profile')
      body.set('client_id', 'account')
      body.set('client_secret', 'L9KdHGh6ZdJIDHpQMC2bn3zDRiZYbC0D')
      body.set('username', payload.username)
      body.set('password', payload.password)
    }
    if (payload.refresh_token) {
      body.set('grant_type', 'refresh_token')
      body.set('client_id', 'XYZ')
      body.set('refresh_token', payload.refresh_token)
    }

    return this.http.post<any>(
      `/protocol/openid-connect/token`,
      body.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    )
  }

  public logout() {
    window.document.cookie =
      'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    window.localStorage.removeItem('profile')
    window.localStorage.removeItem('token')
    return of(true)
  }

  public getProfile() {
    console.log('getProfile()')
    const record = window.localStorage.getItem('profile')
    console.log({ record })
    if (!record) return throwError(() => new Error('Could not get profile'))
    return of(JSON.parse(record) as User)
  }
}
