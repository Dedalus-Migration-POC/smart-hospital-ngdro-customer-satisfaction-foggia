import { Component, EventEmitter, Output, ViewChild } from '@angular/core'
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { AsyncPipe, NgIf } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { Store } from '@ngrx/store'
import { FormsModule } from '@angular/forms'
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

@Component({
  selector: 'app-units-list-table',
  standalone: true,
  imports: [
    MatPaginatorModule,
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
    MatChip,
    MatButton,
    MatIcon,
    MatTooltip,
    MatIconButton,
  ],
  templateUrl: './units-list-table.component.html',
  styleUrl: './units-list-table.component.scss',
})
export class UnitsListTableComponent {
  @Output('onEdit') onEdit: EventEmitter<HealthcareUnit> = new EventEmitter()
  @Output('onDelete') onDelete: EventEmitter<HealthcareUnit> =
    new EventEmitter()

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(private store: Store<SurveyAdminState>) {}

  state$ = this.store.select(selectUnitsListState)
  loading$ = this.store.select(selectUnitsListLoading)
  error$ = this.store.select(selectUnitsListError)
  unitsList$ = this.store.select(selectUnitsList)

  ngOnInit() {
    this.store.dispatch(UnitsListActions.fetchUnitsList())
  }

  columns: string[] = [
    'name',
    'type',
    'departments',
    'haveQuestionary',
    'actions',
  ]

  protected handleColumn(unit: HealthcareUnit, propertyName: string): string {
    switch (propertyName) {
      case 'name':
        return unit.name
      case 'type':
        return unit.type
      case 'departments':
        return (unit.departments ?? [])
          .map((department) => {
            return department
          })
          .join(', ')
      case 'haveQuestionary':
        return unit.haveQuestionary ? 'si' : 'no'
      default:
        return ''
    }
  }
}
