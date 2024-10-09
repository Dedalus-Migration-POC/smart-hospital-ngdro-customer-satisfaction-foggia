import {Component, OnInit} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {MatButton} from "@angular/material/button";
import {Store} from "@ngrx/store";
import {selectSurveyList, SurveyAdminState} from "../../store/reducer";
import {SurveyActions} from "../../store/actions";
import {map, Observable, of} from "rxjs";
import {AsyncPipe} from "@angular/common";
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
  ],
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.scss'
})
export class SurveyListComponent implements OnInit {
  constructor(private store: Store<SurveyAdminState>,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.store.dispatch(SurveyActions.fetchSurveys());
  }

  state$ = this.store.select(selectSurveyList)
  surveys$: Observable<Array<Survey>> = this.state$.pipe(map(({surveys}) => surveys));
  loading$ = this.state$.pipe(map(s => s.fetchingSurveys));
  error$ = this.state$.pipe(map(s => s.fetchSurveysError));

  protected viewAnalytics() {
    console.log('missing analytics url')
  }

  async onEdit(survey: Survey) {
    await this.router.navigate([`./${survey.id}`], {relativeTo: this.activatedRoute})
  }

  onDelete(survey: Survey) {
    console.log(survey);
    //this.dialog.open();
  }

  protected readonly of = of;
}
