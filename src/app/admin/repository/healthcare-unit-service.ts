import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HealthcareUnit } from './dto/healthcare-unit'

const baseUrl = '/survey/api/v1/survey/healthcare-unit'

@Injectable({ providedIn: 'root' })
export class HealthcareUnitService {
  constructor(private http: HttpClient) {}

  public find() {
    return this.http.get<Array<HealthcareUnit | any>>(baseUrl)
  }
}
