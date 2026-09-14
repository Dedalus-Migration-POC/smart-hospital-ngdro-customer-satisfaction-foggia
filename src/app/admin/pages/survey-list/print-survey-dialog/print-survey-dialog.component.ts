import {AfterViewInit, ChangeDetectorRef, Component, Inject, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {AsyncPipe, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {PrintDataResponse} from "../../../repository/dto/print-data-response";
import {PrintSurveyComponent} from "../../../components/print-survey/print-survey.component";
import {selectUser} from "../../../store/application/reducer";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../../store/store";

@Component({
  selector: 'app-print-survey-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    NgIf,
    TranslateModule,
    AsyncPipe,
    MatDialogActions,
    MatButton,
    MatProgressSpinner,
    MatDialogClose,
    PrintSurveyComponent
  ],
  templateUrl: './print-survey-dialog.component.html',
  styleUrl: './print-survey-dialog.component.scss'
})
export class PrintSurveyDialogComponent implements AfterViewInit {
  @ViewChild(PrintSurveyComponent) printSurveyComponent!: PrintSurveyComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PrintDataResponse,
    private store: Store<SurveyAdminState>,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngAfterViewInit(): void {
    // Re-run change detection once the child's `form` (read via @ViewChild
    // in the template) has been resolved, to avoid NG0100
    // ExpressionChangedAfterItHasBeenCheckedError on the initial render.
    this.cdr.detectChanges()
  }

  protected user$ = this.store.select(selectUser)
}
