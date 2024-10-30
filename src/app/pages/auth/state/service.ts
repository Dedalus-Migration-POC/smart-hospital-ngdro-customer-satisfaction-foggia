import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { delay, of } from 'rxjs'
import { healthcareUnit, QUEST_LIST } from './mock'
export interface HealthcareUnit {
  id: string
  type: string
  name: string
  departments: string[]
}

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  constructor(private http: HttpClient) {}
  private readonly IS_DEV = false

  sendOtp(
    otp: string,
    payload: { surveyId: string; healthcareUnitId: string; structure: string },
  ) {
    if (this.IS_DEV) {
      return of(true).pipe(delay(500))
    }
    return this.http.post<any>(`api/v1/survey/check-otp?otp=${otp}`, payload)
  }

  fetchQuestionnaire(surveyId: string) {
    if (this.IS_DEV) {
      return of(QUEST_LIST).pipe(delay(500))
    }
    return this.http.get<any>(`api/v1/survey/${surveyId}`)
  }

  getHealthcareUnit(healthcareUnitId: string) {
    if (this.IS_DEV) {
      return of(healthcareUnit).pipe(delay(500))
    }
    return this.http.get<any>(
      `api/v1/survey/healthcare-unit/${healthcareUnitId}`,
    )
  }
}
