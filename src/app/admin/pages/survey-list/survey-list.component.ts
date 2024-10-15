import {Component} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatButton, MatIconButton} from "@angular/material/button";
import {Store} from "@ngrx/store";
import {debounceTime, distinctUntilChanged, map, Observable, of, Subject, tap} from "rxjs";
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {PrintCardComponent} from "./print-card/print-card.component";
import {SectionsCardComponent} from "./sections-card/sections-card.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {SurveyListTableComponent} from "./survey-list-table/survey-list-table.component";
import {Survey} from "../../repository/dto/survey";
import {ScaffoldComponent} from "../../components/scaffold/scaffold.component";
import {Section} from "../../repository/dto/section";
import {WithSubscriptionsComponent} from "../../support/with-subscriptions-component";
import {SurveyActions} from "../../store/survey/actions";
import {DialogService} from "../../support/dialog-service";
import {Actions, ofType} from "@ngrx/effects";
import {SurveyAdminState} from "../../store/store";
import {selectSectionState} from "../../store/section/reducer";
import {selectSurveyState} from "../../store/survey/reducer";
import {MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

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
    MatFormField,
    MatIconButton,
    MatInput,
    MatSuffix,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinner,
  ],
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.scss'
})
export class SurveyListComponent extends WithSubscriptionsComponent {
  constructor(
    private store: Store<SurveyAdminState>,
    private actions: Actions,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: DialogService,
    private translate: TranslateService
  ) {
    super();
    this.startSubscriptions();
  }

  searchField = ''
  private searchFieldSubject = new Subject<string>();

  state$ = this.store.select(selectSurveyState)
  surveys$: Observable<Array<Survey>> = this.state$.pipe(map(({surveys}) => surveys));
  sections$: Observable<Array<Section>> = this.store.select(selectSectionState).pipe(map(({sections}) => sections));
  fetchingSurveys$ = this.state$.pipe(map(s => s.fetchingSurveys));

  protected viewAnalytics() {
    console.log('missing analytics url')
  }

  protected search() {
    console.log('search term', this.searchField);
    this.store.dispatch(SurveyActions.fetchSurveys({name: this.searchField}));
  }

  protected onSearchFieldChange(searchTerm: string) {
    this.searchFieldSubject.next(searchTerm)
  }

  async onEdit(survey: Survey) {
    await this.router.navigate(['form', survey.id], {relativeTo: this.activatedRoute})
  }

  protected onDelete(survey: Survey) {
    console.log(survey)
    if (survey.status === 'ACTIVE') {
      this.dialog.error({
        buttonsType: 'ok',
        text: this.translate.instant('admin.survey-list.dialog-cannot-delete'),
        onConfirm: () => this.onDelete(survey)
      })
    } else {
      this.dialog.attention({
        buttonsType: 'yes_no',
        text: this.translate.instant('admin.survey-list.dialog-confirm-delete'),
        onConfirm: () => this.store.dispatch(SurveyActions.deleteSurvey({surveyId: survey.id!.toString()}))
      })
    }
  }

  protected onRestore({id}: Section) {
    this.dialog.attention({
      buttonsType: 'yes_no',
      text: this.translate.instant('admin.survey-list.dialog-confirm-restore'),
      onConfirm: () => this.store.dispatch(SurveyActions.restoreSurvey({surveyId: id!.toString()}))
    })
  }

  protected onPublish({id}: Section) {
    this.dialog.attention({
      buttonsType: 'yes_no',
      text: this.translate.instant('admin.survey-list.dialog-confirm-publish'),
      onConfirm: () => this.store.dispatch(SurveyActions.publishSurvey({surveyId: id!.toString()}))
    })
  }

  protected onUnpublish({id}: Section) {
    this.dialog.attention({
      buttonsType: 'yes_no',
      text: this.translate.instant('admin.survey-list.dialog-confirm-unpublish'),
      onConfirm: () => this.store.dispatch(SurveyActions.unpublishSurvey({surveyId: id!.toString()}))
    })
  }

  private startSubscriptions() {
    this.searchFieldSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((searchTerm) => {
        this.searchField = searchTerm
        this.search();
      });

    this.addSubscriptions(
      this.actions.pipe(
        ofType(SurveyActions.deleteSurveyFailed),
        tap(({survey}) => this.dialog.error({
          buttonsType: 'retry_cancel',
          onConfirm: () => this.onDelete(survey)
        }))
      ).subscribe(),

      this.actions.pipe(
        ofType(SurveyActions.restoreSurveyFailed),
        tap(({survey}) => this.dialog.error({
          buttonsType: 'retry_cancel',
          onConfirm: () => this.onDelete(survey)
        }))
      ).subscribe()
    )
  }

  protected readonly of = of;
}
