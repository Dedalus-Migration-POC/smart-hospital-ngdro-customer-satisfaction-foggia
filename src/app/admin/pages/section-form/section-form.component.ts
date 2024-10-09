import {Component, OnInit} from '@angular/core';
import {ScaffoldComponent} from "../../components/scaffold/scaffold.component";
import {map, of, tap} from "rxjs";
import {ActivatedRoute, RouterLink} from "@angular/router";
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
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngrx/store";
import {selectSectionList, SurveyAdminState} from "../../store/reducer";
import {SurveyActions} from "../../store/actions";
import {Actions, ofType} from "@ngrx/effects";
import {NgForOf, NgIf} from "@angular/common";
import {MatCard} from "@angular/material/card";

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
    NgIf, MatError, MatCard
  ],
  templateUrl: './section-form.component.html',
  styleUrl: './section-form.component.scss'
})
export class SectionFormComponent implements OnInit {
  editMode = false;

  sectionForm!: FormGroup<{
    id: FormControl<string | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    questions: FormArray<FormControl<string | null>>
  }>;

  state$ = this.store.select(selectSectionList)
  sections$ = this.state$.pipe(map(({sections}) => sections));
  loading$ = this.state$.pipe(map(({fetchingSections}) => fetchingSections))
  error$ = this.state$.pipe(map(({fetchSectionsError}) => fetchSectionsError))

  constructor(
    private store: Store<SurveyAdminState>,
    private actions: Actions,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.sectionForm = this.fb.group({
      id: new FormControl<string | null>(null, Validators.required),
      name: new FormControl<string | null>(null, Validators.required),
      description: new FormControl<string | null>(null, Validators.required),
      questions: this.fb.array<string | null>([])
    });

    const sectionId = this.activatedRoute.snapshot.paramMap.get('sectionId');
    if (sectionId) {
      this.editMode = true
      this.store.dispatch(SurveyActions.fetchSectionById({sectionId}))
    } else {
      this.sectionForm.controls.questions.push(
        new FormControl<string | null>(null, Validators.required)
      )
    }

    this.actions.pipe(
      ofType(SurveyActions.fetchSectionByIdSucceeded),
      tap(({section}) => {
        console.log({section})
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
      })).subscribe()

    this.sectionForm.valueChanges.subscribe(value => {
      console.log('form:', value)
      console.log(this.sectionForm)
    })
  }

  protected readonly of = of;

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
  }

  protected publish() {
    this.sectionForm.markAllAsTouched()
    if (this.sectionForm.valid) {
      console.log('VALID', this.sectionForm.value)
    }
  }
}
