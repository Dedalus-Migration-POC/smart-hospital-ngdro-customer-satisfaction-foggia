import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Survey} from "./dto/survey";
import {CreateSurveyRequest} from "./dto/create-survey-request";
import {FilterSurveyRequest} from "./dto/filter-survey-request";
import {PagedList} from "./dto/paged_list";

const baseUrl = '/api/v1/survey'

@Injectable({providedIn: 'root'})
export class SurveyService {
  constructor(private http: HttpClient) {

  }

  public list() {
    return this.http.get<Array<Survey>>(`${baseUrl}`)
  }

  public findByFilter(request: FilterSurveyRequest) {
    return this.http.post<PagedList<Survey>>(`${baseUrl}/findByFilter`, request)
  }

  public findById(id: string) {
    return this.http.get<Survey>(`${baseUrl}/${id}`)
  }

  public create(survey: CreateSurveyRequest) {
    return this.http.post<Survey>(`${baseUrl}/create`, survey)
  }

  public update(survey: CreateSurveyRequest) {
    return this.http.post<Survey>(`${baseUrl}/update`, survey)
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
}
