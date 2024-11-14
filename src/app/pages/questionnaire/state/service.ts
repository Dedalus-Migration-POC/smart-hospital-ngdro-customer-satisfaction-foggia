import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { delay, of } from 'rxjs'
import { HealthcareUnit } from '../../auth/state/service'

export interface IQuestionnaireResponse {
  survey: IQuestionnaire
  structure: string
  healthcareUnit: HealthcareUnit
}
export interface IQuestionnaire {
  id?: string
  surveyId?: string
  surveySessionId?: string
  name?: string
  sections: IQuestionnaireSection[]
}
export interface IQuestionnaireSection {
  id: string
  name: string
  questions: IQuestionnaireQuestionsList[]
}
export interface IQuestionnaireQuestionsList {
  id: string
  name?: string
  answers?: IQuestionnaireAnswers[]
  answerId?: string
}
export interface IQuestionnaireAnswers {
  name: string
  description: string | null
  id: string | number
  value: string
}
const baseUrl = '/survey/api/v1/survey-session'

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  constructor(private http: HttpClient) {}
  private readonly IS_DEV = false
  sendQuestionnaire(payload: IQuestionnaire) {
    if (this.IS_DEV) {
      return of(true).pipe(delay(500))
    }
    return this.http.post<any>(`${baseUrl}/answer`, payload)
  }
}
