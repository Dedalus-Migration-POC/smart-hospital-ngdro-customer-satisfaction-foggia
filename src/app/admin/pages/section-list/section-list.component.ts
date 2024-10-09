import {Component, OnInit} from '@angular/core';
import {ScaffoldComponent} from "../../components/scaffold/scaffold.component";
import {map} from "rxjs";
import {TranslateModule} from "@ngx-translate/core";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatFormField, MatInput, MatSuffix} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {SectionListTableComponent} from "./section-list-table/section-list-table.component";
import {Store} from "@ngrx/store";
import {selectSectionList, SurveyAdminState} from "../../store/reducer";
import {SurveyActions} from "../../store/actions";
import {AsyncPipe} from "@angular/common";
import {Section} from "../../repository/dto/section";

@Component({
  selector: 'app-section-list',
  standalone: true,
  imports: [
    ScaffoldComponent,
    TranslateModule,
    MatButton,
    MatIcon,
    RouterLink,
    MatInput,
    MatFormField,
    FormsModule,
    MatIconButton,
    MatLabel,
    MatSuffix,
    SectionListTableComponent,
    AsyncPipe,
  ],
  templateUrl: './section-list.component.html',
  styleUrl: './section-list.component.scss'
})
export class SectionListComponent implements OnInit {

  constructor(private store: Store<SurveyAdminState>, private activatedRoute: ActivatedRoute, private router: Router,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(SurveyActions.fetchSections())
  }

  state$ = this.store.select(selectSectionList)
  sections$ = this.state$.pipe(map(({sections}) => sections));
  loading$ = this.state$.pipe(map(({fetchingSections}) => fetchingSections))
  error$ = this.state$.pipe(map(({fetchSectionsError}) => fetchSectionsError))

  searchField = ''

  protected search() {
    console.log(this.searchField);
  }

  protected async onEdit(section: Section) {
    await this.router.navigate(['form', section.id], {relativeTo: this.activatedRoute})
  }

  protected onDelete(section: Section) {
    console.log("onDelete", section);
  }
}
