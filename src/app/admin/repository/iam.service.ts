import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User, UserRole} from "./dto/user";
import {of, throwError} from "rxjs";

const Users: Record<UserRole, User> = {
  ROLE_ADMIN: {
    name: "Administrator",
    roles: ['ROLE_ADMIN'],
    jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJTQ01vY2siLCJpYXQiOjE3Mjg5NzQ3NTQsImV4cCI6MTc2MDUxMDc1NCwiYXVkIjoid3d3LmRlZGFsdXMuY29tIiwic3ViIjoiYWRtaW5Ac3VydmV5LmRlZGFsdXMubXMiLCJmaXJzdG5hbWUiOiJBZG1pbiIsImxhc3RuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQHN1cnZleS5tcyIsInJvbGUiOlsiUk9MRV9BRE1JTiIsIlJPTEVfT1BFUkFUT1IiLCJST0xFX1VTRVIiXX0.MURwcvADg5uUVrtcxCET6ACZjujFw2HjTMzzyBV1y8A"
  },
  ROLE_OPERATOR: {
    name: "Operator",
    roles: ['ROLE_OPERATOR'],
    jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJTQ01vY2siLCJpYXQiOjE3Mjg5NzQ3NTQsImV4cCI6MTc2MDUxMDc1NCwiYXVkIjoid3d3LmRlZGFsdXMuY29tIiwic3ViIjoiYWRtaW5Ac3VydmV5LmRlZGFsdXMubXMiLCJmaXJzdG5hbWUiOiJPcGVyYXRvciIsImxhc3RuYW1lIjoiT3BlcmF0b3IiLCJlbWFpbCI6Im9wZXJhdG9yQHN1cnZleS5tcyIsInJvbGUiOlsiUk9MRV9PUEVSQVRPUiIsIlJPTEVfVVNFUiJdfQ.ma_oLROwsB0DKtunDB_-5DBE404wexdc2_6jtNCdbkw"
  },
  ROLE_USER: {
    name: "User",
    roles: ['ROLE_USER'],
    jwt: ""
  }
}

@Injectable({providedIn: 'root'})
export class IamService {
  constructor(private http: HttpClient) {
  }

  public login(role: UserRole) {
    const user = Users[role]
    window.localStorage.setItem("profile", JSON.stringify(user));
    window.document.cookie = `access_token=${user.jwt}; Path=/; Expires=Thu, 01 Jan 2025 00:00:01 GMT;`
    return of(user);
  }

  public logout() {
    window.document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.localStorage.removeItem("profile");
    return of(true);
  }

  public getProfile() {
    console.log('getProfile()');
    const record = window.localStorage.getItem("profile");
    console.log({record});
    if (!record) return throwError(() => new Error("Could not get profile"));
    return of(JSON.parse(record) as User);
  }
}
