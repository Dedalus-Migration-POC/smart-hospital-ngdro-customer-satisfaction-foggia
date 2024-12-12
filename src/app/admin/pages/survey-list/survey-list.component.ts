import { Component, OnInit } from '@angular/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { Store } from '@ngrx/store'
import { map, Observable, take, tap } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { Survey, SurveyStatus } from '../../repository/dto/survey'
import { WithSubscriptionsComponent } from '../../support/with-subscriptions-component'
import { SurveyActions } from '../../store/survey/actions'
import { DialogService } from '../../support/dialog-service'
import { Actions, ofType } from '@ngrx/effects'
import { SurveyAdminState } from '../../store/store'
import {
  selectSurveyFullList,
  selectSurveyState,
} from '../../store/survey/reducer'
import { SurveyListTableComponent } from './survey-list-table/survey-list-table.component'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { format } from 'date-fns'

@Component({
  selector: 'app-survey-list',
  standalone: true,
  imports: [SurveyListTableComponent, TranslateModule],
  template: ` <app-survey-list-table
    [surveys]="surveys$"
    (onEdit)="onEdit($event)"
    (onDelete)="onDelete($event)"
    (onRestore)="onRestore($event)"
    (onPublish)="onPublish($event)"
    (onUnpublish)="onUnpublish($event)"
  ></app-survey-list-table>`,
})
export class SurveyListComponent
  extends WithSubscriptionsComponent
  implements OnInit
{
  constructor(
    private store: Store<SurveyAdminState>,
    private actions: Actions,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: DialogService,
    private translate: TranslateService,
  ) {
    super()
    this.startSubscriptions()
  }

  ngOnInit() {
    this.store.dispatch(SurveyActions.fetchSurveys({}))
  }

  state$ = this.store.select(selectSurveyState)
  surveys$: Observable<Array<Survey>> = this.state$.pipe(
    map(({ surveys }) => surveys?.content ?? []),
  )
  surveyFullList$ = this.store.select(selectSurveyFullList)

  async onEdit({ survey, mode }: { survey: Survey; mode: 'edit' | 'clone' }) {
    if (mode === 'edit')
      await this.router.navigate(['survey-form', survey.id, 'edit'], {
        relativeTo: this.activatedRoute,
      })
    else {
      this.dialog.info({
        buttonsType: 'yes_no',
        text: this.translate.instant('admin.survey-list.dialog-confirm-clone', {
          name: survey.name,
        }),
        onConfirm: () =>
          this.store.dispatch(SurveyActions.cloneSurvey({ survey })),
      })
    }
  }

  protected onDelete(survey: Survey) {
    console.log(survey)
    if (survey.status === 'PUBLISHED') {
      this.dialog.error({
        buttonsType: 'ok',
        text: this.translate.instant('admin.survey-list.dialog-cannot-delete'),
        onConfirm: () => this.onDelete(survey),
      })
    } else {
      this.dialog.attention({
        buttonsType: 'yes_no',
        title: this.translate.instant(
          'admin.survey-list.dialog-confirm-delete-title',
        ),
        showIcon: true,
        text: this.translate.instant('admin.survey-list.dialog-confirm-delete'),
        onCancelLabel: this.translate.instant('cancel'),
        onConfirmLabel: this.translate.instant('confirm'),
        onConfirm: () =>
          this.store.dispatch(SurveyActions.deleteSurvey({ survey })),
      })
    }
  }

  protected onRestore(survey: Survey) {
    this.dialog.attention({
      buttonsType: 'yes_no',
      text: this.translate.instant('admin.survey-list.dialog-confirm-restore'),

      onConfirm: () =>
        this.store.dispatch(SurveyActions.restoreSurvey({ survey })),
    })
  }

  now = new Date()
  restartForm = new FormGroup({
    startDate: new FormControl(
      { value: format(this.now, 'yyyy-MM-dd'), disabled: true },
      [Validators.required],
    ),
    endDate: new FormControl<string>('', [Validators.required]),
  })

  publishForm = new FormGroup({
    startDate: new FormControl(undefined, [Validators.required]),
    endDate: new FormControl(undefined, [Validators.required]),
  })

  needToStopOtherVersion(survey: Survey) {
    let needToStopSurvey
    this.surveyFullList$
      .pipe(
        take(1),
        map((full) => {
          const list = full?.content ?? []
          let el = list.find(
            (s) =>
              s.name === survey.name &&
              [SurveyStatus.PUBLISHED].includes(s.status),
          )
          el === undefined
            ? (needToStopSurvey = undefined)
            : (needToStopSurvey = el)
        }),
      )
      .subscribe()
    return needToStopSurvey
  }
  protected onPublish(survey: Survey) {
    if (survey.status === 'DRAFT' && !this.needToStopOtherVersion(survey)) {
      this.dialog.attention({
        buttonsType: 'yes_no',
        text: this.translate.instant(
          'admin.survey-list.dialog-confirm-publish',
        ),
        form: this.publishForm,
        fields: ['startDate', 'endDate'],
        onConfirm: () =>
          this.store.dispatch(
            SurveyActions.submitSurvey({
              surveyForm: {
                ...survey,
                id: survey.id!.toString(),
                startDate: new Date(this.publishForm.value.startDate!),
                endDate: new Date(this.publishForm.value.endDate!),
              },
              submitOption: 'publish',
            }),
          ),
      })
    } else if (
      survey.status === 'DRAFT' &&
      this.needToStopOtherVersion(survey)
    ) {
      this.dialog.attention({
        buttonsType: 'confirm_cancel',
        onConfirmLabel: this.translate.instant(
          'admin.survey-list.dialog-confirm-stop-oter-survey-button',
        ),
        text: this.translate.instant(
          'admin.survey-list.dialog-confirm-stop-oter-survey',
        ),

        onConfirm: () =>
          this.store.dispatch(
            SurveyActions.unpublishSurvey({
              survey: this.needToStopOtherVersion(survey)!,
              thenPublishSurvey: survey,
            }),
          ),
      })
    } else if (survey.status === 'STOPPED') {
      this.dialog.attention({
        buttonsType: 'yes_no',
        text: this.translate.instant(
          'admin.survey-list.dialog-confirm-restart',
        ),
        form: this.restartForm,
        fields: ['startDate', 'endDate'],
        onConfirm: () =>
          this.store.dispatch(
            SurveyActions.restartSurvey({
              survey,
              endDate: this.restartForm.value.endDate || '',
            }),
          ),
      })
    }
  }

  protected onUnpublish(survey: Survey) {
    this.dialog.attention({
      buttonsType: 'yes_no',
      title: this.translate.instant(
        'admin.survey-list.dialog-confirm-unpublish-title',
      ),
      text: this.translate.instant(
        'admin.survey-list.dialog-confirm-unpublish',
        { name: survey.name },
      ),
      onConfirmLabel: this.translate.instant(
        'admin.survey-list.dialog-confirm-unpublish-confirm',
      ),
      onCancelLabel: this.translate.instant('cancel'),
      onConfirm: () =>
        this.store.dispatch(SurveyActions.unpublishSurvey({ survey })),
    })
  }

  private startSubscriptions() {
    this.addSubscriptions(
      this.actions
        .pipe(
          ofType(SurveyActions.cloneSurveySucceeded),
          tap(
            async ({ survey }) =>
              await this.router.navigate(['survey-form', survey.id, 'clone'], {
                relativeTo: this.activatedRoute,
              }),
          ),
        )
        .subscribe(),

      this.actions
        .pipe(
          ofType(SurveyActions.cloneSurveyFailed),
          tap(() =>
            this.dialog.error({
              buttonsType: 'ok',
            }),
          ),
        )
        .subscribe(),

      this.actions
        .pipe(
          ofType(SurveyActions.deleteSurveyFailed),
          tap(({ survey }) =>
            this.dialog.error({
              buttonsType: 'retry_cancel',
              onConfirm: () => this.onDelete(survey),
            }),
          ),
        )
        .subscribe(),

      this.actions
        .pipe(
          ofType(SurveyActions.restoreSurveyFailed),
          tap(({ survey }) =>
            this.dialog.error({
              buttonsType: 'retry_cancel',
              onConfirm: () => this.onDelete(survey),
            }),
          ),
        )
        .subscribe(),

      this.actions
        .pipe(
          ofType(SurveyActions.publishSurveyFailed),
          tap(() =>
            this.dialog.error({
              buttonsType: 'ok',
            }),
          ),
        )
        .subscribe(),

      this.actions
        .pipe(
          ofType(SurveyActions.unpublishSurveyFailed),
          tap(() =>
            this.dialog.error({
              buttonsType: 'ok',
            }),
          ),
        )
        .subscribe(),
    )
  }
}
