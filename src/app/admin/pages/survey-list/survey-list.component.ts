import {Component} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Store} from "@ngrx/store";
import {map, Observable, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Survey} from "../../repository/dto/survey";
import {Section} from "../../repository/dto/section";
import {WithSubscriptionsComponent} from "../../support/with-subscriptions-component";
import {SurveyActions} from "../../store/survey/actions";
import {DialogService} from "../../support/dialog-service";
import {Actions, ofType} from "@ngrx/effects";
import {SurveyAdminState} from "../../store/store";
import {selectSectionState} from "../../store/section/reducer";
import {selectSurveyState} from "../../store/survey/reducer";
import {SurveyListTableComponent} from "./survey-list-table/survey-list-table.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [
    SurveyListTableComponent,
    NgIf,
    MatCard,
    MatCardContent,
    AsyncPipe,
    TranslateModule
  ],
  template: `
    <app-survey-list-table
      [surveys]="surveys$"
      (onEdit)="onEdit($event)"
      (onDelete)="onDelete($event)"
      (onRestore)="onRestore($event)"
      (onPublish)="onPublish($event)"
      (onUnpublish)="onUnpublish($event)"
    ></app-survey-list-table>`,
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


  state$ = this.store.select(selectSurveyState)
  surveys$: Observable<Array<Survey>> = this.state$.pipe(map(({surveys}) => surveys));
  sections$: Observable<Array<Section>> = this.store.select(selectSectionState).pipe(map(({sections}) => sections));

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
}
