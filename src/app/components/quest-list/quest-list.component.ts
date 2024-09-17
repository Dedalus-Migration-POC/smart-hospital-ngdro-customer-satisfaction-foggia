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
import { setQuestionnaire } from 'src/app/pages/questionnaire/state/actions'
import { Store } from '@ngrx/store'
import { SmartHospitalState } from 'src/app/store/reducers'
import { selectQuestionnaireForm } from 'src/app/pages/questionnaire/state/selectors'
import { map, take } from 'rxjs'

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
  @Input() questionsList!: any[]
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

  votes = ['1', '2', '3', '4', '5']

  createGroup(questionsList: any[]): FormGroup {
    const form = new FormGroup({})
    questionsList.forEach((x) => {
      form.addControl(x.id, new FormControl('', Validators.required))
    })

    return form
  }

  ngOnInit() {
    this.formGroup = this.createGroup(this.questionsList)
  }

  goBack() {
    this.onBackClick.emit(this.activeStep)
    this.scrollToFirstElement()
  }
  goForward() {
    if (this.formGroup.invalid) {
      this.notificationService.info(
        this.translate.instant('attention'),
        this.translate.instant('quest.forward-button-disabled-description'),
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
          questionsList: Object.keys(this.formGroup.value).map((el, i) => ({
            id: el,
            vote: Object.values(this.formGroup.value)[i],
          })),
        },
      }),
    )
    this.onForwardClick.emit()
    this.scrollToFirstElement()
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.notificationService.info(
        this.translate.instant('attention'),
        this.translate.instant('quest.forward-button-disabled-description'),
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
          questionsList: Object.keys(this.formGroup.value).map((el, i) => ({
            id: el,
            vote: Object.values(this.formGroup.value)[i],
          })),
        },
      }),
    )
    this.store
      .select(selectQuestionnaireForm)
      .pipe(
        take(1),
        map((questionnaire) =>
          console.log('+++submit', {
            title: this.title,
            id: this.id,
            sections: questionnaire,
          }),
        ),
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
