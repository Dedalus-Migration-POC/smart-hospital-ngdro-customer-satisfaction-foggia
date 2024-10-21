import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Section} from "./dto/section";
import {CreateSectionRequest} from "./dto/create-section-request";
import {PagedList} from "./dto/paged_list";
import {FilterSectionRequest} from "./dto/filter-section-request";

const baseUrl = '/api/v1/survey/section'

@Injectable({providedIn: 'root'})
export class SectionService {
  constructor(private http: HttpClient) {

  }

  public find(request: FilterSectionRequest) {
    return this.http.post<PagedList<Section>>(baseUrl, request)
  }

  public findById(sectionId: string, version: string) {
    return this.http.get<Section>(`${baseUrl}/${sectionId}/${version}`)
  }

  public create(section: CreateSectionRequest) {
    return this.http.post<Section>(`${baseUrl}/create`, section)
  }

  public update(section: CreateSectionRequest) {
    return this.http.post<Section>(`${baseUrl}/update`, section)
  }

  public clone(sectionId: string, version: string) {
    return this.http.get<Section>(`${baseUrl}/clone/${sectionId}/${version}`)
  }

  public delete(sectionId: string, version: string) {
    return this.http.delete<void>(`${baseUrl}/${sectionId}/${version}`)
  }

  public restore(sectionId: string, version: string) {
    return this.http.patch<void>(`${baseUrl}/restore/${sectionId}/${version}`, null)
  }
}
