import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Survey} from "../../../repository/dto/survey";
import {AsyncPipe, DatePipe, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet} from "@angular/common";
import {DeletableEntityService} from "../../../support/deletable-entity-service";
import {map, Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../../store/store";
import {selectSurveyState, SurveyOperatingStatus} from "../../../store/survey/reducer";
import {SurveyActions} from "../../../store/survey/actions";
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
  MatTable
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-survey-list-table',
  standalone: true,
  providers: [DatePipe],
  imports: [
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
    MatPaginator
  ],
  templateUrl: './survey-list-table.component.html',
  styleUrl: './survey-list-table.component.scss'
})
export class SurveyListTableComponent extends DeletableEntityService<Survey> {
  @Input({alias: "surveys", required: true}) surveys$!: Observable<Array<Survey>>;
  @Output("onEdit") editSurvey: EventEmitter<Survey> = new EventEmitter();
  @Output("onDelete") deleteSurvey: EventEmitter<Survey> = new EventEmitter();
  @Output("onRestore") restoreSurvey: EventEmitter<Survey> = new EventEmitter();
  @Output("onPublish") publishSurvey: EventEmitter<Survey> = new EventEmitter();
  @Output("onUnpublish") unpublishSurvey: EventEmitter<Survey> = new EventEmitter();

  constructor(
    private store: Store<SurveyAdminState>,
    private datePipe: DatePipe,
    private translate: TranslateService) {
    super(store.select(s => s.survey.showDeleted), () => store.dispatch(SurveyActions.toggleShowDeleted()));
  }

  override ngOnInit() {
    this.entityList$ = this.surveys$
    this.onDelete = this.deleteSurvey
    this.onRestore = this.restoreSurvey
    super.ngOnInit();
  }

  columns: string[] = ['name', 'startDate', 'endDate', 'status', 'version', 'actions']
  operatingStatus$ = this.store.select(selectSurveyState).pipe(map(s => s.operatingStatus))

  protected handleColumn(survey: Survey, propertyName: string): string {
    if (['startDate', 'endDate'].includes(propertyName) && survey.dateRange) {
      const key = propertyName as keyof Survey['dateRange']
      return this.datePipe.transform(survey.dateRange[key], 'dd/MM/yyyy HH:mm') as string;
    }
    const key = propertyName as keyof Survey
    switch (key) {
      case 'createdAt':
        return this.datePipe.transform(survey[key], 'dd/MM/yyyy HH:mm') as string;
      case 'status':
        if (survey.deleted) return this.translate.instant('admin.survey-status.DELETED');
        else if (!survey[key]) return '';
        return this.translate.instant('admin.survey-status.' + survey[key]);
      default:
        return survey[key] as string;
    }
  }

  protected readonly SurveyOperatingStatus = SurveyOperatingStatus;
}
