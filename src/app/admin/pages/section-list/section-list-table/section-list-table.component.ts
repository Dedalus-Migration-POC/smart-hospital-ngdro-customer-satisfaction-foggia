import {Component, EventEmitter, Input, Output} from '@angular/core';
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
import {DeletableEntityService} from "../../../support/deletable-entity-service";
import {MatTooltip} from "@angular/material/tooltip";

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
export class SectionListTableComponent extends DeletableEntityService<Section> {
  @Input({alias: "sections", required: true}) sections$!: Observable<Array<Section>>;
  @Output("onEdit") onEdit: EventEmitter<Section> = new EventEmitter();
  @Output("onDelete") deleteSection: EventEmitter<Section> = new EventEmitter();
  @Output("onRestore") restoreSection: EventEmitter<Section> = new EventEmitter();

  constructor(private store: Store<SurveyAdminState>) {
    super();
  }

  override ngOnInit() {
    this.entityList$ = this.sections$
    this.onDelete = this.deleteSection
    this.onRestore = this.restoreSection
    super.ngOnInit();
  }

  deletingId$ = this.store.select(selectSurveyState).pipe(map(s => s.editingSectionId))

  columns: string[] = ['name', 'presence', 'version', 'actions']

}
