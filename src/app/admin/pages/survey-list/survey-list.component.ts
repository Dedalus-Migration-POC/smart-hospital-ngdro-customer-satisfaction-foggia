import {Component} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {MatButton} from "@angular/material/button";
import {Store} from "@ngrx/store";
import {selectSurveyState, SurveyAdminState} from "../../store/reducer";
import {map, Observable} from "rxjs";
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {PrintCardComponent} from "./print-card/print-card.component";
import {SectionsCardComponent} from "./sections-card/sections-card.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {SurveyListTableComponent} from "./survey-list-table/survey-list-table.component";
import {Survey} from "../../repository/dto/survey";
import {MatDialog} from "@angular/material/dialog";
import {ScaffoldComponent} from "../../components/scaffold/scaffold.component";
import {Section} from "../../repository/dto/section";

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatButton,
    SurveyListTableComponent,
    AsyncPipe,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatLabel,
    MatSelect,
    MatOption,
    MatRadioGroup,
    MatRadioButton,
    MatIcon,
    MatButtonToggleGroup,
    MatButtonToggle,
    PrintCardComponent,
    SectionsCardComponent,
    RouterLink,
    ScaffoldComponent,
    NgIf,
    NgTemplateOutlet,
  ],
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.scss'
})
export class SurveyListComponent {
  constructor(private store: Store<SurveyAdminState>,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog
  ) {
  }

  state$ = this.store.select(selectSurveyState)
  surveys$: Observable<Array<Survey>> = this.state$.pipe(map(({surveys}) => surveys));
  sections$: Observable<Array<Section>> = this.state$.pipe(map(({sections}) => sections));
  loading$ = this.state$.pipe(map(s => s.fetchingSurveys));
  error$ = this.state$.pipe(map(s => s.fetchSurveysError));

  protected viewAnalytics() {
    console.log('missing analytics url')
  }

  async onEdit(survey: Survey) {
    await this.router.navigate(['form', survey.id], {relativeTo: this.activatedRoute})
  }

  onDelete(survey: Survey) {
    console.log(survey);
    //this.dialog.open();
  }

}
