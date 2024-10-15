import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Section} from "./dto/section";
import {CreateSectionRequest} from "./dto/create-section-request";

const baseUrl = '/api/v1/survey/section'

@Injectable({providedIn: 'root'})
export class SectionService {
  constructor(private http: HttpClient) {

  }

  public list() {
    return this.http.get<Array<Section>>(baseUrl)
  }

  public findById(sectionId: string) {
    return this.http.get<Section>(`${baseUrl}/${sectionId}`)
  }

  public create(section: CreateSectionRequest) {
    return this.http.post<Section>(`${baseUrl}`, section)
  }

  public update(section: CreateSectionRequest) {
    return this.http.post<Section>(`${baseUrl}/update`, section)
  }

  public delete(sectionId: string) {
    return this.http.delete<void>(`${baseUrl}/${sectionId}`)
  }

  public restore(sectionId: string) {
    return this.http.patch<void>(`${baseUrl}/restore/${sectionId}`, null)
  }
}
