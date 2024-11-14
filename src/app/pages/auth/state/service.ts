import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { delay, of } from 'rxjs'
import { QUEST_LIST } from './mock'
export interface HealthcareUnit {
  id: string
  type: string
  name: string
  departments: string[]
}
const baseUrl = '/survey/api/v1/survey-session'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private readonly IS_DEV = false

  sendOtp(otp: string, payload: { surveyId: string }) {
    if (this.IS_DEV) {
      return of(true).pipe(delay(500))
    }
    return this.http.get<any>(`${baseUrl}/verify?otp=${otp}`)
  }

  fetchQuestionnaire(surveyId: string) {
    if (this.IS_DEV) {
      return of(QUEST_LIST).pipe(delay(500))
    }
    return this.http.get<any>(`${baseUrl}/create/${surveyId}`)
  }
}
