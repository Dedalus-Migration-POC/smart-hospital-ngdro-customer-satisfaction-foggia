import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { delay, of } from 'rxjs'

export interface IQuestionnaire {
  id?: string
  surveyId?: string
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
    return this.http.post<any>(`api/v1/survey/answer`, payload)
  }
}
