import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {selectSurveyState, SurveyAdminState} from "../../store/reducer";
import {combineLatest, map, of, Subject, tap} from "rxjs";
import {Store} from "@ngrx/store";
import {Actions, ofType} from "@ngrx/effects";
import {ActivatedRoute, Router} from "@angular/router";
import {SurveyActions} from "../../store/actions";
import {ScaffoldComponent} from "../../components/scaffold/scaffold.component";
import {MatButton} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatCard} from "@angular/material/card";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {DialogService} from "../../support/dialog-service";
import {Section} from "../../repository/dto/section";
import {Survey} from "../../repository/dto/survey";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {WithSubscriptionsComponent} from "../../support/with-subscriptions-component";

export type SurveyForm = FormGroup<{
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  sections: FormArray<FormControl<Section | null>>
}>

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [
    ScaffoldComponent,
    MatButton,
    TranslateModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatCard,
    NgForOf,
    MatIcon,
    NgIf,
    MatLabel,
    MatError,
    AsyncPipe,
    MatOption,
    MatSelect,
    MatSuffix,
    MatProgressSpinner,
  ],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.scss'
})
export class SurveyFormComponent extends WithSubscriptionsComponent implements OnInit {
  editMode = false;

  surveyForm!: SurveyForm;

  state$ = this.store.select(selectSurveyState)
  surveys$ = this.state$.pipe(map(({surveys}) => surveys));
  sections$ = this.state$.pipe(map(({sections}) => sections));
  selectableSections$: Subject<Section[]> = new Subject();
  creating$ = this.state$.pipe(map(({creatingSurvey}) => creatingSurvey))

  protected readonly of = of;

  constructor(
    private store: Store<SurveyAdminState>,
    private actions: Actions,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: DialogService
  ) {
    super();
  }

  ngOnInit() {
    this.startActionsSubscription()

    this.surveyForm = this.fb.group({
      id: new FormControl<string | null>(null),
      name: new FormControl<string | null>(null, Validators.required),
      description: new FormControl<string | null>(null),
      sections: this.fb.array<Section | null>([])
    });

    this.subscriptions.push(
      combineLatest([
        this.surveyForm.valueChanges,
        this.sections$
      ]).pipe(
        map(([formChanges, sections]) => {
          this.selectableSections$.next(
            sections.filter(section => !formChanges.sections?.find(s => s?.id?.toString() === section.id?.toString()))
          )
        })
      ).subscribe()
    )

    this.selectableSections$.asObservable().subscribe(selectableSections => {
      console.log(selectableSections)
    })

    const surveyId = this.activatedRoute.snapshot.paramMap.get('surveyId');
    if (surveyId) {
      this.editMode = true
      this.subscriptions.push(this.surveys$.subscribe(surveys => {
        const survey = surveys.find(({id}) => id?.toString() === surveyId);
        if (survey) {
          this.initializeForm(survey);
        } else {
          const text = `Survey with id [${survey}] not found`
          this.dialog.error({text})
          throw new Error(text);
        }
      }))
    } else {
      this.surveyForm.controls.sections.push(
        new FormControl<Section | null>(null, Validators.required)
      )
    }
  }

  private initializeForm(survey: Survey) {
    this.surveyForm.patchValue({
      id: survey.id!.toString(),
      name: survey.name,
      description: survey.description,
    })

    survey.sections?.map((section) => {
      this.surveyForm.controls.sections.push(
        new FormControl(section, [Validators.required])
      )
    })
  }

  private startActionsSubscription() {
    this.addSubscriptions(
      this.actions.pipe(
        ofType(SurveyActions.submitSurveySucceeded),
        tap((action) => {
          this.initializeForm(action.survey)
          //FIXME
          this.dialog.success({text: "Le modifiche sono state salvate correttamente"}).afterClosed().subscribe(async () => {
            await this.router.navigate(['./form/', action.survey.id])
          })
        })
      ).subscribe(),

      this.actions.pipe(
        ofType(SurveyActions.submitSurveyFailed),
        tap(() => this.dialog.error({
          onConfirm: () => this.publish(),
          onConfirmLabel: 'Riprova',
          onCancelLabel: 'Annulla',
          onCancel: () => {
          }
        }))
      ).subscribe())
  }

  protected getTitlePlaceholder() {
    const prefix = 'admin.survey-form.title'
    const suffix = !this.surveyForm.controls['id'].value ? 'new' : 'edit'
    return `${prefix}-${suffix}`
  }

  protected addSection() {
    this.surveyForm.controls.sections.push(new FormControl(null, [Validators.required]))
    window.setTimeout(() => {
      window.scroll({behavior: 'smooth', top: document.body.scrollHeight})
    }, 100)
  }

  protected removeQuestion(index: number) {
    this.surveyForm.controls.sections.removeAt(index)
  }

  protected publish() {
    this.surveyForm.markAllAsTouched()
    if (this.surveyForm.valid) {
      console.log('VALID', this.surveyForm.value)
      this.store.dispatch(SurveyActions.submitSurvey({
        surveyForm: this.surveyForm.value
      }))
    }
  }
}
