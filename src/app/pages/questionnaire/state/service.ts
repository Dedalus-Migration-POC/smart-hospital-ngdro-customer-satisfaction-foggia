import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { delay, map, Observable, of, switchMap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  constructor(private http: HttpClient) {}
  private readonly IS_DEV = true
}
