import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Survey} from "./dto/survey";
import {Section} from "./dto/section";
import {CreateSectionRequest} from "./dto/create-section-request";

const baseUrl = '/api/v1'

@Injectable({providedIn: 'root'})
export class SurveyService {
  constructor(private http: HttpClient) {

  }

  public getSurveyList() {
    return this.http.get<Array<Survey>>(`${baseUrl}/survey`)
  }

  public createSurvey(survey: Survey) {
    return this.http.post<Survey>(`${baseUrl}/survey/create`, survey)
  }

  public updateSurvey(survey: Survey) {
    return this.http.post<Survey>(`${baseUrl}/survey/update`, survey)
  }

  public getSurveyById(id: string) {
    return this.http.get<Survey>(`${baseUrl}/survey/${id}`)
  }

  public getSectionList() {
    return this.http.get<Array<Section>>(`${baseUrl}/survey/section`)
  }

  public getSectionById(sectionId: string) {
    return this.http.get<Section>(`${baseUrl}/survey/section/${sectionId}`)
  }

  public createSection(section: CreateSectionRequest) {
    return this.http.post<Section>(`${baseUrl}/survey/section`, section)
  }

  public updateSection(section: CreateSectionRequest) {
    return this.http.post<Section>(`${baseUrl}/survey/section/update/${section.id}`, section)
  }

  public deleteSection(sectionId: string) {
    return this.http.delete(`${baseUrl}/survey/section/${sectionId}`)
  }

  public restoreSection(sectionId: string) {
    return this.http.patch(`${baseUrl}/survey/section/restore/${sectionId}`, null)
  }
}
