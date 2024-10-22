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
import {selectSectionList, selectSectionState} from "../../../../store/section/reducer";
import {SectionActions} from "../../../../store/section/actions";
import {selectSurveyState} from "../../../../store/survey/reducer";
import {selectUser} from "../../../../store/application/reducer";
import {ToggleButtonComponent} from "../../../../components/toggle-button/toggle-button.component";
import {MatTooltip} from "@angular/material/tooltip";

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
    MatError,
    ToggleButtonComponent,
    MatTooltip
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent extends WithSubscriptionsComponent implements OnInit {
  showDeleted$ = this.store.select(s => s.section.showDeleted)

  protected form: SectionFilterForm = this.fb.group({
    name: new FormControl<string | null>(null),
    version: new FormControl<number | null>(null),
    presentIn: new FormControl<number | null>(null),
  });

  constructor(
    private store: Store<SurveyAdminState>,
    private fb: FormBuilder,
  ) {
    super();
  }

  ngOnInit() {
    this.addSubscriptions(
      this.form.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
        )
        .subscribe(() => {
          console.log('section filter form changed')
          this.search()
        }),

      this.surveys$.subscribe(surveys => {
        if (surveys.length) {
          this.form.controls.presentIn.enable()
        } else {
          this.form.controls.presentIn.disable()
        }
      })
    )
  }

  canShowDeleted$ = this.store.select(selectUser).pipe(map((user) => user?.roles.includes('ROLE_ADMIN') ?? false))

  state$ = this.store.select(selectSectionState)
  surveyState$ = this.store.select(selectSurveyState)
  versions$ = this.state$.pipe(map(s => s.versions));
  surveys$ = this.surveyState$.pipe(map(s => s.surveys));
  sections$ = this.store.select(selectSectionList)

  presentInOptions$ = this.sections$.pipe(map(({sections}) => sections.map(section => (section.associatedSurveys ?? []).map(ass => {
    const {id, name, version} = ass
    return {id, value: `${name} (v${version})`}
  })).flat().sort((a, b) => a.value < b.value ? -1 : 1)))

  protected search() {
    console.log('search term', this.form.value);
    this.store.dispatch(SectionActions.fetchSections({form: this.form.value}));
  }

  protected toggleDeleted() {
    this.store.dispatch(SectionActions.toggleShowDeleted());
  }
}
