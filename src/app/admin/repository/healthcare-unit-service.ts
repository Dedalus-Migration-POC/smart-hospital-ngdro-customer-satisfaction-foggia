import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { HealthcareUnit } from './dto/healthcare-unit'
import { delay, map, Observable, of } from 'rxjs'

const DEPARTMENT_TYPE = ['AMBULATORY', 'DEPARTMENT']

const baseUrl = '/survey/api/v1/survey/units'

@Injectable({ providedIn: 'root' })
export class HealthcareUnitService {
  private readonly IS_DEV = false

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

  public getDepartments(): Observable<string[]> {
    if (this.IS_DEV) {
      return of(DEPARTMENT_TYPE).pipe(delay(500))
    }
    return this.http
      .get<{ departments: string[] }>(baseUrl + '/departments')
      .pipe(map((res) => res.departments))
  }
}
