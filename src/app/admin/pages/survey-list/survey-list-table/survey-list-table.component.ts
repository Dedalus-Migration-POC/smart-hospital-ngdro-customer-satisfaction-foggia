import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { Survey, SurveyStatus } from '../../../repository/dto/survey'
import {
  AsyncPipe,
  DatePipe,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgTemplateOutlet,
} from '@angular/common'
import { map, Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { SurveyAdminState } from '../../../store/store'
import {
  selectSurveyFullList,
  selectSurveyList,
  selectSurveyState,
  SurveyOperatingStatus,
} from '../../../store/survey/reducer'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { MatIconButton } from '@angular/material/button'
import { MatTooltip } from '@angular/material/tooltip'
import { MatIcon } from '@angular/material/icon'
import { FilterComponent } from './filter/filter.component'
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
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table'
import { MatChipsModule } from '@angular/material/chips'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressBar } from '@angular/material/progress-bar'
import { ToggleButtonComponent } from '../../../components/toggle-button/toggle-button.component'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { WithSubscriptionsComponent } from '../../../support/with-subscriptions-component'
import { SurveyActions } from '../../../store/survey/actions'

@Component({
  selector: 'app-survey-list-table',
  standalone: true,
  providers: [DatePipe],
  imports: [
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinner,
    NgIf,
    NgSwitch,
    MatIconButton,
    NgSwitchCase,
    MatTooltip,
    MatIcon,
    TranslateModule,
    FilterComponent,
    MatTable,
    AsyncPipe,
    MatHeaderCell,
    MatHeaderCellDef,
    MatColumnDef,
    MatCellDef,
    MatCell,
    NgTemplateOutlet,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatPaginator,
    MatProgressBar,
    ToggleButtonComponent,
    MatChipsModule,
  ],
  templateUrl: './survey-list-table.component.html',
  styleUrl: './survey-list-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyListTableComponent
  extends WithSubscriptionsComponent
  implements OnInit, AfterViewInit
{
  @Input({ alias: 'surveys', required: true }) surveys$!: Observable<
    Array<Survey>
  >
  @Output('onEdit') editSurvey: EventEmitter<{
    survey: Survey
    mode: 'edit' | 'clone'
  }> = new EventEmitter()
  @Output('onDelete') deleteSurvey: EventEmitter<Survey> = new EventEmitter()
  @Output('onRestore') restoreSurvey: EventEmitter<Survey> = new EventEmitter()
  @Output('onPublish') publishSurvey: EventEmitter<Survey> = new EventEmitter()
  @Output('onUnpublish') unpublishSurvey: EventEmitter<Survey> =
    new EventEmitter()

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  pageIndex = 0
  pageSize = 0
  length = 0

  state$ = this.store.select(selectSurveyState)
  surveyFullList$ = this.store.select(selectSurveyFullList)
  loading$ = this.store
    .select(selectSurveyList)
    .pipe(map(({ fetchingSurveys }) => fetchingSurveys))
  error$ = this.store
    .select(selectSurveyList)
    .pipe(map(({ fetchSurveysError }) => fetchSurveysError))
  dataSource = new MatTableDataSource<Survey>()
  pageSizeOptions$!: Observable<Array<number>>

  columns: string[] = [
    'name',
    'version',
    'structureType',
    'status',
    'validity',
    'createdAt',
    'actions',
  ]
  operatingStatus$ = this.store
    .select(selectSurveyState)
    .pipe(map((s) => s.operatingStatus))

  constructor(
    private store: Store<SurveyAdminState>,
    private datePipe: DatePipe,
    private translate: TranslateService,
  ) {
    super()
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.pageSizeOptions$ = this.surveys$.pipe(
      map((surveys) => {
        return Array.from({ length: Math.ceil(surveys.length / 5) }, (_, i) => {
          const value = (i + 1) * 5
          return value >= 30 ? Math.ceil(value / 10) * 10 : value
        }).filter((value, index, self) => self.indexOf(value) === index)
      }),
    )
  }

  ngAfterViewInit() {
    this.addSubscriptions(
      this.state$
        .pipe(
          map((state) => {
            const { surveys, searchCriteria } = state
            this.pageIndex = surveys?.pageable.pageNumber ?? 0
            this.pageSize = searchCriteria?.tablePagination?.size ?? 0
            this.dataSource.data = surveys?.content ?? []
            this.length = surveys?.totalElements ?? 0
          }),
        )
        .subscribe(),

      this.sort.sortChange.subscribe(({ active, direction }) => {
        if (direction.length) {
          if (active === 'validity') {
            active = 'startDate'
          }
          this.store.dispatch(
            SurveyActions.fetchSurveys({
              tablePagination: {
                sort: `${active},${direction}`,
              },
            }),
          )
        }
      }),

      this.paginator.page.subscribe(({ pageIndex, pageSize }) => {
        this.store.dispatch(
          SurveyActions.fetchSurveys({
            tablePagination: {
              page: pageIndex,
              size: pageSize,
            },
          }),
        )
      }),
    )
  }

  protected initialize() {
    this.store.dispatch(SurveyActions.fetchSurveys({}))
  }

  protected handleColumn(survey: Survey, propertyName: string): string {
    if (propertyName === 'validity' && survey.dateRange?.startDate) {
      const start = this.datePipe.transform(
        survey.dateRange.startDate,
        'dd/MM/yyyy',
      ) as string
      if (!survey.dateRange.endDate) {
        return start
      }
      const end = this.datePipe.transform(
        survey.dateRange.endDate,
        'dd/MM/yyyy',
      ) as string
      return `${start} - ${end}`
    }
    const key = propertyName as keyof Survey
    switch (key) {
      case 'createdAt':
        return this.datePipe.transform(survey[key], 'dd/MM/yyyy') as string
      case 'status':
        if (!survey[key]) return ''
        return this.translate.instant('admin.survey-status.' + survey[key])
      case 'structureType':
        return this.translate.instant(
          'admin.survey-structure.' + survey[key]?.toLocaleLowerCase(),
        )
      default:
        return survey[key] as string
    }
  }

  protected canShowEditOrCloneButton(survey: Survey) {
    return this.surveyFullList$.pipe(
      map((full) => {
        const list = full?.content ?? []
        return (
          [
            SurveyStatus.DRAFT,
            SurveyStatus.READY,
            SurveyStatus.STOPPED,
            SurveyStatus.PUBLISHED,
            SurveyStatus.EXPIRED,
          ].includes(survey.status) &&
          list.find(
            (s) =>
              s.name === survey.name &&
              s.version >= survey.version + 1 &&
              [SurveyStatus.DRAFT, SurveyStatus.READY].includes(s.status),
          ) === undefined
        )
      }),
    )
  }

  protected onEdit(survey: Survey) {
    this.editSurvey.emit({
      survey,
      mode: [
        SurveyStatus.STOPPED,
        SurveyStatus.PUBLISHED,
        SurveyStatus.EXPIRED,
      ].includes(survey.status)
        ? 'clone'
        : 'edit',
    })
  }

  protected changeDeletedStatus(entity: Survey) {
    this.deleteSurvey.emit(entity)
  }

  protected readonly SurveyOperatingStatus = SurveyOperatingStatus
  protected readonly SurveyStatus = SurveyStatus
}
