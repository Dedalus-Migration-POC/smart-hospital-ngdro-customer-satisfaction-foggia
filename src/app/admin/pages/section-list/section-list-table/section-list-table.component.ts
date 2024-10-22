import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  MatTable
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatPaginator} from "@angular/material/paginator";
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
import {SectionActions} from "../../../store/section/actions";
import {Survey} from "../../../repository/dto/survey";

@Component({
  selector: 'app-section-list-table',
  standalone: true,
  imports: [
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
    MatTooltip
  ],
  templateUrl: './section-list-table.component.html',
  styleUrl: './section-list-table.component.scss'
})
export class SectionListTableComponent implements OnInit {
  @Input({alias: "sections", required: true}) sections$!: Observable<Array<Section>>;
  @Output("onEdit") onEdit: EventEmitter<Section> = new EventEmitter();
  @Output("onDelete") deleteSection: EventEmitter<Section> = new EventEmitter();
  @Output("onRestore") restoreSection: EventEmitter<Section> = new EventEmitter();

  datasource$!: Observable<Array<Section>>;
  pageSizeOptions$!: Observable<Array<number>>;
  showDeleted$ = this.store.select(s => s.section.showDeleted)

  constructor(private store: Store<SurveyAdminState>) {
  }

  ngOnInit() {
    this.datasource$ = combineLatest([this.sections$, this.showDeleted$]).pipe(
      map(([sections, showDeleted]) => sections.filter(entity => showDeleted ? true : !entity.deleted))
    )
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

  protected toggleShowDeleted() {
    this.store.dispatch(SectionActions.toggleShowDeleted())
  }

  protected changeDeletedStatus(entity: Survey) {
    if (entity.deleted) this.restoreSection.emit(entity)
    else this.deleteSection.emit(entity)
  }

}
