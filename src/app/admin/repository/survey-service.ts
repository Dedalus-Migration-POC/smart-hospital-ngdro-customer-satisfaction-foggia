import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Survey} from "./dto/survey";
import {SurveyPersistRequest} from "./dto/survey-persist-request";
import {FilterSurveyRequest} from "./dto/filter-survey-request";
import {PagedList} from "./dto/paged_list";
import {TablePagination} from "../support/domain/table-pagination";
import {PrintSurveyRequest} from "./dto/print-survey-request";

const baseUrl = '/api/v1/survey'

@Injectable({providedIn: 'root'})
export class SurveyService {
  constructor(private http: HttpClient) {

  }

  public find(request: FilterSurveyRequest, filter?: TablePagination) {
    return this.http.post<PagedList<Survey>>(baseUrl, request, {params: filter})
  }

  public findById(id: string) {
    return this.http.get<Survey>(`${baseUrl}/${id}`)
  }

  public create(survey: SurveyPersistRequest) {
    return this.http.post<Survey>(`${baseUrl}/create`, survey)
  }

  public update(survey: SurveyPersistRequest) {
    return this.http.post<Survey>(`${baseUrl}/update`, survey)
  }

  public clone(surveyId: string) {
    return this.http.get<Survey>(`${baseUrl}/clone/${surveyId}`)
  }

  public delete(surveyId: string) {
    return this.http.delete<void>(`${baseUrl}/${surveyId}`)
  }

  public restore(surveyId: string) {
    return this.http.patch<void>(`${baseUrl}/restore/${surveyId}`, null)
  }

  public publish(surveyId: string) {
    return this.http.patch<void>(`${baseUrl}/publish/${surveyId}`, null)
  }

  public unpublish(surveyId: string) {
    return this.http.patch<void>(`${baseUrl}/unpublish/${surveyId}`, null)
  }

  public print(request: PrintSurveyRequest) {
    return this.http.post<string>(`${baseUrl}/print`, request, {responseType: 'text' as 'json'})
  }
}
