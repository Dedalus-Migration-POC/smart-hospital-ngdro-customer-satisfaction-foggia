import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
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
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {AsyncPipe, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {Section} from "../../../repository/dto/section";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Store} from "@ngrx/store";
import {combineLatest, map, Observable} from "rxjs";
import {MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatTooltip} from "@angular/material/tooltip";
import {SurveyAdminState} from "../../../store/store";
import {selectSectionState} from "../../../store/section/reducer";
import {Survey} from "../../../repository/dto/survey";
import {MatSort, MatSortHeader, MatSortModule} from "@angular/material/sort";
import {WithSubscriptionsComponent} from "../../../support/with-subscriptions-component";
import {SectionActions} from "../../../store/section/actions";
import {MatProgressBar} from "@angular/material/progress-bar";
import {ToggleButtonComponent} from "../../../components/toggle-button/toggle-button.component";

@Component({
  selector: 'app-section-list-table',
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
    MatIcon,
    MatIconButton,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatTable,
    NgIf,
    TranslateModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatProgressSpinner,
    AsyncPipe,
    MatInput,
    MatCheckbox,
    FormsModule,
    MatTooltip,
    MatSort,
    MatSortHeader,
    MatProgressBar,
    ToggleButtonComponent
  ],
  templateUrl: './section-list-table.component.html',
  styleUrl: './section-list-table.component.scss'
})
export class SectionListTableComponent extends WithSubscriptionsComponent implements OnInit, AfterViewInit {
  @Output("onEdit") onEdit: EventEmitter<Section> = new EventEmitter();
  @Output("onDelete") deleteSection: EventEmitter<Section> = new EventEmitter();
  @Output("onRestore") restoreSection: EventEmitter<Section> = new EventEmitter();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageIndex = 0;
  pageSize = 0;
  length = 0;


  state$ = this.store.select(selectSectionState)
  sections$ = this.state$.pipe(map(({sections}) => sections?.content ?? []))
  dataSource = new MatTableDataSource<Section>();
  pageSizeOptions$!: Observable<Array<number>>;
  showDeleted$ = this.store.select(s => s.section.showDeleted)

  constructor(private store: Store<SurveyAdminState>) {
    super();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //FIXME non appaiono nel paginator
    this.pageSizeOptions$ = this.sections$.pipe(map(sections => {
        return Array.from(
          {length: Math.ceil(sections.length / 5)},
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
          const {sections, searchCriteria} = state
          const data = (sections?.content ?? []).filter(entity => showDeleted || !entity.deleted)
          this.pageIndex = sections?.pageable.pageNumber ?? 0;
          this.pageSize = searchCriteria?.tablePagination?.size ?? 0;
          this.dataSource.data = data
          this.length = sections?.totalElements ?? 0
          console.log('UPDATED')
        }),
      ).subscribe(),

      this.sort.sortChange.subscribe(({active, direction}) => {
        if (direction.length) {
          this.store.dispatch(SectionActions.fetchSections({
            tablePagination: {
              sort: `${active},${direction}`
            }
          }))
        }
      }),

      this.paginator.page.subscribe(({pageIndex, pageSize}) => {
        this.store.dispatch(SectionActions.fetchSections({
          tablePagination: {
            page: pageIndex,
            size: pageSize,
          }
        }))
      })
    )
  }

  deletingId$ = this.store.select(selectSectionState).pipe(map(s => s.editingSectionId))

  columns: string[] = ['name', 'present-in', 'version', 'actions']

  protected handleColumn(section: Section, propertyName: string): string {
    switch (propertyName) {
      case "name":
        return section.name;
      case "present-in":
        return (section.associatedSurveys ?? []).map(survey => {
          const {name, version} = survey
          return `${name} (v${version})`
        }).sort((a, b) => a < b ? -1 : 1).join(', ')
      case 'version':
        return section.version.toString()
      default:
        return ''
    }
  }

  protected changeDeletedStatus(entity: Survey) {
    if (entity.deleted) this.restoreSection.emit(entity)
    else this.deleteSection.emit(entity)
  }

}
