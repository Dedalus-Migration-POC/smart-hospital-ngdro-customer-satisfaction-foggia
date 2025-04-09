import { Component, EventEmitter, Output } from '@angular/core'
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule,
} from '@angular/material/table'
import { AsyncPipe, NgIf } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { Store } from '@ngrx/store'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SurveyAdminState } from '../../../store/store'
import { selectUnitsList } from '../../../store/units/reducer'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { UnitsListActions } from '../../../store/units/actions'
import { MatProgressBar } from '@angular/material/progress-bar'
import { MatChip } from '@angular/material/chips'
import { HealthcareUnit } from 'src/app/admin/repository/dto/healthcare-unit'
import {
  selectUnitsListError,
  selectUnitsListLoading,
  selectUnitsListState,
} from 'src/app/admin/store/units/reducer'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatTooltip } from '@angular/material/tooltip'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { combineLatest, map, startWith } from 'rxjs'

@Component({
  selector: 'app-units-list-table',
  standalone: true,
  imports: [
    MatSortModule,
    MatTableModule,
    MatCell,
    MatCellDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    NgIf,
    TranslateModule,
    MatColumnDef,
    MatHeaderCellDef,
    AsyncPipe,
    FormsModule,
    MatProgressBar,
    MatButton,
    MatIcon,
    MatTooltip,
    MatIconButton,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
  ],

  templateUrl: './units-list-table.component.html',
  styleUrl: './units-list-table.component.scss',
})
export class UnitsListTableComponent {
  @Output('onEdit') onEdit: EventEmitter<HealthcareUnit> = new EventEmitter()
  @Output('onDelete') onDelete: EventEmitter<HealthcareUnit> =
    new EventEmitter()

  constructor(private store: Store<SurveyAdminState>) {}

  state$ = this.store.select(selectUnitsListState)
  loading$ = this.store.select(selectUnitsListLoading)
  error$ = this.store.select(selectUnitsListError)
  unitsList$ = this.store.select(selectUnitsList)

  searchUnitText = new FormControl<string>('')

  units$ = combineLatest([
    this.unitsList$,
    this.searchUnitText.valueChanges.pipe(startWith(this.searchUnitText.value)),
  ]).pipe(
    map(([unitsList, searchUnitText]) => {
      if (unitsList) {
        return unitsList.filter((unit) =>
          unit.name.toLowerCase().includes(searchUnitText!.toLowerCase()),
        )
      }
      return []
    }),
  )

  ngOnInit() {
    this.store.dispatch(UnitsListActions.fetchUnitsList())
  }

  columns: string[] = [
    'name',
    'type',
    'department',
    'ambulatory',
    'haveQuestionary',
    'actions',
  ]

  protected handleColumn(unit: HealthcareUnit, propertyName: string): string {
    switch (propertyName) {
      case 'name':
        return unit.name
      case 'type':
        return unit.type
      case 'department':
        return (unit.departments ?? []).find((dep) => dep === 'DEPARTMENT')
          ? 'check_circle'
          : 'cancel'
      case 'ambulatory':
        return (unit.departments ?? []).find((dep) => dep === 'AMBULATORY')
          ? 'check_circle'
          : 'cancel'
      case 'haveQuestionary':
        return unit.haveQuestionary ? 'check_circle' : 'cancel'
      default:
        return ''
    }
  }
}
