import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HealthcareUnit } from './dto/healthcare-unit'

const baseUrl = '/survey/api/v1/survey/units'

@Injectable({ providedIn: 'root' })
export class HealthcareUnitService {
  constructor(private http: HttpClient) {}

  public find() {
    return this.http.get<Array<HealthcareUnit>>(baseUrl + '/list')
  }

  public create(unit: HealthcareUnit) {
    return unit.id
      ? this.http.post<HealthcareUnit>(baseUrl + '/update', unit)
      : this.http.post<HealthcareUnit>(baseUrl + '/create', unit)
  }

  public delete(id: number) {
    return this.http.delete<HealthcareUnit>(baseUrl + '/delete/' + id)
  }
}
