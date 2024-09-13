import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { delay, map, Observable, of, switchMap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  constructor(private http: HttpClient) {}
  private readonly IS_DEV = true

  fetchQuestionnaire(payload: { otp: string; consent: boolean }) {
    // if (this.IS_DEV) {
    //   return of(QUEST_LIST).pipe(
    //     delay(500),
    //     map((response) => response.payments),
    //   )
    // }
    return this.http.post<any>(`send/otp/request`, payload)
  }
}
