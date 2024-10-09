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
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {Section} from "../../../repository/dto/section";

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
    MatHeaderCellDef
  ],
  templateUrl: './section-list-table.component.html',
  styleUrl: './section-list-table.component.scss'
})
export class SectionListTableComponent {
  @Input({alias: "list", required: true}) sections!: Array<Section>;
  @Output() onEdit: EventEmitter<Section> = new EventEmitter();
  @Output() onDelete: EventEmitter<Section> = new EventEmitter();

  columns: string[] = ['name', 'presence', 'version', 'actions']

}
