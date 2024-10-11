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
import {selectSurveyState, SurveyAdminState} from "../../../store/reducer";
import {map, Observable} from "rxjs";
import {MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";

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
    FormsModule
  ],
  templateUrl: './section-list-table.component.html',
  styleUrl: './section-list-table.component.scss'
})
export class SectionListTableComponent implements OnInit {
  @Input({alias: "sections", required: true}) sections$!: Observable<Array<Section>>;
  @Output() onEdit: EventEmitter<Section> = new EventEmitter();
  @Output() onDelete: EventEmitter<Section> = new EventEmitter();
  @Output() onRestore: EventEmitter<Section> = new EventEmitter();

  datasource$!: Observable<Array<Section>>;

  constructor(private store: Store<SurveyAdminState>) {
  }

  ngOnInit() {
    this.datasource$ = this.sections$.pipe(map(s => s.filter(sec => !sec.deleted)))
  }

  deletingId$ = this.store.select(selectSurveyState).pipe(map(s => s.editingSectionId))

  columns: string[] = ['name', 'presence', 'version', 'actions']

  changeShowDeleted(event: any) {
    this.datasource$ = this.sections$.pipe(map(s => s.filter(sec => event.checked ? true : !sec.deleted)))
  }

  protected changeDeletedStatus(section: Section) {
    if (section.deleted) this.onRestore.emit(section)
    else this.onDelete.emit(section)
  }

}
