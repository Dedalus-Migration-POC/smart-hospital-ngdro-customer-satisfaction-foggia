import {Component, OnInit} from '@angular/core';
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {debounceTime, distinctUntilChanged, map} from "rxjs";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../../../store/store";
import {WithSubscriptionsComponent} from "../../../../support/with-subscriptions-component";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {selectSectionState} from "../../../../store/section/reducer";
import {SectionActions} from "../../../../store/section/actions";
import {selectSurveyState} from "../../../../store/survey/reducer";

export type SectionFilterForm = FormGroup<{
  name: FormControl<string | null>;
  version: FormControl<number | null>;
  presentIn: FormControl<number | null>
}>

@Component({
  selector: 'app-section-filter',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatIconButton,
    MatSuffix,
    MatLabel,
    MatIcon,
    MatProgressSpinner,
    NgIf,
    TranslateModule,
    AsyncPipe,
    MatButton,
    MatSelect,
    MatOption,
    NgForOf,
    ReactiveFormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent extends WithSubscriptionsComponent implements OnInit {
  protected form!: SectionFilterForm;

  constructor(
    private store: Store<SurveyAdminState>,
    private fb: FormBuilder,
  ) {
    super();
    this.form = this.fb.group({
      name: new FormControl<string | null>(null),
      version: new FormControl<number | null>(null),
      presentIn: new FormControl<number | null>(null),
    })
  }

  ngOnInit() {
    this.addSubscriptions(
      this.form.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
        )
        .subscribe(() => this.search())
    )
  }

  state$ = this.store.select(selectSectionState)
  surveyState$ = this.store.select(selectSurveyState)
  versions$ = this.state$.pipe(map(s => s.versions));
  surveys$ = this.surveyState$.pipe(map(s => s.surveys));

  protected search() {
    console.log('search term', this.form.value);
    this.store.dispatch(SectionActions.fetchSections({form: this.form.value}));
  }
}
