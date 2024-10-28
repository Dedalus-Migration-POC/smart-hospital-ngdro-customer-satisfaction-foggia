import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  DesignAngularKitModule,
  ItNotificationService,
  NotificationPosition,
} from 'design-angular-kit'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import {
  sendQuestionnaire,
  setQuestionnaire,
} from 'src/app/pages/questionnaire/state/actions'
import { Store } from '@ngrx/store'
import { SmartHospitalState } from 'src/app/store/reducers'
import {
  selectQuestionnaireForm,
  selectSendQuestionnaireLoading,
} from 'src/app/pages/questionnaire/state/selectors'
import { map, take } from 'rxjs'
import { IQuestionnaireQuestionsList } from 'src/app/pages/questionnaire/state/service'

@Component({
  selector: 'app-quest-list',
  standalone: true,
  imports: [
    CommonModule,
    DesignAngularKitModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './quest-list.component.html',
  styleUrls: ['./quest-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestListComponent implements OnInit {
  @Input() title!: string
  @Input() id!: string
  @Input() questions!: IQuestionnaireQuestionsList[]
  @Input() sectionTitle!: string
  @Input() sectionId!: string
  @Input() activeStep!: number
  @Input() showConfirmButton!: boolean
  @Output() onForwardClick = new EventEmitter()
  @Output() onBackClick = new EventEmitter()
  constructor(
    private store: Store<SmartHospitalState>,
    private readonly notificationService: ItNotificationService,
    private translate: TranslateService,
  ) {}

  formGroup = new FormGroup({})

  createGroup(questions: IQuestionnaireQuestionsList[]): FormGroup {
    const form = new FormGroup({})
    questions.forEach((x) => {
      form.addControl(x.id, new FormControl('', Validators.required))
    })

    return form
  }
  sendQuestionnaireLoading$ = this.store.select(selectSendQuestionnaireLoading)
  ngOnInit() {
    this.formGroup = this.createGroup(this.questions)
  }

  error = false
  getError(id: string) {
    if (!this.formGroup?.get(id.toString())?.value && this.error) {
      return true
    }
    return false
  }
  private scrollToFirstError() {
    const firstInvalidControl: HTMLElement = document.querySelector(
      '.quest-error',
    ) as HTMLElement

    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      firstInvalidControl.focus()
    }
  }

  goBack() {
    this.onBackClick.emit(this.activeStep)
    this.scrollToFirstElement()
  }
  goForward() {
    if (this.formGroup.invalid) {
      this.error = true
      setTimeout(() => {
        this.scrollToFirstError()
      }, 500)
      this.notificationService.error(
        this.translate.instant('quest.quest-error-required-title'),
        this.translate.instant('quest.quest-error-required-info'),
        true,
        8000,
        NotificationPosition.Top,
      )
      return
    }
    this.store.dispatch(
      setQuestionnaire({
        payload: {
          title: this.sectionTitle,
          id: this.sectionId,
          questions: Object.keys(this.formGroup.value).map((el, i) => ({
            id: el,
            answerId: Object.values(this.formGroup.value)[i],
          })),
        },
      }),
    )
    this.onForwardClick.emit()
    this.scrollToFirstElement()
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.error = true
      setTimeout(() => {
        this.scrollToFirstError()
      }, 500)

      this.notificationService.error(
        this.translate.instant('quest.quest-error-required-title'),
        this.translate.instant('quest.quest-error-required-info'),
        true,
        8000,
        NotificationPosition.Top,
      )
      return
    }
    this.store.dispatch(
      setQuestionnaire({
        payload: {
          title: this.sectionTitle,
          id: this.sectionId,
          questions: Object.keys(this.formGroup.value).map((el, i) => ({
            id: el,
            answerId: Object.values(this.formGroup.value)[i],
          })),
        },
      }),
    )
    this.store
      .select(selectQuestionnaireForm)
      .pipe(
        take(1),
        map((questionnaire) => {
          this.store.dispatch(
            sendQuestionnaire({
              payload: {
                name: this.title,
                surveyId: this.id,
                sections: questionnaire,
              },
            }),
          ),
            console.log('+++submit', {
              name: this.title,
              id: this.id,
              sections: questionnaire,
            })
        }),
      )
      .subscribe()
  }

  scrollToFirstElement() {
    const focusElement: HTMLElement = document.querySelector(
      '.required-tag',
    ) as HTMLElement

    if (focusElement) {
      focusElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      focusElement.focus()
    }
  }
}
