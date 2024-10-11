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
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatPaginator} from "@angular/material/paginator";
import {Survey} from "../../../repository/dto/survey";
import {DatePipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-survey-list-table',
  standalone: true,
  providers: [DatePipe],
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
  @Input({alias: "surveys", required: true}) datasource!: Array<Survey>;
  @Output() onEdit: EventEmitter<Survey> = new EventEmitter();
  @Output() onDelete: EventEmitter<Survey> = new EventEmitter();

  constructor(private datePipe: DatePipe, private translate: TranslateService) {
  }

  columns: string[] = ['name', 'startDate', 'endDate', 'status', 'version', 'actions']

  protected handleColumn(survey: Survey, propertyName: string): string {
    const key = propertyName as keyof Survey
    switch (key) {
      case 'createdAt':
      case 'startDate':
      case 'endDate':
        return this.datePipe.transform(survey[key], 'dd/MM/yyyy HH:mm') as string;
      case 'status':
        if (survey[key] === null) return '';
        return this.translate.instant('admin.survey-status.' + survey[key]);
      default:
        return survey[key] as string;
    }
  }

}
