import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Survey, SurveyStatus} from "../../../repository/dto/survey";
import {AsyncPipe, DatePipe, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet} from "@angular/common";
import {combineLatest, map, Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../../store/store";
import {selectSurveyList, selectSurveyState, SurveyOperatingStatus} from "../../../store/survey/reducer";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {FilterComponent} from "./filter/filter.component";
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
  MatTableModule
} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressBar} from "@angular/material/progress-bar";
import {ToggleButtonComponent} from "../../../components/toggle-button/toggle-button.component";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {WithSubscriptionsComponent} from "../../../support/with-subscriptions-component";
import {SurveyActions} from "../../../store/survey/actions";

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
    ToggleButtonComponent
  ],
  templateUrl: './survey-list-table.component.html',
  styleUrl: './survey-list-table.component.scss'
})
export class SurveyListTableComponent extends WithSubscriptionsComponent implements OnInit, AfterViewInit {
  @Input({alias: "surveys", required: true}) surveys$!: Observable<Array<Survey>>;
  @Output("onEdit") editSurvey: EventEmitter<{ survey: Survey, mode: 'edit' | 'clone' }> = new EventEmitter();
  @Output("onDelete") deleteSurvey: EventEmitter<Survey> = new EventEmitter();
  @Output("onRestore") restoreSurvey: EventEmitter<Survey> = new EventEmitter();
  @Output("onPublish") publishSurvey: EventEmitter<Survey> = new EventEmitter();
  @Output("onUnpublish") unpublishSurvey: EventEmitter<Survey> = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageIndex = 0;
  pageSize = 0;
  length = 0;

  state$ = this.store.select(selectSurveyState)
  loading$ = this.store.select(selectSurveyList).pipe(map(({fetchingSurveys}) => fetchingSurveys))
  dataSource = new MatTableDataSource<Survey>();
  pageSizeOptions$!: Observable<Array<number>>;
  showDeleted$ = this.store.select(s => s.survey.showDeleted)

  constructor(
    private store: Store<SurveyAdminState>,
    private datePipe: DatePipe,
    private translate: TranslateService) {
    super();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //FIXME non appaiono nel paginator
    this.pageSizeOptions$ = this.surveys$.pipe(map(surveys => {
        return Array.from(
          {length: Math.ceil(surveys.length / 5)},
          (_, i) => {
            const value = (i + 1) * 5;
            return value >= 30 ? Math.ceil(value / 10) * 10 : value;
          }
        ).filter((value, index, self) => self.indexOf(value) === index)
      })
    );
  }

  ngAfterViewInit() {
    this.addSubscriptions(
      combineLatest([this.state$, this.showDeleted$]).pipe(
        map(([state, showDeleted]) => {
          const {surveys, searchCriteria} = state
          const data = (surveys?.content ?? []).filter(entity => showDeleted || !entity.deleted)
          this.pageIndex = surveys?.pageable.pageNumber ?? 0;
          this.pageSize = searchCriteria?.tablePagination?.size ?? 0;
          this.dataSource.data = data
          this.length = surveys?.totalElements ?? 0
          console.log('UPDATED')
        }),
      ).subscribe(),

      this.sort.sortChange.subscribe(({active, direction}) => {
        if (direction.length) {
          this.store.dispatch(SurveyActions.fetchSurveys({
            tablePagination: {
              sort: `${active},${direction}`
            }
          }))
        }
      }),

      this.paginator.page.subscribe(({pageIndex, pageSize}) => {
        this.store.dispatch(SurveyActions.fetchSurveys({
          tablePagination: {
            page: pageIndex,
            size: pageSize,
          }
        }))
      })
    )
  }

  columns: string[] = ['name', 'version', 'status', 'validity', 'createdAt', 'actions']
  operatingStatus$ = this.store.select(selectSurveyState).pipe(map(s => s.operatingStatus))

  protected handleColumn(survey: Survey, propertyName: string): string {
    if (propertyName === 'validity' && survey.dateRange?.startDate) {
      const start = this.datePipe.transform(survey.dateRange.startDate, 'dd/MM/yyyy') as string;
      if (!survey.dateRange.endDate) {
        return start
      }
      const end = this.datePipe.transform(survey.dateRange.endDate, 'dd/MM/yyyy') as string;
      return `${start} - ${end}`;
    }
    const key = propertyName as keyof Survey
    switch (key) {
      case 'createdAt':
        return this.datePipe.transform(survey[key], 'dd/MM/yyyy') as string;
      case 'status':
        if (survey.deleted) return this.translate.instant('admin.survey-status.DELETED');
        else if (!survey[key]) return '';
        return this.translate.instant('admin.survey-status.' + survey[key]);
      default:
        return survey[key] as string;
    }
  }

  protected onEdit(survey: Survey) {
    this.editSurvey.emit({survey, mode: survey.status === SurveyStatus.ACTIVE ? 'clone' : 'edit'});
  }

  protected changeDeletedStatus(entity: Survey) {
    if (entity.deleted) this.restoreSurvey.emit(entity)
    else this.deleteSurvey.emit(entity)
  }

  protected readonly SurveyOperatingStatus = SurveyOperatingStatus;
  protected readonly SurveyStatus = SurveyStatus;
}
