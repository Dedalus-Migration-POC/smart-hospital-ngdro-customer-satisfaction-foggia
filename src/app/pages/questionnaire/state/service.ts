import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { delay, of } from 'rxjs'

export interface IQuestionnaire {
  id: string
  title: string
  sections: IQuestionnaireSection[]
}
export interface IQuestionnaireSection {
  id: string
  title: string
  questionsList: IQuestionnaireQuestionsList[]
}
export interface IQuestionnaireQuestionsList {
  id: string
  title?: string
  vote?: string
}

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  constructor(private http: HttpClient) {}
  private readonly IS_DEV = true

  sendQuestionnaire(payload: IQuestionnaire) {
    if (this.IS_DEV) {
      return of(true).pipe(delay(500))
    }
    return this.http.post<any>(`send/quest/request`, payload)
  }
}
