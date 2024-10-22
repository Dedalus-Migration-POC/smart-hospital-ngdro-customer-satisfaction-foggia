import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, take, tap} from "rxjs";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Store} from "@ngrx/store";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatCard} from "@angular/material/card";
import {Section} from "../../repository/dto/section";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Actions, ofType} from "@ngrx/effects";
import {DialogService} from "../../support/dialog-service";
import {WithSubscriptionsComponent} from "../../support/with-subscriptions-component";
import {SectionActions} from "../../store/section/actions";
import {SurveyAdminState} from "../../store/store";
import {selectSectionState} from "../../store/section/reducer";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";

export type SectionForm = FormGroup<{
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  version: FormControl<number | null>;
  questions: FormArray<FormControl<string | null>>
}>

@Component({
  selector: 'app-section-form',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    FormsModule,
    NgForOf,
    NgIf, MatError, MatCard, AsyncPipe, MatProgressSpinner, MatOption, MatSelect
  ],
  templateUrl: './section-form.component.html',
  styleUrl: './section-form.component.scss'
})
export class SectionFormComponent extends WithSubscriptionsComponent implements OnInit, OnDestroy {
  editMode = false;
  isSectionDeleted = false;

  form: SectionForm = this.fb.group({
    id: new FormControl<number | null>(null),
    name: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
    version: new FormControl<number | null>({value: 1, disabled: true}),
    questions: this.fb.array<string | null>([])
  });

  state$ = this.store.select(selectSectionState)
  sections$ = this.state$.pipe(map(({sections}) => sections));
  creating$ = this.state$.pipe(map(({creatingSection}) => creatingSection))
  editingSectionId$ = this.state$.pipe(map(({editingSectionId}) => editingSectionId))

  constructor(
    private store: Store<SurveyAdminState>,
    private actions: Actions,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: DialogService,
    private router: Router,
    private translate: TranslateService
  ) {
    super();
  }

  protected get versions() {
    const length = this.form.controls.version.value!;
    return Array.from({length}, (_, i) => i + 1).sort((a, b) => a > b ? 1 : -1)
  }

  ngOnInit() {
    this.startActionsSubscription()

    const sectionId = this.activatedRoute.snapshot.paramMap.get('sectionId');
    if (sectionId) {
      this.editMode = true
      this.subscriptions.push(this.sections$.pipe(
        take(1),
        map(sections => {
          const section = (sections?.content ?? []).find((section) => section.id === Number(sectionId));
          this.isSectionDeleted = section?.deleted ?? false
          if (section) {
            this.initializeForm(section);
          } else {
            this.dialog.error({
              text: `Section with id [${sectionId}] not found`,
              buttonsType: 'ok',
              onConfirm: () => this.router.navigate(["/"]),
            })
          }
        })).subscribe())
    } else {
      this.form.controls.questions.push(
        new FormControl<string | null>(null, Validators.required)
      )
    }
  }

  private initializeForm(section: Section) {
    console.log({section})
    this.isSectionDeleted = section.deleted
    this.form.patchValue({
      id: section.id!,
      name: section.name,
      version: section.version,
      description: section.description,
    })

    section.questions?.map(({name}) => {
      this.form.controls.questions.push(
        new FormControl(name, [Validators.required])
      )
    })
  }

  private startActionsSubscription() {
    this.addSubscriptions(
      this.actions.pipe(
        ofType(SectionActions.submitSectionSucceeded),
        tap(() => {
          console.log('submitSectionSucceeded subscription')
          const translation = this.editMode ? 'edited' : 'created'
          this.dialog.success({
            buttonsType: 'ok',
            text: this.translate.instant(`admin.section-form.section-${translation}-dialog`)
          })
            .afterClosed().subscribe(() => this.router.navigate(['/']))
        })
      ).subscribe(),

      this.actions.pipe(
        ofType(SectionActions.submitSectionFailed),
        tap(() => this.dialog.error({
          buttonsType: 'retry_cancel',
          onConfirm: () => this.submit(),
        }))
      ).subscribe(),

      this.actions.pipe(
        ofType(SectionActions.restoreSectionSucceeded),
        tap(({section}) => this.dialog.success({
          buttonsType: 'ok',
          onConfirm: () => this.initializeForm(section),
        }))
      ).subscribe(),

      this.form.valueChanges.subscribe(value => console.log(value))
    )
  }

  protected getTitlePlaceholder() {
    const prefix = 'admin.section-form.title'
    const suffix = !this.form.controls['id'].value ? 'new' : 'edit'
    return `${prefix}-${suffix}`
  }

  protected addQuestion() {
    this.form.controls.questions.push(new FormControl(null, [Validators.required]))
    window.setTimeout(() => {
      window.scroll({behavior: 'smooth', top: document.body.scrollHeight})
    }, 100)
  }

  protected removeQuestion(index: number) {
    this.form.controls.questions.removeAt(index)
    this.form.markAsDirty()
  }

  protected submit() {
    this.form.markAllAsTouched()
    if (this.form.valid) {
      console.log('VALID', this.form.getRawValue())
      this.store.dispatch(SectionActions.submitSection({
        sectionForm: this.form.getRawValue()
      }))
    }
  }

  protected restore() {
    this.store.dispatch(SectionActions.restoreSection({section: this.form.value as Section}))
  }
}
