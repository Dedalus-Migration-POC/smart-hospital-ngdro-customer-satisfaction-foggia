import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, map, Observable} from "rxjs";
import {SurveyActions} from "../../../../store/survey/actions";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../../../store/store";
import {selectSurveyState} from "../../../../store/survey/reducer";
import {WithSubscriptionsComponent} from "../../../../support/with-subscriptions-component";
import {SurveyStatus} from "../../../../repository/dto/survey";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {AsyncPipe, NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {ToggleButtonComponent} from "../../../../components/toggle-button/toggle-button.component";

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
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    NgForOf,
    TranslateModule,
    AsyncPipe,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatIconButton,
    MatTooltip,
    MatLabel,
    MatIcon,
    ToggleButtonComponent
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent extends WithSubscriptionsComponent implements OnInit {
  @Input({alias: 'showDeleted', required: true}) showDeleted!: Observable<boolean>;
  @Output('onToggleShowDeleted') toggleShowDeleted: EventEmitter<void> = new EventEmitter();
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
  versions$ = this.state$.pipe(map(s => s.versions));

  protected search() {
    this.store.dispatch(SurveyActions.fetchSurveys({form: this.form.value}));
  }

  protected readonly SurveyStatus = SurveyStatus;
  protected readonly Object = Object;
}
