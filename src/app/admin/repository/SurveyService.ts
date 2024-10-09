import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Survey} from "./dto/survey";
import {IQuestionnaire} from "../../pages/questionnaire/state/service";
import {Section} from "./dto/section";

const baseUrl = '/api/v1'

@Injectable({providedIn: 'root'})
export class SurveyService {
  constructor(private http: HttpClient) {

  }

  public getSurveyList() {
    return this.http.get<Array<Survey>>(`${baseUrl}/survey`)
  }

  protected getSurveyById(id: string) {
    return this.http.get<Survey>(`${baseUrl}/survey/${id}`)
  }

  protected createSurvey(payload: IQuestionnaire) {
  }

  public getSectionList() {
    return this.http.get<Array<Section>>(`${baseUrl}/survey/section`)
  }

  public getSectionById(sectionId: string) {
    return this.http.get<Section>(`${baseUrl}/survey/section/${sectionId}`)
  }
}
