import {Component, OnDestroy, OnInit} from '@angular/core';
import {ScaffoldComponent} from "../../components/scaffold/scaffold.component";
import {map, of, take, tap} from "rxjs";
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

export type SectionForm = FormGroup<{
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  questions: FormArray<FormControl<string | null>>
}>

@Component({
  selector: 'app-section-form',
  standalone: true,
  imports: [
    ScaffoldComponent,
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
    NgIf, MatError, MatCard, AsyncPipe, MatProgressSpinner
  ],
  templateUrl: './section-form.component.html',
  styleUrl: './section-form.component.scss'
})
export class SectionFormComponent extends WithSubscriptionsComponent implements OnInit, OnDestroy {
  editMode = false;

  sectionForm!: SectionForm;

  state$ = this.store.select(selectSectionState)
  sections$ = this.state$.pipe(map(({sections}) => sections));
  creating$ = this.state$.pipe(map(({creatingSection}) => creatingSection))

  protected readonly of = of;

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

  ngOnInit() {
    this.startActionsSubscription()

    this.sectionForm = this.fb.group({
      id: new FormControl<string | null>(null),
      name: new FormControl<string | null>(null, Validators.required),
      description: new FormControl<string | null>(null),
      questions: this.fb.array<string | null>([])
    });

    const sectionId = this.activatedRoute.snapshot.paramMap.get('sectionId');
    if (sectionId) {
      this.editMode = true
      this.subscriptions.push(this.sections$.pipe(
        take(1),
        map(sections => {
          const section = sections.find(({id}) => id?.toString() === sectionId);
          if (section) {
            this.initializeForm(section);
          } else {
            const text = `Section with id [${sectionId}] not found`
            this.dialog.error({text})
            throw new Error(text);
          }
        })).subscribe())
    } else {
      this.sectionForm.controls.questions.push(
        new FormControl<string | null>(null, Validators.required)
      )
    }
  }

  private initializeForm(section: Section) {
    this.sectionForm.patchValue({
      id: section.id!.toString(),
      name: section.name,
      description: section.description,
    })

    section.questions?.map(({name}) => {
      this.sectionForm.controls.questions.push(
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
          this.dialog.success({text: this.translate.instant(`admin.section-form.section-${translation}-dialog`)})
            .afterClosed().subscribe(() => this.router.navigate(['/section']))
        })
      ).subscribe(),

      this.actions.pipe(
        ofType(SectionActions.submitSectionFailed),
        tap(() => this.dialog.error())
      ).subscribe())
  }

  protected getTitlePlaceholder() {
    const prefix = 'admin.section-form.title'
    const suffix = !this.sectionForm.controls['id'].value ? 'new' : 'edit'
    return `${prefix}-${suffix}`
  }

  protected addQuestion() {
    this.sectionForm.controls.questions.push(new FormControl(null, [Validators.required]))
    window.setTimeout(() => {
      window.scroll({behavior: 'smooth', top: document.body.scrollHeight})
    }, 100)
  }

  protected removeQuestion(index: number) {
    this.sectionForm.controls.questions.removeAt(index)
    this.sectionForm.markAsDirty()
  }

  protected publish() {
    this.sectionForm.markAllAsTouched()
    if (this.sectionForm.valid) {
      console.log('VALID', this.sectionForm.value)
      this.store.dispatch(SectionActions.submitSection({
        sectionForm: this.sectionForm.value
      }))
    }
  }

}
