import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Survey} from "./dto/survey";
import {SurveyPersistRequest} from "./dto/survey-persist-request";
import {FilterSurveyRequest} from "./dto/filter-survey-request";
import {PagedList} from "./dto/paged_list";

const baseUrl = '/api/v1/survey'

@Injectable({providedIn: 'root'})
export class SurveyService {
  constructor(private http: HttpClient) {

  }

  public find(request: FilterSurveyRequest) {
    return this.http.post<PagedList<Survey>>(baseUrl, request)
  }

  public findById(id: string, version: string) {
    return this.http.get<Survey>(`${baseUrl}/${id}`)
  }

  public create(survey: SurveyPersistRequest) {
    return this.http.post<Survey>(`${baseUrl}/create`, survey)
  }

  public update(survey: SurveyPersistRequest) {
    return this.http.post<Survey>(`${baseUrl}/update`, survey)
  }

  public clone(surveyId: string, version: string) {
    return this.http.get<Survey>(`${baseUrl}/clone/${surveyId}/${version}`)
  }

  public delete(surveyId: string, version: string) {
    return this.http.delete<void>(`${baseUrl}/${surveyId}/${version}`)
  }

  public restore(surveyId: string, version: string) {
    return this.http.patch<void>(`${baseUrl}/restore/${surveyId}/${version}`, null)
  }

  public publish(surveyId: string, version: string) {
    return this.http.patch<void>(`${baseUrl}/publish/${surveyId}/${version}`, null)
  }

  public unpublish(surveyId: string, version: string) {
    return this.http.patch<void>(`${baseUrl}/unpublish/${surveyId}${version}`, null)
  }

  public print() {
    return this.http.post<void>(`${baseUrl}/print`, null)
  }
}
