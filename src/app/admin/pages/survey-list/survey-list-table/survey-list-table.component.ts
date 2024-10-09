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
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {MatPaginator} from "@angular/material/paginator";
import {Survey} from "../../../repository/dto/survey";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-survey-list-table',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatIconButton,
    MatIcon,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatPaginator,
    TranslateModule,
    NgIf
  ],
  templateUrl: './survey-list-table.component.html',
  styleUrl: './survey-list-table.component.scss'
})
export class SurveyListTableComponent {
  @Input({alias: "list", required: true}) surveys!: Array<Survey>;
  @Output() onEdit: EventEmitter<Survey> = new EventEmitter();
  @Output() onDelete: EventEmitter<Survey> = new EventEmitter();

  columns: string[] = ['name', 'date', 'version', 'actions']

}
