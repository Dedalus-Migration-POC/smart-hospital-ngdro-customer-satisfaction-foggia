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
import {SurveyActions} from "../../../../store/survey/actions";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../../../store/store";
import {selectSurveyState} from "../../../../store/survey/reducer";
import {WithSubscriptionsComponent} from "../../../../support/with-subscriptions-component";
import {MatOption, MatSelect} from "@angular/material/select";
import {SurveyStatus} from "../../../../repository/dto/survey";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";

export type SurveyFilterForm = FormGroup<{
  name: FormControl<string | null>;
  status: FormControl<SurveyStatus | null>;
  version: FormControl<number | null>;
  startDate: FormControl<Date | null>
  endDate: FormControl<Date | null>
}>

@Component({
  selector: 'app-survey-filter',
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
  protected form!: SurveyFilterForm;

  constructor(
    private store: Store<SurveyAdminState>,
    private fb: FormBuilder,
  ) {
    super();
    this.form = this.fb.group({
      name: new FormControl<string | null>(null),
      status: new FormControl<SurveyStatus | null>(null),
      version: new FormControl<number | null>(null),
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl<Date | null>(null),
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

  state$ = this.store.select(selectSurveyState)
  fetchingSurveys$ = this.state$.pipe(map(s => s.fetchingSurveys));
  versions$ = this.state$.pipe(map(s => s.versions));

  protected search() {
    console.log('search term', this.form.value);
    this.store.dispatch(SurveyActions.fetchSurveys({form: this.form.value}));
  }

  protected readonly SurveyStatus = SurveyStatus;
  protected readonly Object = Object;
}
